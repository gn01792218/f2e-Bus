<template>
  <div class="home">
    <section class="categoryBar d-flex row m-2 p-2" >
      <div class="selectCity d-flex col-12 col-md-6" v-if="!currentCity">
          <h3 class="neumorphism w-75 p-2">選擇城市</h3>
        <TaiwanMap class="d-none d-xl-block mt-5" />
        <div class="cityList d-block d-xl-none">
          <div class="row justify-content-center">
            <div class="cityList-btnList miniSelectBtn col-3 m-2 mb-1 " :class="{citybtnActive:currentCity==i.City}" @click="toCity(i.City)" v-for="(i,index) in cityList" :key="index">
              <p>{{i.CityName}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="categoryService d-flex col-12 col-md-6">
        <h3 class="neumorphism w-75 p-2">選擇查詢服務</h3>
        <CategoryBar class="mt-2"/>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent} from 'vue';
import CategoryBar from '@/components/CategoryBar.vue'
import TaiwanMap from "@/components/TaiwanMap.vue";
import { useStore } from 'vuex';
export default defineComponent({
  name: 'HomeView',
  components: {
    TaiwanMap,CategoryBar,
  },
  setup(){
    const store = useStore()
    const cityList = computed(()=>{
      return store.state.cityList
    })
    const currentCity = computed(() => {
      return store.state.currentCity;
    }); 
    function toCity(city: string) {

      store.commit("setCurrentCity", city);
      store.commit("busRoute/getCityBusRoute", city);
    }
    return{
      //data
      cityList,currentCity,
      //methods
      toCity,
    }
  }
});
</script>
