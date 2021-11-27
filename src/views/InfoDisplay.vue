<template>
  <ProgressBar />
  <TopCategory />
  <div class="infoDisplay-container d-flex">
    <div class="busInfo-container col-12 col-md-6 m-2 m-md-0 p-2">
      <Filter />
      <div v-if="currentCategory == 'BusRoute'" class="searchResultBar mt-3 mb-3 d-flex" >
        <p v-if="selectRouteItemData.RouteName">{{ selectRouteItemData.RouteName.Zh_tw }}</p>
        <p >
          {{ selectRouteItemData.DepartureStopNameZh }}-{{
            selectRouteItemData.DestinationStopNameZh
          }}
        </p>
      </div>
      <div v-if="currentCategory == 'StopName'">
        <div class="searchResultBar mt-3 mb-3 d-flex">
          <p  v-if="selectStopItemData.StopName">
          經過{{ currentCityChineseName }}的 [ <span class="text-warning">{{
            selectStopItemData.StopName.Zh_tw
          }}</span> ] 站牌的公車路線
          </p>
        </div>
        <div class="throughStopRoutes-container d-flex">
          <a
          class="throughStopRoutes searchResultBar col-2 m-2 p-1"
          v-for="(i, index) in throughStopRoutes"
          :key="index"
          @click="showThroughStopRouteData(i)"
        >
          [{{ i.RouteName.Zh_tw }}]{{ i.DepartureStopNameZh
          }}{{ i.DestinationStopNameZh }}
        </a>
        </div>
        
      </div>
      <ul class="nav nav-tabs">
        <li
          v-if="currentCategory == 'BusRoute'"
          class="nav-item col-6 text-center"
          @click="selectDirection(0)"
        >
          <p class="nav-link text-dark" :class="{ btnActive: direction == 0 }"
            >{{ selectRouteItemData.DepartureStopNameZh }}-{{
              selectRouteItemData.DestinationStopNameZh
            }}</p
          >
        </li>
        <li
          v-if="currentCategory == 'StopName'"
          class="nav-item text-center col-6"
          @click="selectDirection(0)"
        >
          <a
            class="nav-link text-dark col-6"
            :class="{ btnActive: direction == 0 }"
            v-if="
              itemDisplayData.go &&
              itemDisplayData.go[0] &&
              itemDisplayData.go[0].Stops[0] &&
              itemDisplayData.go[0].Stops[itemDisplayData.go[0].length - 1]
            "
            >{{ itemDisplayData.go[0].Stops[0].StopName.Zh_tw }}-{{
              itemDisplayData.go[0].Stops[
                itemDisplayData.go[0].Stops.length - 1
              ].StopName.Zh_tw
            }}</a
          >
        </li>
        <li
          v-if="currentCategory == 'BusRoute'"
          class="nav-item col-6 text-center"
          @click="selectDirection(1)"
        >
          <a class="nav-link text-dark" :class="{ btnActive: direction == 1 }"
            >{{ selectRouteItemData.DestinationStopNameZh }}-{{
              selectRouteItemData.DepartureStopNameZh
            }}</a
          >
        </li>
        <li
          v-if="currentCategory == 'StopName'"
          class="nav-item col-6 text-center"
          @click="selectDirection(1)"
        >
          <a
            class="nav-link"
            :class="{ btnActive: direction == 1 }"
            v-if="
              itemDisplayData.back &&
              itemDisplayData.back[0] &&
              itemDisplayData.back[0].Stops[0] &&
              itemDisplayData.back[0].Stops[itemDisplayData.back[0].length - 1]
            "
            >{{ itemDisplayData.back[0].Stops[0].StopName.Zh_tw }}-{{
              itemDisplayData.back[0].Stops[
                itemDisplayData.go[0].Stops.length - 1
              ].StopName.Zh_tw
            }}</a
          >
        </li>
      </ul>
      <div class="busInfo">
        <div class="go" v-if="direction == 0 && itemDisplayData.go">
          <div class="busInfo-container d-flex">
            <ul>
              <li
                class="busInfo-li p-1"
                v-for="(i, index) in itemDisplayData.go[0].Stops"
                :key="index"
                @click="sendStopPosition(i)"
              >
                <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
              </li>
            </ul>
            <ul v-if="direction == 0 && busEstimatedTime.go">
              <li class="busEstimatedTime-li p-1" v-for="(i, index) in busEstimatedTime.go" :key="index">
                <p class="nearTime" v-if="i.EstimateTime && i.EstimateTime > 180">
                  {{ parseInt(i.EstimateTime / 60) }}分後到站
                </p>
                <p class="alertTime" v-if="i.EstimateTime <= 180">即將進站</p>
                <p class="longTime" v-if="i.StopStatus == 1">
                  {{ i.NextBusTime.split("T")[1].split(":")[0] }}:{{
                    i.NextBusTime.split("T")[1].split(":")[1]
                  }}
                </p>
                <p v-if="i.StopStatus == 2">交管不停靠</p>
                <p v-if="i.StopStatus == 3">末班車已駛離</p>
                <p v-if="i.StopStatus == 4">本日未營運</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="back" v-if="direction == 1 && itemDisplayData.back">
          <div class="busInfo-container d-flex">
            <ul>
              <li
                class="busInfo-li p-1"
                v-for="(i, index) in itemDisplayData.back[0].Stops"
                :key="index"
                @click="sendStopPosition(i)"
              >
                <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
              </li>
            </ul>
            <ul v-if="direction == 1 && busEstimatedTime.back">
              <li class="busEstimatedTime-li p-1" v-for="(i, index) in busEstimatedTime.back" :key="index">
                <p class="nearTime" v-if="i.EstimateTime && i.EstimateTime > 180">
                  {{ parseInt(i.EstimateTime / 60) }}分後到站
                </p>
                <p class="alertTime" v-if="i.EstimateTime <= 180">即將進站</p>
                <p class="longTime" v-if="i.StopStatus == 1">
                  {{ i.NextBusTime.split("T")[1].split(":")[0] }}:{{
                    i.NextBusTime.split("T")[1].split(":")[1]
                  }}
                </p>
                <p v-if="i.StopStatus == 2">交管不停靠</p>
                <p v-if="i.StopStatus == 3">末班車已駛離</p>
                <p v-if="i.StopStatus == 4">本日未營運</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="openStreeMap col-12 col-md-6 m-2 m-md-0 p-2">
      <OpenStreeMap />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import TopCategory from "@/components/TopCategory.vue";
