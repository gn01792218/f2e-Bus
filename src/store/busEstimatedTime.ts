import {getEstimatedTimeOfArrivalByCityAndRouteName} from '../api'
export const state = {
    busEstimatedTime:{}
  };
  export const actions = {
  }
  export const mutations = {
    getBusEstimatedTime(state:any,payLoad:any){
            console.log(`請求${payLoad.City}${payLoad.RouteName.Zh_tw}資料`)
            getEstimatedTimeOfArrivalByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then(res=>{
                state.busEstimatedTime.go = res.data.filter((i:any)=>{
                    return (i.StopStatus==3 || i.StopStatus==0) && i.Direction==0
                })
                state.busEstimatedTime.back = res.data.filter((i:any)=>{
                    return (i.StopStatus==3 || i.StopStatus==0) && i.Direction==1
                })
                console.log(state.busEstimatedTime)
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