import {getRouteFareByCityAndRouteName} from '../api'
export const state = {
    routeFare:{}, //縣市的票價資訊
    //第一層:city
    //第二層:route
  };
  export const actions = {
  
  }
  export const mutations = {
    getRouteFareBy(state:any,payLoad:any){  //取得縣市所有公車路線，(資料減肥:一開始只需要公車路線RouteName.ZH_tw就好了?!)
        if(!state.routeFare[payLoad.City].routeFare[payLoad.City][payLoad.RouteName.Zh_tw]){
            console.log(`請求${payLoad.City}${payLoad.RouteName.Zh_tw}資料`)
            getRouteFareByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then(res=>{
                state.routeFare[payLoad.City] = res.data
                console.log(state.routeFare)
            })
        }
       },
    
  };
  export const getters = {
    
  }
  
  export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
  };