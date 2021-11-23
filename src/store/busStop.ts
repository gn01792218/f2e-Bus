import { getReallTimeNearStopByCity ,getStopByCityAndRouteName , getStopByCity} from '../api'
import router from '@/router';
import {Direction} from '../types/enum'
export const state = {
  cityBusStop: {}, //縣市的所有公車的所有站牌資料
  cityBusStopByRouteName: {} , //某公車路線的所有站牌資料
  currentDirection:Direction.go, //選擇的方向
};
export const actions = {

}
export const mutations = {
  getCityBusStop(state: any, cityName: string) {
    if (!state.cityBusStop[cityName]) {  //請求過的資料不會再次請求
      console.log(`請求${cityName}所有公車站牌資料`)
      getStopByCity(cityName)?.then(res => {
        const set = new Set();
        const result = res.data.filter((item: any) =>
              !set.has(item.StopName.Zh_tw)
                ? set.add(item.StopName.Zh_tw)
                : false
            );
        state.cityBusStop[cityName] = result
        console.log(state.cityBusStop)
      }).catch((e:any)=>{
        console.log(e)
        router.go(0)
      })
    }
  },
  getCityBusStopByRoute(state:any,payLoad:any){
      getStopByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then((res:any)=>{
        state.cityBusStopByRouteName.go = res.data.filter((i:any)=>{
          return i.Direction==0
        })
        state.cityBusStopByRouteName.back = res.data.filter((i:any)=>{
          return i.Direction==1
        })
      }).catch((e:any)=>{
        console.log(e)
        router.go(0)
      })
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