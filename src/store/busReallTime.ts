import {getReallTimeBusByCityAndRoute} from '../api'
import store from '../store';
export const state = {
    routeBusReallTime:{}, //公車動態

  };
  export const actions = {
  
  }
  export const mutations = {
    getRouteBusReallTime(state:any,payLoad:any){  //取得某路線的公車動態資料
            console.log(`請求${payLoad.City}${payLoad.RouteName.Zh_tw}公車動態資料`)
            store.commit('setRequestLoading',true)
            getReallTimeBusByCityAndRoute(payLoad.City,payLoad.RouteName.Zh_tw)?.then(res=>{
                console.log(res.data)
                state.routeBusReallTime.go = res.data.filter((i:any)=>{
                    return i.Direction==0 && i.DutyStatus!==2 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
                })
                state.routeBusReallTime.back = res.data.filter((i:any)=>{
                    return i.Direction==1 && i.DutyStatus!==2 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
                })
                console.log(state.routeBusReallTime)
                store.commit('setRequestLoading',false)
            })
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