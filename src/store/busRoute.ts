import {getRouteByCity} from '../api'
export const state = {
    cityBusRoute:{}
  };
  export const actions = {
  
  }
  export const mutations = {
    getCityBusRoute(state:any,cityName:string){
        if(!state.cityBusRoute[cityName]){
            console.log(`請求${cityName}資料`)
            getRouteByCity(cityName)?.then(res=>{
                state.cityBusRoute[cityName] = res.data.sort((a:any,b:any)=>{
                  return Number(a.RouteID) > Number(b.RouteID) ? 1:-1
                })
                console.log(state.cityBusRoute)
            }).catch((e:any)=>{
              console.log(e)
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