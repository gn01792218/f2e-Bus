<template>
  <div class="filter">
    <section class="filter-title w-100">
      <div class="dropdown d-flex">
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
        <p v-if="currentCategory == 'NearStop'">請記得選擇您所在的城市唷!</p>
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
        <input v-if="currentCategory !== 'NearStop'"
          type="text"
          class="filterInput form-control w-100"
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
              class="dropdown-item d-flex"
              v-if="currentCategory == 'BusRoute'"
              @click="sendCityRouteData(data)"
              >
              <p class="routeNumber me-3">{{ data.RouteName.Zh_tw }}</p>
              <p class="routeName">{{ data.DepartureStopNameZh }} - {{
                data.DestinationStopNameZh}}</p>
            </a>
            <!-- 站點查詢時，列出縣市所有公車站牌 -->
            <a
              class="dropdown-item"
              v-if="currentCategory == 'StopName'"
              @click="sendCityStopData(data)"
              >{{ data.StopName.Zh_tw }}
            </a>
             <!-- 查詢車票時，先列出該縣市所有路線供搜尋 -->
            <a
              class="dropdown-item d-flex"
              v-if="currentCategory == 'Ticket'"
              @click="sendCityRouteDataForFare(data)"
              > 
              <p class="routeNumber me-3">{{ data.RouteName.Zh_tw }}</p>
              <p class="routeName">{{ data.DepartureStopNameZh }} - {{
                data.DestinationStopNameZh}}</p>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { Category } from "@/types/enum";
export default defineComponent({
  components: {
    
  },
  setup() {
    const store = useStore();
    const cityList = store.state.cityList;
    const keyWord = ref("");
    const placeholder = computed(()=>{
      return store.state.placeHolder
    });
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
        case Category[Category.Ticket]:
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
          case Category[Category.Ticket]:
            return vuexData.value.filter((i: any) => {
              return (
                i.RouteName.Zh_tw.includes(keyWord.value) ||
                i.DepartureStopNameZh.includes(keyWord.value) ||
                i.DestinationStopNameZh.includes(keyWord.value)
              );
            });
        }
      }
    });
    watch(filterData, () => {
      console.log(filterData.value);
    });
    function selectCity(cityName: string) {
      store.commit("setCurrentCity", cityName);
      switch (currentCategory.value) {
        case Category[Category.Ticket]:
        case Category[Category.BusRoute]:
          console.log("執行公車路線搜尋");
          store.commit("busRoute/getCityBusRoute", cityName);
          break;
        case Category[Category.StopName]:
          console.log("執行公車站牌搜尋");
          store.commit("busStop/getCityBusStop", cityName);
          store.commit("busRoute/getCityBusRoute",cityName); //也需要此縣市所有路線資料
          store.commit('busStop/getCityAllRoutesStops',cityName); //也需要所有公車路線下的所有站牌資料
          break;
      }
    }
    function sendCityRouteData(routeItemData:any){
      console.log("傳送當前選擇的資料",routeItemData)
      store.commit('setSelectRouteItem',routeItemData)
    }
    function sendCityStopData(stopItemData:any){
      console.log("傳送當前選擇的站牌資料",stopItemData)
      store.commit('setSelectStopItem',stopItemData)
    }
    function sendCityRouteDataForFare(routeItemData:any){
      console.log("傳送當前選擇的路線資料",routeItemData)
      store.commit('busFare/getRouteFareBy',routeItemData)
      store.commit('setSelectRouteItem',routeItemData) //為了列出該路線的所有站牌做準備
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
      sendCityRouteData,
      sendCityStopData,
      sendCityRouteDataForFare,
    };
  },
});
</script>