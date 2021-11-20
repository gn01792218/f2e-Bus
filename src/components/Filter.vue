<template>
    <div class="dropdown d-flex m-3">
        <button class="btn btn-secondary dropdown-toggle me-3" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
          <span v-if="currentCity">{{currentCityChineseName}}</span>
          <span v-else>選擇縣市</span>
        </button>
        <ul class="dropdown-menu filter-dropdown" aria-labelledby="dropdownMenu2">
          <li v-for="(city,index) in cityList" :key="index">
            <button class="dropdown-item" type="button" @click="selectCity(city.City)">{{city.CityName}}</button>
          </li>
        </ul>
        <input type="text" class="filterInput form-control" id="dropdownMenuButton1" data-bs-toggle="dropdown" v-model="keyWord" placeholder="請輸入搜尋內容">
        <ul class="dropdown-menu filter-dropdown" aria-labelledby="dropdownMenuButton1">
          <li v-for="(data,index) in filterData" :key="index"><a class="dropdown-item" href="#">{{data.RouteID}}</a></li>
          <!-- <li><a class="dropdown-item" href="#"></a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li> -->
        </ul>
    </div>
    <TaiwanMap class="d-none d-md-block"/>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import TaiwanMap from '@/components/TaiwanMap.vue'
export default defineComponent({
    components:{
      TaiwanMap,
    },
    setup(){
        const store = useStore()
        const cityList = store.state.cityList
        const keyWord = ref("")
        const currentCity = computed(()=>{
          return store.state.currentCity
        })
        const currentCityChineseName = computed(()=>{
          return store.state.currentCityChineseName
        })
        const vuexData = computed(()=>{
          return store.state.busRoute.cityBusRoute[currentCity.value]
        })
        const filterData = computed(()=>{  //取得當前縣市所有公車路線
          if(vuexData.value){
           return vuexData.value.filter((i:any)=>{
              return i.RouteID.includes(keyWord.value)
            })
          }else{
            return vuexData.value
          }
        })
        watch(currentCity,()=>{
          console.log(currentCity.value)
        })
        watch(filterData,()=>{
          console.log(filterData.value)
        })
        function selectCity (cityName:string) {
          store.commit('setCurrentCity',cityName)
          store.commit('busRoute/getCityBusRoute',cityName)
        }
        return{
        //data
        keyWord,cityList,filterData,currentCity,currentCityChineseName,
        //methods
        selectCity,
        }
    }
})
</script>