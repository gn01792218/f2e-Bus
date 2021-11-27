
export const state = {
    zoomIn:14, 
  };
  export const actions = {
  
  }
  export const mutations = {
    setMapZoom(state:any,zoomNum:number){
        state.zoomIn = zoomNum
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