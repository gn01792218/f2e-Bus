<template>
  <div class="home">
    <Filter />
    <InfoDisplay/>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import Filter from '@/components/Filter.vue'
import InfoDisplay from '@/components/InfoDisplay.vue'
export default defineComponent({
  name: 'HomeView',
  components: {
    Filter,InfoDisplay,
  },
  setup(){
    return{
  
    }
  }
});
</script>
