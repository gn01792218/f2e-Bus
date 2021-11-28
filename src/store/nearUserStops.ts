import {getNearStopByCity} from '../api'
import store from '../store';
export const state = {
    userPosition:[], 
    nearStopData:{}
  };
  export const actions = {
  
  }
  export const mutations = {
    getnearStopData(state:any,city:string){  //取得縣市所有公車路線，(資料減肥:一開始只需要公車路線RouteName.ZH_tw就好了?!)
            console.log(`請求${city}我附近的公車站牌資料`)
            store.commit('setRequestLoading',true)
            getNearStopByCity(city,state.userPosition[1],state.userPosition[0])?.then(res=>{
                state.nearStopData = res.data
                console.log(state.nearStopData)
                store.commit('setRequestLoading',false)
            })
       },
    setUserPosition(state:any,payLoad:any){
      state.userPosition = payLoad
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