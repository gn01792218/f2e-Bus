import {getEstimatedTimeOfArrivalByCityAndRouteName} from '../api'
import store from '../store';
export const state = {
    busEstimatedTime:{}
  };
  export const actions = {
  }
  export const mutations = {
    getBusEstimatedTime(state:any,payLoad:any){
            console.log(`請求${payLoad.City}${payLoad.RouteID}資料`)
            store.commit('setRequestLoading',true)
            getEstimatedTimeOfArrivalByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then(res=>{
              console.log("請求到的路線預估時間資料",res.data)
                state.busEstimatedTime.go = res.data.filter((i:any)=>{
                    return  i.Direction==0 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
                }).sort((a:any,b:any)=>{
                  return Number(a.StopSequence) > Number(b.StopSequence) ? 1:-1
                })
                state.busEstimatedTime.back = res.data.filter((i:any)=>{
                    return  i.Direction==1 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
                }).sort((a:any,b:any)=>{
                  return Number(a.StopSequence) > Number(b.StopSequence) ? 1:-1
                })
                console.log(state.busEstimatedTime)
                store.commit('setRequestLoading',false)
            })
        
       }
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