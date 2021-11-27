<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:600px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
    :projection="projection" />
     <ol-fullscreen-control v-if="fullscreencontrol" />
    <ol-tile-layer>
        <ol-source-osm />
    </ol-tile-layer>
    <div v-if="itemDisplayData.go && direction==0">
      <ol-vector-layer v-for="(i,index) in itemDisplayData.go[0].Stops" :key="index">
        <ol-source-vector>
          <ol-animation-slide :duration="1000" :repeat="1">
          <ol-feature class="routesLine" v-if="index<itemDisplayData.go[0].Stops.length-1">
                <ol-geom-line-string :coordinates="[[itemDisplayData.go[0].Stops[index].StopPosition.PositionLon,itemDisplayData.go[0].Stops[index].StopPosition.PositionLat],[itemDisplayData.go[0].Stops[index+1].StopPosition.PositionLon,itemDisplayData.go[0].Stops[index+1].StopPosition.PositionLat]]"></ol-geom-line-string>
                <ol-style>
                        <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>          
                </ol-style>
          </ol-feature>
            <ol-feature class="stops">
                <ol-geom-point :coordinates="[i.StopPosition.PositionLon,i.StopPosition.PositionLat]"></ol-geom-point>
                <ol-style>
                    <ol-style-circle :radius='radius'>
                        <ol-style-fill :color="fillColor"></ol-style-fill>
                        <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                        <ol-style-text :text='String(index+1)' ></ol-style-text>
                    </ol-style-circle>
                </ol-style>
            </ol-feature>
           </ol-animation-slide>
        </ol-source-vector>
    </ol-vector-layer>
    <ol-vector-layer class="buses" v-for="(i,index) in busReallTime.go" :key="index">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[i.BusPosition.PositionLon,i.BusPosition.PositionLat]"></ol-geom-point>
            <ol-style>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='i.PlateNumb' ></ol-style-text>
                <ol-style-icon :src="busIcon" :scale="1"></ol-style-icon>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
      <div v-if="itemDisplayData.back && direction==1">
      <ol-vector-layer class="routesLine" v-for="(i,index) in itemDisplayData.back[0].Stops" :key="index">
        <ol-source-vector>
          <ol-animation-slide :duration="1000" :repeat="1">
          <ol-feature v-if="index<itemDisplayData.back[0].Stops.length-1">
            <ol-geom-line-string :coordinates="[[itemDisplayData.back[0].Stops[index].StopPosition.PositionLon,itemDisplayData.back[0].Stops[index].StopPosition.PositionLat],[itemDisplayData.back[0].Stops[index+1].StopPosition.PositionLon,itemDisplayData.back[0].Stops[index+1].StopPosition.PositionLat]]"></ol-geom-line-string>
            <ol-style>
              <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>          
            </ol-style>
          </ol-feature>
          <ol-feature class="stops">
            <ol-geom-point :coordinates="[i.StopPosition.PositionLon,i.StopPosition.PositionLat]"></ol-geom-point>
            <ol-style>
              <ol-style-circle :radius='radius'>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='String(index+1)' ></ol-style-text>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
          </ol-animation-slide>
        </ol-source-vector>
      </ol-vector-layer>
      <ol-vector-layer class="buses" v-for="(i,index) in busReallTime.back" :key="index">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[i.BusPosition.PositionLon,i.BusPosition.PositionLat]"></ol-geom-point>
            <ol-style>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='i.PlateNumb' ></ol-style-text>
                <ol-style-icon :src="busIcon" :scale="1"></ol-style-icon>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    
</ol-map>
</template>

<script lang="ts">
import { computed, defineComponent ,ref, watch} from 'vue';
import { useStore } from 'vuex';
import { Category, Direction } from "@/types/enum";
export default defineComponent({
  setup(){
        const center = computed(()=>{
          if(itemDisplayData.value.go && direction.value == Direction.go){
            return [itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLon,itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLat]
          }else if(itemDisplayData.value.back && direction.value == Direction.back){
            return [itemDisplayData.value.back[0].Stops[0].StopPosition.PositionLon,itemDisplayData.value.back[0].Stops[0].StopPosition.PositionLat]
          }
          
        })
        const projection = ref('EPSG:4326')
        const zoom = ref(14)
        const rotation = ref(0)
        const radius = ref(10)
        const strokeWidth = ref(5)
        const strokeColor = ref('red')
        const fillColor = ref('white')
        const fullscreencontrol= ref(true)
        const busIcon = require('../assets/images/bus.png')
    //vuex
    const store = useStore()
    const itemDisplayData = computed(() => {
      return store.state.busStop.cityBusStopByRouteName;
    });
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
    const direction = computed(()=>{
      return store.state.busStop.currentDirection
    });
    const busReallTime = computed(()=>{
      return store.state.busReallTime.routeBusReallTime
    })
    watch(busReallTime.value,()=>{
      console.log("公車動態資料",busReallTime.value)
    })
    return{
      //data
      itemDisplayData,
      currentCategory,
      center,
      projection,
      zoom,
      rotation,
      radius,
      strokeWidth,
      strokeColor,
      fillColor,
      direction,
      fullscreencontrol,
      busReallTime,
      busIcon,
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
