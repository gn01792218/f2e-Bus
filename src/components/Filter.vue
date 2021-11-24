<template>
  <div class="filter">
    <div class="hintBar row">
      <div class="col-5 ">
        <div class="point">
          <div class="step1"></div>
        </div>
      </div>
      <div class="col-5">
        <div class="point mt-5">
          <div class="step2"></div>
        </div>
      </div>
    </div>
    <section class="filter-title d-flex">
      <div>
        <p>篩選方式</p>
        <p>{{ currentCategory }}</p>
      </div>
      <div>
        <h3 class="orderTab m-3 p-2">Step1:選擇城市</h3>
         <div class="dropdown d-flex m-3">
        <button
          class="btn btn-secondary dropdown-toggle me-3"
          type="button"
          id="dropdownMenu2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span v-if="currentCity">{{ currentCityChineseName }}</span>
          <span v-else>選擇縣市</span>
        </button>
        <ul
          class="dropdown-menu filter-dropdown"
          aria-labelledby="dropdownMenu2"
        >
          <li v-for="(city, index) in cityList" :key="index">
            <button
              class="dropdown-item"
              type="button"
              @click="selectCity(city.City)"
            >
              {{ city.CityName }}
            </button>
          </li>
        </ul>
        <input
          type="text"
          class="filterInput form-control"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          v-model="keyWord"
          :placeholder="placeholder"
        />
        <ul
          class="dropdown-menu filter-dropdown"
          aria-labelledby="dropdownMenuButton1"
        >
          <li v-for="(data, index) in filterData" :key="index">
            <!-- 查詢公車路線時，列出縣市所有路線 -->
            <a
              class="dropdown-item"
              href="#"
              v-if="currentCategory == 'BusRoute'"
              @click="sendCityRouteData(data)"
              >[{{ data.RouteName.Zh_tw }}]{{ data.DepartureStopNameZh }}-{{
                data.DestinationStopNameZh
              }}</a
            >
            <!-- 站點查詢時，列出縣市所有公車站牌 -->
            <a
              class="dropdown-item"
              href="#"
              v-if="currentCategory == 'StopName'"
              @click="sendCityStopData(data)"
              >{{ data.StopName.Zh_tw }}
            </a>
          </li>
        </ul>
      </div>
      </div>
    </section>
    <section class="categoryBar d-flex" >
        <TaiwanMap class="d-none d-md-block" />
        <transition-group name="fade-left">
        <div class="select" v-if="currentCity">
          <h3 class="orderTab p-2">Step2:選擇查詢服務</h3>
            <div class="row">
              <button class="col-5 SquareBtn m-2" :class="{btnActive:currentCategory=='BusRoute'}" @click="setFilterCategory(0)">
                <div class="bus1 m-3"></div>
                <p class="">公車動態</p>
              </button>
              <button class="col-5 SquareBtn m-2" :class="{btnActive:currentCategory=='StopName'}" @click="setFilterCategory(1)">
               <div class="busStop m-3"></div>
                <p class="">站點查詢</p>
              </button>
            </div>
          <div class="row">
            <button class="col-5 SquareBtn m-2" :class="{btnActive:currentCategory=='Ticket'}" @click="setFilterCategory(2)">
              <div class="ticket m-3"></div>
              <p class="">票價查詢</p>             
            </button>
            <button class="col-5 SquareBtn m-2 "  :class="{btnActive:currentCategory=='BusPlanning'}" @click="setFilterCategory(3)">
              <div class="roadPlan m-3"></div>
              <p class="">乘車規劃</p>             
            </button> 
          </div>  
            </div>
          </transition-group>
               
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import TaiwanMap from "@/components/TaiwanMap.vue";
import { Category } from "@/types/enum";
export default defineComponent({
  components: {
    TaiwanMap,
  },
  setup() {
    const store = useStore();
    const cityList = store.state.cityList;
    const keyWord = ref("");
    const placeholder = ref("請輸入公車路線號碼或起訖站名稱");
    const currentCity = computed(() => {
      return store.state.currentCity;
    });
    const currentCityChineseName = computed(() => {
      return store.state.currentCityChineseName;
    });
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
    const vuexData = computed(() => {
      switch (currentCategory.value) {
        case Category[Category.BusRoute]:
          return store.state.busRoute.cityBusRoute[currentCity.value];
        case Category[Category.StopName]:
          return store.state.busStop.cityBusStop[currentCity.value];
      }
    });
    const filterData = computed(() => {
      //取得當前縣市所有公車路線
      if (vuexData.value) {
        switch (currentCategory.value) {
          case Category[Category.BusRoute]:
            return vuexData.value.filter((i: any) => {
              return (
                i.RouteName.Zh_tw.includes(keyWord.value) ||
                i.DepartureStopNameZh.includes(keyWord.value) ||
                i.DestinationStopNameZh.includes(keyWord.value)
              );
            });
          case Category[Category.StopName]:
            let filterData = vuexData.value.filter((i: any) => {
              return i.StopName.Zh_tw.includes(keyWord.value);
            });
            return filterData;
        }
      }
    });
    watch(filterData, () => {
      console.log(filterData.value);
    });
    function selectCity(cityName: string) {
      store.commit("setCurrentCity", cityName);
      switch (currentCategory.value) {
        case Category[Category.BusRoute]:
          console.log("執行公車路線搜尋");
          store.commit("busRoute/getCityBusRoute", cityName);
          break;
        case Category[Category.StopName]:
          console.log("執行公車站牌搜尋");
          store.commit("busStop/getCityBusStop", cityName);
          break;
      }
    }
    function setFilterCategory(category: Category) {
      store.commit("setCurrentCategory", category);
      switch (category) {
        case Category.BusRoute:
          placeholder.value = "請輸入公車路線號碼或起訖站名稱";
          store.commit("busRoute/getCityBusRoute", currentCity.value);
          break;
        case Category.StopName:
          placeholder.value = "請輸入要查詢的公車站牌";
          store.commit("busStop/getCityBusStop", currentCity.value);
          store.commit('busStop/getCityAllRoutesStops',currentCity.value); //也需要所有公車路線下的所有站牌資料
          // store.commit("busRoute/getCityBusRoute",currentCity.value); //也需要此縣市所有路線資料
          break;
        case Category.Ticket:
          placeholder.value = "請輸入要查詢的起訖站名";
          break;
        case Category.BusPlanning:
          placeholder.value = "請輸入欲前往的地點";
          break;
      }
    }
    function sendCityRouteData(routeItemData:any){
      store.commit('setSelectRouteItem',routeItemData)
    }
    function sendCityStopData(stopItemData:any){
      store.commit('setSelectStopItem',stopItemData)
    }
    return {
      //data
      keyWord,
      cityList,
      filterData,
      currentCity,
      currentCityChineseName,
      currentCategory,
      placeholder,
      //methods
      selectCity,
      setFilterCategory,
      sendCityRouteData,
      sendCityStopData,
    };
  },
});
</script>