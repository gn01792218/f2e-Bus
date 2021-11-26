<template>
  <nav class="selectNavbar navbar-expand-md navbar-light">
    <a href="#"><img class="d-sm-block d-md-none w-75 ms-3" src="../assets/images/header.png" alt="" ></a>
    <button class="navbar-toggler ms-sm-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav row w-100 ">
        <li class="nav-item col-12 col-md-3 ">
          <a class="nav-link d-flex align-items-center miniSelectBtn" :class="{btnActive:currentCategory=='BusRoute'}" @click="setFilterCategory(0)">
            <div class="bus1"></div>
            <p>公車動態</p>
          </a>
        </li>
        <li class="nav-item col-12 col-md-3">
          <a  class="nav-link d-flex align-items-center miniSelectBtn" :class="{btnActive:currentCategory=='StopName'}" @click="setFilterCategory(1)">
            <div class="busStop"></div>
            <p>站點查詢</p>
          </a>
        </li>
        <li class="nav-item col-12 col-md-3">
          <a class="nav-link d-flex align-items-center miniSelectBtn" :class="{btnActive:currentCategory=='Ticket'}" @click="setFilterCategory(2)">
            <div class="ticket"></div>
            <p>票價查詢</p>
          </a>
        </li>
        <li class="nav-item col-12 col-md-3">
          <a class="nav-link d-flex align-items-center miniSelectBtn" :class="{btnActive:currentCategory=='BusPlanning'}" @click="setFilterCategory(3)" >
            <div class="roadPlan"></div>
            <p>路線規劃</p>
          </a>
        </li>
      </ul>
    </div>
</nav>
  <Filter/>
  <h2>查詢:{{ currentCategory }}</h2>
  <p v-if="selectRouteItemData.RouteName">[{{selectRouteItemData.RouteName.Zh_tw}}] {{selectRouteItemData.DepartureStopNameZh}}-{{selectRouteItemData.DestinationStopNameZh}}</p>
  <h2 v-if="currentCategory=='StopName' && selectStopItemData.StopName">查詢{{currentCityChineseName}}的[{{selectStopItemData.StopName.Zh_tw}}]站牌</h2>
  <h2>會經過此站牌的路線有:</h2>
    <p class="throughStopRoutes" v-for="(i,index) in throughStopRoutes" :key="index" @click="showThroughStopRouteData(i)">{{i.RouteName.Zh_tw}}</p>
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
      <ul v-if="direction == 0 && itemDisplayData.go">
        <li>去</li>
        <li class="busInfo-li d-flex"
          v-for="(i, index) in itemDisplayData.go[0].Stops"
          :key="index"
        >
            <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
            <p v-if="i.PlateNumb">行駛車輛{{ i.PlateNumb }}</p>
            <p v-else>目前無發車</p>
            <p v-if="i.EstimateTime">
              預估{{ Number(i.Estimates[0].EstimateTime) / 60 }}分後到站
            </p>
        </li>
      </ul>
      <ul v-if="direction == 1 && itemDisplayData.back">
        <li>返</li>
        <li class="busInfo-li d-flex"
          v-for="(i, index) in itemDisplayData.back[0].Stops"
          :key="index"
        >
            <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
            <p v-if="i.PlateNumb">行駛車輛{{ i.PlateNumb }}</p>
            <p v-else>目前無發車</p>
            <p v-if="i.EstimateTime">
              預估{{ Number(i.Estimates[0].EstimateTime) / 60 }}分後到站
            </p>
        </li>
      </ul>
    </div>
    <div class="openStreeMap">
      <OpenStreeMap />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import OpenStreeMap from "@/components/OpenStreeMap.vue";
import Filter from '@/components/Filter.vue'
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import { Category , Direction} from "@/types/enum";
export default defineComponent({
  components: {
    OpenStreeMap,Filter,
  },
  setup() {
    onMounted(() => {
    });
    const store = useStore();
    const router = useRouter()
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
      console.log("選擇的路線資料",selectRouteItemData.value)
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
    function setFilterCategory(category: Category) {
            store.commit("setCurrentCategory", category);
            switch (category) {
                case Category.BusRoute:
                    store.commit('setPlaceHolder',"請輸入公車路線號碼或起訖站名稱")
                    store.commit("busRoute/getCityBusRoute", currentCity.value);
                    break;
                case Category.StopName:
                    store.commit('setPlaceHolder',"請輸入要查詢的公車站牌")
                    store.commit("busStop/getCityBusStop", currentCity.value);
                    store.commit('busStop/getCityAllRoutesStops',currentCity.value); //也需要所有公車路線下的所有站牌資料
                    // store.commit("busRoute/getCityBusRoute",currentCity.value); //也需要此縣市所有路線資料
                    break;
                case Category.Ticket:
                    store.commit('setPlaceHolder',"請輸入要查詢的起訖站名")
                break;
                case Category.BusPlanning:
                    store.commit('setPlaceHolder',"請輸入欲前往的地點")
                break;
            }
            router.push('/InfoDisplay')
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
      setFilterCategory,
      showThroughStopRouteData,
    };
  },
});
</script>