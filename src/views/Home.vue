<template>
  <div class="home">
    <section class="categoryBar d-flex row" >
      <TaiwanMap class="d-none d-md-block" />
      <CategoryBar/>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import CategoryBar from '@/components/CategoryBar.vue'
import TaiwanMap from "@/components/TaiwanMap.vue";
export default defineComponent({
  name: 'HomeView',
  components: {
    TaiwanMap,CategoryBar,
  },
  setup(){
    return{
  
    }
  }
});
</script>
