import {getRouteFareByCityAndRouteName} from '../api'
import store from '../store';
export const state = {
    routeFare:{}, //縣市的票價資訊
    selectOriginStop:'',//起站名稱
    selectTargetStop:'',//迄站名稱
  };
  export const actions = {
  
  }
  export const mutations = {
    getRouteFareBy(state:any,payLoad:any){  //取得縣市所有公車路線，(資料減肥:一開始只需要公車路線RouteName.ZH_tw就好了?!)
            console.log(`請求${payLoad.City}${payLoad.RouteName.Zh_tw}路線票價資料`)
            store.commit('setRequestLoading',true)
            getRouteFareByCityAndRouteName(payLoad.City,payLoad.RouteName.Zh_tw)?.then(async res=>{
              let routeData =await res.data.filter((i:any)=>{
                return i.RouteName == payLoad.RouteName.Zh_tw
              })
                state.routeFare.go = routeData[0].ODFares.filter((i:any)=>{
                  return i.Direction == 0
                })
                state.routeFare.back = routeData[0].ODFares.filter((i:any)=>{
                  return i.Direction == 1
                })
                console.log(state.routeFare)
                store.commit('setRequestLoading',false)
            }).catch((e)=>{
              alert("該縣市目前無提供票價查詢服務")
            })
       },
    setOriginStop(state:any,originStopName:string){
      state.selectOriginStop = originStopName
    },
    setTargetStop(state:any,targetStopName:string){
      state.selectTargetStop = targetStopName
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