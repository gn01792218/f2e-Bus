import { getStopByCityAndRouteName , getStopByCity , getCityAllRouteStop} from '../api'
import {Direction} from '../types/enum'
import store from '../store';
export const state = {
  cityBusStop: {}, //縣市的所有公車的所有站牌資料
  cityBusStopByRouteName: {} , //某公車路線的所有站牌資料
  currentDirection:Direction.go, //選擇的方向
  cityAllRoutesStops:{},//所有公車路線，的站牌資料
  
};
export const actions = {


}
export const mutations = {
  getCityBusStop(state: any, cityName: string) {   //資料減肥:只需要站牌名稱就好!!
    if (!state.cityBusStop[cityName]) {  //請求過的資料不會再次請求
      console.log(`請求${cityName}所有公車站牌資料`)
      store.commit('setRequestLoading',true)
      getStopByCity(cityName)?.then(res => {
        const set = new Set();
        const result = res.data.filter((item: any) =>
              !set.has(item.StopName.Zh_tw)
                ? set.add(item.StopName.Zh_tw)
                : false
            );
        state.cityBusStop[cityName] = result
        console.log(state.cityBusStop)
        store.commit('setRequestLoading',false)
      })
    }
  },
  getCityBusStopByRoute(state:any,payLoad:any){
      getStopByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then((res:any)=>{
        store.commit('setRequestLoading',true)
        state.cityBusStopByRouteName.go = res.data.filter((i:any)=>{
          return i.Direction==0 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
        })
        state.cityBusStopByRouteName.back = res.data.filter((i:any)=>{
          return i.Direction==1 && i.RouteName.Zh_tw==payLoad.RouteName.Zh_tw
        })
        store.commit('setRequestLoading',false)
      })
  },
  getCityAllRoutesStops(state:any,cityName:string){
    console.log('請求縣市所有路線所有站牌')
    if(!state.cityAllRoutesStops[cityName]){
      console.log(cityName,'還沒裝資料')
      store.commit('setRequestLoading',true)
      getCityAllRouteStop(cityName)?.then(res=>{
        state.cityAllRoutesStops[cityName] = res.data
        console.log(state.cityAllRoutesStops)
        store.commit('setRequestLoading',false)
      })
    }
    
  },
  setCurrentDirection(state:any,dirNum:Direction){
    state.currentDirection = dirNum
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