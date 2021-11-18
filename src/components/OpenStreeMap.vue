<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:400px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
    :projection="projection" />
    <ol-tile-layer>
        <ol-source-osm />
    </ol-tile-layer>
</ol-map>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import {getRouteByCityAndRouteName,getReallTimeBusByCity,getRouteByCity,getReallTimeNearStopByCity,getReallTimeBusByCityAndRoute,getEstimatedTimeOfArrivalByCity,getReallTimeNearStopByCityAndRoute,getEstimatedTimeOfArrivalByCityAndRouteName} from '../api'
import {City} from '../types/enum'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(){
    const store = useStore()
    const cityList = store.state.cityList
    getRouteByCityAndRouteName(City[City.Taichung],53)?.then(res=>{
      console.log(res.data)
    })
    return{

    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
