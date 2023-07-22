import {
  login,
  logout,
  getInfo,
  backlog
} from '@/api/login'
import {
  Message
} from 'element-ui'
import {
  getToken,
  setToken,
  removeToken,
  getMobile,
  setMobile,
  removeMobile,
  getId,
  setId,
  removeId
} from '@/utils/auth'

const user = {
  state: {
    crm_token: getToken(),
    crm_id:'',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    crm_mobile: '',
    agent_number: '', //代办数
    ineffective_count:'',//已过期
    will_effective_count:'',//即将过期
    customer_store_ids:'',
    provider_status:'',
    provider_type:'',
    provider_status_foWeb:'',//服务商服务状态:0为开启;1为关闭
    provider_id:"", //服务商id
  },

  mutations: {
    SET_TOKEN: (state, crm_token) => {
      state.crm_token = crm_token
    },
    SET_ID: (state, crm_id) => {
      state.crm_id = crm_id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions || []
    },
    SET_MOBILE: (state, crm_mobile) => {
      state.crm_mobile = crm_mobile
    },
    // 代办数
    SET_AGENT_NUMBER: (state, agent_number) => {
      state.agent_number = agent_number
    },
    // 已过期
    SET_INEFFECTIVE_COUNT: (state, ineffective_count) => {
      state.ineffective_count = ineffective_count
    },
    // 即将过期
    SET_WILL_EFFECTIVE_COUNT: (state, will_effective_count) => {
      state.will_effective_count = will_effective_count
    },
    // 代办事项分配给我的客户跳转客户列表参数
    SET_CUSTOMER_STORE_IDS: (state, customer_store_ids) => {
      state.customer_store_ids = customer_store_ids
    },
    
    SET_PROVIDER_STATUS: (state, provider_status) => {
      state.provider_status = provider_status
    },
    SET_PROVIDER_TYPE: (state, provider_type) => {
      state.provider_type = provider_type
    },
    SET_PROVIDER_STATUS_FOWEB: (state, provider_status_foWeb) => {
      state.provider_status_foWeb = provider_status_foWeb
    },
    SET_PROVIDER_ID: (state, provider_id) => {
      state.provider_id = provider_id
    }, 
  },

  actions: {
    // 待办数
    getBacklog({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        backlog(state.crm_token).then(res => {
          commit('SET_AGENT_NUMBER', res.data.count)
          commit('SET_INEFFECTIVE_COUNT', res.data.ineffectiveCount)
          commit('SET_WILL_EFFECTIVE_COUNT', res.data.willEffectiveCount)
          commit('SET_CUSTOMER_STORE_IDS', res.data.customerStoreIds)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password
        }).then(res => {
          setToken(res.data.access_token)
          sessionStorage.setItem("CRM-Token", JSON.stringify(res.data.access_token));
          commit('SET_TOKEN', res.data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      dispatch,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.crm_token).then(res => {
          const avatar = res.data.headImgUrl == "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + res.data.headImgUrl;
          let role = []
          if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            let arr = []
            arr = res.data.roles.filter(item => {
              return item.code == 'ADMIN' || item.code == 'admin'
            })
            if (arr.length > 0) {
              role = ['admin']
            } else {
              if (res.data.permissions == null) {
                role = []
              } else {
                role = res.data.permissions
              }
            }
            if (!role.length) {
              Message({
                message: '没有访问权限',
                type: 'warning'
              })
              removeToken()
              return
            }
            commit('SET_ROLES', res.data.roles)
            commit('SET_PERMISSIONS', role)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          //服务商状态
          if(res.data.provider){
            if(res.data.provider.providerType == 0){
              commit('SET_PROVIDER_TYPE', '业务员')
            }else if(res.data.provider.providerType == 1){
              commit('SET_PROVIDER_TYPE', '合伙人')
            }else if(res.data.provider.providerType == 2){
              commit('SET_PROVIDER_TYPE', '服务商')
            }
            commit('SET_PROVIDER_STATUS', res.data.provider.status)
            //服务商服务状态:0为开启;1为关闭
            commit('SET_PROVIDER_STATUS_FOWEB', res.data.provider.providerStatusFoWeb) 
            commit('SET_PROVIDER_ID', res.data.provider.id) 
          }else{
            commit('SET_PROVIDER_STATUS', '')
            commit('SET_PROVIDER_TYPE', '')
            commit('SET_PROVIDER_STATUS_FOWEB', '')
            commit('SET_PROVIDER_ID', '')
          }
          setMobile(res.data.mobile)
          setId(res.data.id)
          commit('SET_ID', res.data.id)
          commit('SET_NAME', res.data.nickname)
          commit('SET_AVATAR', avatar)
          commit('SET_MOBILE', res.data.mobile)
          resolve(role)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout({
          access_token: state.crm_token
        }).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ID', '')
          commit('SET_NAME', [])
          commit('SET_AVATAR', [])
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_MOBILE', '')
          commit('SET_PROVIDER_STATUS', '')
          commit('SET_PROVIDER_TYPE', '')
          commit('SET_PROVIDER_STATUS_FOWEB', '')
          removeToken()
          sessionStorage.setItem("CRM-Token", '');
          removeMobile()
          removeId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ID', '')
        commit('SET_NAME', [])
        commit('SET_AVATAR', [])
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_MOBILE', '')
        commit('SET_PROVIDER_STATUS', '')
        commit('SET_PROVIDER_TYPE', '')
        commit('SET_PROVIDER_STATUS_FOWEB', '')
        removeToken()
        removeId()
        sessionStorage.setItem("CRM-Token", '');
        resolve()
      })
    },
  }
}

export default user
