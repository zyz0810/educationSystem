import {
  dict
} from "@/api/common";
const state = {
  //客户来源
  source_List: [],
  //客户跟进类型设置
  follow_List: [],
  //客户级别
  level_List: [],
}

const mutations = {
  set_source_List: (state, list) => {
    state.source_List = list
  },
  set_follow_List: (state, list) => {
    state.follow_List = list
  },
  set_level_List: (state, list) => {
    state.level_List = list
  },
}

const actions = {
  getDict({
    commit
  }) {
    dict().then(res => {
      const data = res.data
      const source_List = data.find(item => item.dictType == 'customer_source')
      commit('set_source_List', source_List.dataList)
      const follow_List = data.find(item => item.dictType == 'customer_follow')
      commit('set_follow_List', follow_List.dataList)
      const level_List = data.find(item => item.dictType == 'customer_level')
      commit('set_level_List', level_List.dataList)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
