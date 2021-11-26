<template>
  <TopCategory/>
  <Filter/>
  <h2>查詢:{{ currentCategory }}</h2>
  <p class="searchResultBar" v-if="selectRouteItemData.RouteName">[{{selectRouteItemData.RouteName.Zh_tw}}] {{selectRouteItemData.DepartureStopNameZh}}-{{selectRouteItemData.DestinationStopNameZh}}</p>
  <h2 v-if="currentCategory=='StopName' && selectStopItemData.StopName">查詢{{currentCityChineseName}}的[{{selectStopItemData.StopName.Zh_tw}}]站牌</h2>
  <h2>會經過此站牌的路線有:</h2>
    <p class="throughStopRoutes searchResultBar" v-for="(i,index) in throughStopRoutes" :key="index" @click="showThroughStopRouteData(i)">{{i.RouteName.Zh_tw}}</p>
  <ul class="nav nav-tabs">
    <li class="nav-item" @click="selectDirection(0)">
      <a class="nav-link" :class="{ active: direction == 0 }"
        >{{ selectRouteItemData.DepartureStopNameZh }}-{{
          selectRouteItemData.DestinationStopNameZh
        }}</a
      >
    </li>
    <li class="nav-item" @click="selectDirection(1)">
      <a class="nav-link" :class="{ active: direction == 1 }"
        >{{ selectRouteItemData.DestinationStopNameZh }}-{{
          selectRouteItemData.DepartureStopNameZh
        }}</a
      >
    </li>
  </ul>
  <div class="d-flex">
    <div class="busInfo">
      <div class="go" v-if="direction == 0 && itemDisplayData.go">
        <h3>去</h3>
        <div class="busInfo-container d-flex">
           <ul >
            <li class="busInfo-li"
              v-for="(i, index) in itemDisplayData.go[0].Stops"
              :key="index"
            >
            <p>[{{i.StopSequence}}]{{i.StopName.Zh_tw}}</p>
            </li>

          </ul>
          <ul v-if="direction == 0 && busEstimatedTime.go">
            <li
              v-for="(i,index) in busEstimatedTime.go" :key="index"
            >
            <p v-if="i.EstimateTime">預估{{i.EstimateTime/60}}分後到站</p>
            <p v-if="i.StopStatus==1">尚未發車</p>
            <p v-if="i.StopStatus==2">交管不停靠</p>
            <p v-if="i.StopStatus==3">末班車已駛離</p>
            <p v-if="i.StopStatus==4">本日未營運</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="back" v-if="direction == 1 && itemDisplayData.back">
        <h3>返</h3>
        <div class="busInfo-container d-flex">
          <ul>
            <li class="busInfo-li"
              v-for="(i, index) in itemDisplayData.back[0].Stops"
              :key="index"
            >
            <p>[{{i.StopSequence}}]{{i.StopName.Zh_tw}}</p>
            </li>
          </ul>
          <ul v-if="direction == 1 && busEstimatedTime.back">
            <li
              v-for="(i,index) in busEstimatedTime.back" :key="index"
            >
            <p v-if="i.EstimateTime">預估{{i.EstimateTime/60}}分後到站</p>
            <p v-if="i.StopStatus==1">尚未發車</p>
            <p v-if="i.StopStatus==2">交管不停靠</p>
            <p v-if="i.StopStatus==3">末班車已駛離</p>
            <p v-if="i.StopStatus==4">本日未營運</p>
            </li>
          </ul>
        </div>
      </div>
     
      
    </div>
    <div class="openStreeMap">
      <OpenStreeMap />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import TopCategory from '@/components/TopCategory.vue'
import OpenStreeMap from "@/components/OpenStreeMap.vue";
import Filter from '@/components/Filter.vue'
import { useStore } from "vuex";
import { Category , Direction} from "@/types/enum";
export default defineComponent({
  components: {
    TopCategory,
    OpenStreeMap,
    Filter,
  },
  setup() {
    onMounted(() => {
    });
    const store = useStore();
    
    const selectRouteItemData = computed(() => {  //1.選擇的公車路線
      return store.state.selectRouteItem;
    });
    const selectStopItemData = computed(()=>{ //2.選擇的縣市某站牌名稱
      return store.state.selectStopItem;
    })
    const cityBusRoutes = computed(() => {  //縣市所有公車路線資料
      return store.state.busRoute.cityBusRoute
    })
    const itemDisplayData = computed(() => {  //取得該路線所有公車站牌資料
      return store.state.busStop.cityBusStopByRouteName;
    });
    const cityAllRouteStops = computed(()=>{
      return store.state.busStop.cityAllRoutesStops
    })
    const busEstimatedTime = computed(()=>{ //取得該路線的公車預估到站資料
      return store.state.busEstimatedTime.busEstimatedTime
    })
    const currentCity = computed(() => {
      return store.state.currentCity;
    });
    
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
    const currentCityChineseName = computed(() => {
      return store.state.currentCityChineseName;
    });
    const direction = computed(() => {
      return store.state.busStop.currentDirection
    });
    const throughStopRoutes = ref({})
    watch(selectRouteItemData, () => {
      store.commit("busStop/getCityBusStopByRoute", selectRouteItemData.value);
      store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
    });
    watch(selectStopItemData,() => {
      console.log(selectStopItemData.value)
      //偵測到站牌名稱資料後，取此站牌名稱的StopUID
      //先取得縣市的所有公車路線名稱後，使用stop
      console.log("站牌資料改變")
      getRoutesByStop()
    })
    watch(itemDisplayData.value, () => {
      console.log("此路線的所有站牌資料",itemDisplayData.value)
    });
    watch(busEstimatedTime.value,()=>{
      console.log("預估時間資料",busEstimatedTime.value)
    })
    function showThroughStopRouteData(routeData:any){
      store.commit("busStop/getCityBusStopByRoute", routeData);
    }
    function selectDirection(directionNum:Direction) {
      store.commit('busStop/setCurrentDirection',directionNum)
    }
    function getRoutesByStop(){
      if(selectRouteItemData.value && cityBusRoutes.value){
        let stopUID = selectStopItemData.value.StopUID
        console.log(currentCity.value,"資料",cityAllRouteStops.value)
        let currentCityAllRouteStops = cityAllRouteStops.value[currentCity.value]
        //用此名單去請求
        let filteRouteList = currentCityAllRouteStops.filter((route:any)=>{
          let isRightData = false
          let StopsList = route.Stops
            StopsList.forEach((i:any)=>{
              if(i.StopUID==stopUID){
                isRightData = true
              }
            })
          return isRightData
        })
        const set = new Set();
        const result = filteRouteList.filter((item: any) =>
              !set.has(item.RouteName.Zh_tw)
                ? set.add(item.RouteName.Zh_tw)
                : false
            );
        filteRouteList = result
        throughStopRoutes.value =filteRouteList
        console.log("站名",stopUID,"所有公車路線名稱",currentCityAllRouteStops,"最後得到的名單",filteRouteList)
      }
    }
    return {
      //dtat
      itemDisplayData,
      selectRouteItemData,
      direction,
      currentCategory,
      busEstimatedTime,
      selectStopItemData,
      currentCityChineseName,
      throughStopRoutes,
      //methods
      selectDirection,
      // setFilterCategory,
      showThroughStopRouteData,
    };
  },
});
</script>