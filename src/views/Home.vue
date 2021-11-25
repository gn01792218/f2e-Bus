<template>
  <div class="home">
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
    <h3 class="orderTab m-3 p-2">Step1:選擇城市</h3>
    <section class="categoryBar d-flex" >
      <TaiwanMap class="d-none d-md-block" />
      <CategoryBar/>
    </section>
    <!-- <Filter /> -->
    <!-- <InfoDisplay/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Filter from '@/components/Filter.vue'
import InfoDisplay from '@/views/InfoDisplay.vue'
import CategoryBar from '@/components/CategoryBar.vue'
import TaiwanMap from "@/components/TaiwanMap.vue";
export default defineComponent({
  name: 'HomeView',
  components: {
    Filter,InfoDisplay,TaiwanMap,CategoryBar,
  },
  setup(){
    return{
  
    }
  }
});
</script>
