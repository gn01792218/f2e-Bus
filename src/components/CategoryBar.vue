<template>
  <div class="select col-12 col-md-8" v-if="currentCity">
    <div class="category-container row">
      <button class="col-5 SquareBtn m-2" @click="setFilterCategory(0)">
        <div class="bus1 m-3"></div>
        <p class="text-danger">公車動態</p>
      </button>
      <button class="col-5 SquareBtn m-2" @click="setFilterCategory(1)">
        <div class="busStop m-3"></div>
        <p class="text-primary">站點查詢</p>
      </button>
      <button class="col-5 SquareBtn m-2" @click="setFilterCategory(2)">
        <div class="ticket m-3"></div>
        <p class="text-warning">票價查詢</p>
      </button>
      <button class="col-5 SquareBtn m-2" @click="setFilterCategory(3)">
        <div class="roadPlan m-3"></div>
        <p class="text-success">附近站牌</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { Category } from "@/types/enum";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const currentCity = computed(() => {
      return store.state.currentCity;
    });
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
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
    function setFilterCategory(category: Category) {
      if (currentCity.value !== "") {
        store.commit("setCurrentCategory", category);
        switch (category) {
          case Category.BusRoute:
            store.commit("setPlaceHolder", "請輸入公車路線號碼或起訖站名稱");
            store.commit("busRoute/getCityBusRoute", currentCity.value);
            break;
          case Category.StopName:
            store.commit("setPlaceHolder", "請輸入要查詢的公車站牌");
            store.commit("busStop/getCityBusStop", currentCity.value);
            store.commit("busStop/getCityAllRoutesStops", currentCity.value); //也需要所有公車路線下的所有站牌資料
            store.commit("busRoute/getCityBusRoute", currentCity.value); //也需要此縣市所有路線資料
            break;
          case Category.Ticket:
            store.commit("setPlaceHolder", "請輸入欲查詢的公車路線號碼");
            store.commit("busRoute/getCityBusRoute", currentCity.value);
            break;
          case Category.NearStop:
            getUserGeoPosition()
            break;
        }
        router.push("/InfoDisplay");
      }
    }
    return {
      //data
      currentCity,
      currentCategory,
      //methods
      setFilterCategory,
    };
  },
});
</script>