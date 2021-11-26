<template>
    <div v-if="!requestLoaded" class="requestLoading w-100 h-100 position-absolute"></div>
 
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
   setup(){
       const store = useStore()
       const requestLoaded = computed(()=>{
           return store.state.isrequestLoaded
       })
        return {
            //data
            requestLoaded,
        }
    }
})
</script>