<template>
  <div class="home">
    <OpenStreeMap/>
    <Filter />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import OpenStreeMap from '@/components/OpenStreeMap.vue'; // @ is an alias to /src
import Filter from '@/components/Filter.vue'
import { useStore } from 'vuex';
export default defineComponent({
  name: 'HomeView',
  components: {
    OpenStreeMap,Filter,
  },
  setup(){
    const store = useStore()
    const cityList = store.state.cityList
    const keyWord = ref("")
    const currentCity = computed(()=>{
      return store.state.currentCity
    })
    watch(currentCity,()=>{
      console.log(currentCity.value)
    })
    function selectCity (cityName:string) {
      store.commit('setCurrentCity',cityName)
    }
    return{
      //data
      keyWord,cityList,
      //methods
      selectCity,
    }
  }
});
</script>
