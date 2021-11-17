<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:400px">

    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
    :projection="projection" />

    <ol-tile-layer>
        <ol-source-osm />
    </ol-tile-layer>
     <button class="btn btn-primary" 
            data-bs-target="#collapseTarget" 
            data-bs-toggle="collapse">
            Bootstrap collapse
        </button>
        <div class="collapse py-2" id="collapseTarget">
            This is the toggle-able content!
        </div>
</ol-map>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import {getReallTimeBusByCity,getReallTimeNearStopByCity,getReallTimeBusByCityAndRoute,getEstimatedTimeOfArrivalByCity,getReallTimeNearStopByCityAndRoute,getEstimatedTimeOfArrivalByCityAndRouteName} from '../api'
import {City} from '../types/enum'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(){
    const store = useStore()
    getReallTimeBusByCity(City[City.Taichung])?.then(res=>{
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
