<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:550px">
    <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" 
    :projection="projection" />
     <ol-fullscreen-control v-if="fullscreencontrol" />
    <ol-tile-layer>
        <ol-source-osm />
    </ol-tile-layer>
    <div v-if="currentCategory=='NearStop'">
      <ol-vector-layer>
        <ol-source-vector>
            <ol-feature>
                <ol-geom-point :coordinates="userPosition"></ol-geom-point>
                <ol-style>
                    <ol-style-circle radius='20'>
                        <ol-style-fill color="yellow"></ol-style-fill>
                        <ol-style-stroke color="blue" :width='strokeWidth'></ol-style-stroke>
                        <ol-style-text text="me" scale="2" ></ol-style-text>
                    </ol-style-circle>
                </ol-style>
            </ol-feature>
        </ol-source-vector>
    </ol-vector-layer>
    <div v-if="nearStop">
      <ol-vector-layer v-for="(i,index) in nearStop" :key="index">
        <ol-source-vector>
          <ol-feature v-if="i.StopPosition">
            <ol-geom-point :coordinates="[i.StopPosition.PositionLon,i.StopPosition.PositionLat]"></ol-geom-point>
            <ol-style>
              <ol-style-circle radius='40'>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='i.StopName.Zh_tw' ></ol-style-text>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    
    </div>
    <div v-if="itemDisplayData.go && direction==0 && currentCategory!=='NearStop'">
      <ol-vector-layer v-for="(i,index) in itemDisplayData.go[0].Stops" :key="index">
        <ol-source-vector>
          <ol-animation-slide :duration="1000" :repeat="1">
          <ol-feature v-if="index<itemDisplayData.go[0].Stops.length-1">
                <ol-geom-line-string :coordinates="[[itemDisplayData.go[0].Stops[index].StopPosition.PositionLon,itemDisplayData.go[0].Stops[index].StopPosition.PositionLat],[itemDisplayData.go[0].Stops[index+1].StopPosition.PositionLon,itemDisplayData.go[0].Stops[index+1].StopPosition.PositionLat]]"></ol-geom-line-string>
                <ol-style>
                        <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>          
                </ol-style>
          </ol-feature>
            <ol-feature>
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
    <div v-if="currentCategory=='BusRoute' || currentCategory=='StopName'">
      <ol-vector-layer v-for="(i,index) in busReallTime.go" :key="index">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[i.BusPosition.PositionLon,i.BusPosition.PositionLat]"></ol-geom-point>
            <ol-style>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='i.PlateNumb' ></ol-style-text>
                <ol-style-icon :src="busGoIcon" :scale="1"></ol-style-icon>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </div>
    
    </div>
    <div v-if="itemDisplayData.back && direction==1 && currentCategory!=='NearStop'">
      <ol-vector-layer v-for="(i,index) in itemDisplayData.back[0].Stops" :key="index">
        <ol-source-vector>
          <ol-animation-slide :duration="1000" :repeat="1">
          <ol-feature v-if="index<itemDisplayData.back[0].Stops.length-1">
            <ol-geom-line-string :coordinates="[[itemDisplayData.back[0].Stops[index].StopPosition.PositionLon,itemDisplayData.back[0].Stops[index].StopPosition.PositionLat],[itemDisplayData.back[0].Stops[index+1].StopPosition.PositionLon,itemDisplayData.back[0].Stops[index+1].StopPosition.PositionLat]]"></ol-geom-line-string>
            <ol-style>
              <ol-style-stroke :color="strokeColor" :width="strokeWidth"></ol-style-stroke>          
            </ol-style>
          </ol-feature>
          <ol-feature>
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
      <ol-vector-layer v-for="(i,index) in busReallTime.back" :key="index">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[i.BusPosition.PositionLon,i.BusPosition.PositionLat]"></ol-geom-point>
            <ol-style>
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width='strokeWidth'></ol-style-stroke>
                <ol-style-text :text='i.PlateNumb' ></ol-style-text>
                <ol-style-icon  :src="busIcon" :scale="1"></ol-style-icon>
                <!-- <ol-style-icon v-if="direction==0" :src="busGoIcon" :scale="1"></ol-style-icon>
                <ol-style-icon v-if="direction==1" :src="busIcon" :scale="1"></ol-style-icon> -->
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
          return store.state.busStop.currentCenterStopPosition
        })
        const projection = ref('EPSG:4326')
        const zoom = computed(()=>{
          return store.state.openStreeMap.zoomIn
        })
        const rotation = ref(0)
        const radius = ref(10)
        const strokeWidth = ref(5)
        const strokeColor = ref('red')
        const fillColor = ref('white')
        const fullscreencontrol= ref(true)
        const busGoIcon = require('../assets/images/bus0.png')
        const busIcon = require('../assets/images/bus.png')
        //vuex
        const store = useStore()
        const itemDisplayData = computed(() => {
          return store.state.busStop.cityBusStopByRouteName;
        });
        const currentCity = computed(() => {
          return store.state.currentCity;
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
        const userPosition = computed(()=>{
          return store.state.nearUserStops.userPosition
        })
        const nearStop = computed(()=>{
          return store.state.nearUserStops.nearStopData
        })
        watch(currentCity,()=>{
          if(currentCategory.value=='NearStop'){
            getUserGeoPosition()
          }
        })
        watch(busReallTime.value,()=>{
          console.log("公車動態資料",busReallTime.value)
        })
        watch(itemDisplayData.value,()=>{  //設置地圖預設中心為路線的第一個站牌
          if(itemDisplayData.value.go && direction.value == Direction.go){
                store.commit('busStop/setcurrentCenterStopPosition',[itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLon,itemDisplayData.value.go[0].Stops[0].StopPosition.PositionLat]) 
              }else if(itemDisplayData.value.back && direction.value == Direction.back){
                store.commit('busStop/setcurrentCenterStopPosition', [itemDisplayData.value.back[0].Stops[0].StopPosition.PositionLon,itemDisplayData.value.back[0].Stops[0].StopPosition.PositionLat])
              }
        })
        function getUserGeoPosition(){
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position)=> {
              store.commit('nearUserStops/setUserPosition',[position.coords.longitude, position.coords.latitude])
              store.commit('busStop/setcurrentCenterStopPosition',[position.coords.longitude,position.coords.latitude]) //以使用者為中心定位地圖
              store.commit('nearUserStops/getnearStopData',currentCity.value)
              store.commit('openStreeMap/setMapZoom',14)
            });
          } else {
          }
        }
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
          busGoIcon,
          userPosition,
          nearStop,
        }
  }
});
</script>
