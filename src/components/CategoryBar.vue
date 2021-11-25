<template>
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
</template>

<script lang="ts">
import {defineComponent , computed} from 'vue'
import { useStore } from "vuex";
import { Category } from "@/types/enum";
export default defineComponent({
   setup(){
        const store = useStore();
        const currentCity = computed(() => {
            return store.state.currentCity;
        });
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
    }
        return {
            //data
            currentCity,
            //methods
            setFilterCategory,
            
        }
    }
})
</script>