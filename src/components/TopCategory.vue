<template>
  <nav class="selectNavbar navbar-expand-md navbar-light">
    <a href="#"></a>
    <button class="navbar-toggler ms-sm-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="category-ul navbar-nav w-100 justify-content-around">
        <li class="nav-item miniSelectBtn col-12 col-md-5 col-lg-2 m-1 ">
          <div class="nav-link d-flex align-items-center" :class="{btnActive:currentCategory=='BusRoute'}" @click="setFilterCategory(0)">
            <div class="bus1"></div>
            <p class="category-text text-danger">公車動態</p>
          </div>
        </li>
        <li class="nav-item  miniSelectBtn col-12 col-md-5 col-lg-2 m-1">
          <div class="nav-link d-flex align-items-center" :class="{btnActive:currentCategory=='StopName'}" @click="setFilterCategory(1)">
            <div class="busStop"></div>
            <p class="category-text text-primary">站點查詢</p>
          </div>
        </li>
        <li class="nav-item miniSelectBtn col-12 col-md-5 col-lg-2 m-1">
          <div class="nav-link d-flex align-items-center " :class="{btnActive:currentCategory=='Ticket'}" @click="setFilterCategory(2)">
            <div class="ticket"></div>
            <p class="category-text text-warning">票價查詢</p>
          </div>
        </li>
        <li class="nav-item miniSelectBtn col-12 col-md-5 col-lg-2 m-1">
          <div class="nav-link d-flex align-items-center " :class="{btnActive:currentCategory=='BusPlanning'}" @click="setFilterCategory(3)" >
            <div class="roadPlan"></div>
            <p class="category-text text-success">附近站牌</p>
          </div>
        </li>
      </ul>
    </div>
  </nav> 
</template>

<script lang="ts">
import {defineComponent , computed} from 'vue'
import { useStore } from "vuex";
import { Category } from "@/types/enum";
import { useRouter } from 'vue-router';
export default defineComponent({
    components:{

    },
    setup(){
        const store = useStore();
        const currentCity = computed(() => {
            return store.state.currentCity;
        });
        const currentCategory = computed(() => {
          return Category[store.state.currentCategory];
        });
        const router = useRouter()
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
                store.commit("setCurrentCategory", category);
                if(currentCity.value){
                  switch (category) {
                    case Category.BusRoute:
                        store.commit('setPlaceHolder',"請輸入公車路線號碼或起訖站名稱")
                        store.commit("busRoute/getCityBusRoute", currentCity.value);
                        break;
                    case Category.StopName:
                        store.commit('setPlaceHolder',"請輸入要查詢的公車站牌")
                        store.commit("busStop/getCityBusStop", currentCity.value);
                        store.commit("busRoute/getCityBusRoute",currentCity.value); //也需要此縣市所有路線資料
                        store.commit('busStop/getCityAllRoutesStops',currentCity.value); //也需要所有公車路線下的所有站牌資料
                        break;
                    case Category.Ticket:
                      console.log("請求縣市所有公車路線資料")
                        store.commit('setPlaceHolder',"請輸入欲查詢的公車路線號碼")
                        store.commit("busRoute/getCityBusRoute", currentCity.value);
                    break;
                    case Category.NearStop:
                      getUserGeoPosition()
                    break;
                }
                router.push('/InfoDisplay')
                }
        }
        return{
            //data
            currentCategory,
            //msthods
            setFilterCategory,
        }
    }
})
</script>