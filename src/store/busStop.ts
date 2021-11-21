import {getReallTimeNearStopByCity} from '../api'
export const state = {
    cityBusStop:{}, //縣市的所有公車的所有站牌資料
    cityBusStopByRouteName:{}  //某公車路線的所有站牌資料
  };
  export const actions = {
  
  }
  export const mutations = {
    getCityBusStop(state:any,cityName:string){
        if(!state.cityBusStop[cityName]){
            console.log(`請求${cityName}所有公車站牌資料`)
            getReallTimeNearStopByCity(cityName)?.then(res=>{
                state.cityBusStop[cityName] = res.data.sort((a:any,b:any)=>{
                  return Number(a.RouteID) > Number(b.RouteID) ? 1:-1
                })
                console.log(state.cityBusStop)
            })
        }
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