import OpenStreeMap from "@/components/OpenStreeMap.vue";
import Filter from "@/components/Filter.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { useStore } from "vuex";
import { Category, Direction } from "@/types/enum";
export default defineComponent({
  components: {
    TopCategory,
    OpenStreeMap,
    Filter,
    ProgressBar,
  },
  setup() {
    onMounted(() => {});
    const store = useStore();

    const selectRouteItemData = computed(() => {
      //1.選擇的公車路線
      return store.state.selectRouteItem;
    });
    const selectStopItemData = computed(() => {
      //2.選擇的縣市某站牌名稱
      return store.state.selectStopItem;
    });
    const cityBusRoutes = computed(() => {
      //縣市所有公車路線資料
      return store.state.busRoute.cityBusRoute;
    });
    const itemDisplayData = computed(() => {
      //取得該路線所有公車站牌資料
      return store.state.busStop.cityBusStopByRouteName;
    });
    const cityAllRouteStops = computed(() => {
      return store.state.busStop.cityAllRoutesStops;
    });
    const busEstimatedTime = computed(() => {
      //取得該路線的公車預估到站資料
      return store.state.busEstimatedTime.busEstimatedTime;
    });
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
      return store.state.busStop.currentDirection;
    });
    const throughStopRoutes = ref({});
    watch(selectStopItemData, () => {
      console.log("得到所選公車站牌資料", selectStopItemData.value);
      getRoutesByStop();
    });
    function showThroughStopRouteData(routeData: any) {
      store.commit("busStop/getCityBusStopByRoute", routeData);
    }
    function selectDirection(directionNum: Direction) {
      store.commit("busStop/setCurrentDirection", directionNum);
    }
    function getRoutesByStop() {
      if (selectRouteItemData.value && cityBusRoutes.value) {
        let stopUID = selectStopItemData.value.StopUID;
        console.log(currentCity.value, "資料", cityAllRouteStops.value);
        let currentCityAllRouteStops =
          cityAllRouteStops.value[currentCity.value];
        //用此名單去請求
        let filteRouteList = currentCityAllRouteStops.filter((route: any) => {
          let isRightData = false;
          let StopsList = route.Stops;
          StopsList.forEach((i: any) => {
            if (i.StopUID == stopUID) {
              isRightData = true;
            }
          });
          return isRightData;
        });
        const set = new Set();
        const result = filteRouteList.filter((item: any) =>
          !set.has(item.RouteName.Zh_tw) ? set.add(item.RouteName.Zh_tw) : false
        );
        filteRouteList = result;
        throughStopRoutes.value = filteRouteList;
        console.log(
          "站名",
          stopUID,
          "所有公車路線名稱",
          currentCityAllRouteStops,
          "最後得到的名單",
          filteRouteList
        );
      }
    }
    function sendStopPosition(stopData:any){
      console.log("設置站牌座標",stopData,[stopData.StopPosition.PositionLon,stopData.StopPosition.PositionLat])
      store.commit('busStop/setcurrentCenterStopPosition',[stopData.StopPosition.PositionLon,stopData.StopPosition.PositionLat]) 
      store.commit('openStreeMap/setMapZoom',20)
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
      showThroughStopRouteData,
      sendStopPosition,
    };
  },
});
</script>