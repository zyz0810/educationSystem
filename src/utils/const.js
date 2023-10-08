export default {

  install(Vue,options){
    let domainName = '';
    if(window.location.host.includes('118.195.250.220')){
      domainName = 'http://118.195.250.220:8200/';//测试环境
    }else{
      // domainName = window.location.protocol+"//"+window.location.host+"/";
      domainName = 'http://118.195.250.220:8200/'; //生产环境
    }
    Vue.prototype.global = {
      tableEmpty: '@/assets/image/table_empty.png',
      domainName:domainName,
    };

  }

}
