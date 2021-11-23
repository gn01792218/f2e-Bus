<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:600px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
    :projection="projection" />
    <ol-tile-layer>
        <ol-source-osm />
    </ol-tile-layer>
    <div v-if="itemDisplayData.go">
      <ol-vector-layer v-for="(i,index) in itemDisplayData.go[0].Stops" :key="index">
        <ol-source-vector>
          <ol-animation-slide :duration="2000" :repeat="1">
            <ol-feature >
                <ol-geom-point :coordinates="[i.StopPosition.PositionLon,i.StopPosition.PositionLat]"></ol-geom-point>
                <ol-style>
                    <ol-style-circle :radius='radius'>
                        <ol-style-fill :color="fillColor"></ol-style-fill>
                        <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                        <ol-style-text :text="index" ></ol-style-text>
                    </ol-style-circle>
                </ol-style>
            </ol-feature>
           </ol-animation-slide>
        </ol-source-vector>
    </ol-vector-layer>
    </div>
      
    
</ol-map>
</template>

<script lang="ts">
import { computed, defineComponent ,ref, watch} from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  setup(){
        const center = ref([120.9738819, 23.97565]) //預設:台灣地理中心
        const center2= ref([121.9738819, 23.97565]) //預設:台灣地理中心
        const projection = ref('EPSG:4326')
        const zoom = ref(16)
        const rotation = ref(0)
        const radius = ref(20)
        const strokeWidth = ref(5)
        const strokeColor = ref('red')
        const fillColor = ref('white')
    //vuex
    const store = useStore()
    const itemDisplayData = computed(() => {
      return store.state.busStop.cityBusStopByRouteName;
    });
    watch(itemDisplayData.value,()=>{
      console.log("改變")
      center.value = [itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLat,itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLon]
      console.log(itemDisplayData.value)
    })
    return{
      //data
      itemDisplayData,
      center,
            projection,
            zoom,
            rotation,
            radius,
            strokeWidth,
            strokeColor,
            fillColor,
            center2,
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
