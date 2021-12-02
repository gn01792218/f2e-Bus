<template>
    <div class="fareInfo-container">
        <h1 class="text-warning">票價資訊</h1>    
        <h3>全票{{fareInfo}}元</h3>
    </div>   
</template>

<script lang="ts">
import {defineComponent , computed, watch ,ref} from 'vue'
import { useStore } from "vuex";
export default defineComponent({
    components:{
    },
    setup(){
        const store = useStore();
        const selectRouteItemData = computed(() => {  //1.選擇的公車路線
            return store.state.selectRouteItem;
        });
        const direction = computed(() => {
            return store.state.busStop.currentDirection;
        });
        const routeFareData = computed(()=>{ //公車路線的票價資訊
            return store.state.busFare.routeFare
        })
        const originStop = computed(()=>{
            return store.state.busFare.selectOriginStop
        })
        const targetStop = computed(()=>{
            return store.state.busFare.selectTargetStop
        })
        const fareInfo = ref(0)
        watch([originStop,targetStop],()=>{
            if(originStop.value && targetStop.value && routeFareData.value){
                getFareInfo()
            }
        })
        watch(routeFareData,()=>{
            if(originStop.value && targetStop.value && routeFareData.value){
                getFareInfo()
            }
        })
        watch(selectRouteItemData,()=>{
             store.commit("busStop/getCityBusStopByRoute", selectRouteItemData.value);
        })
        async function getFareInfo(){
            if(direction.value==0){
                let fareData =await routeFareData.value.go.filter((i:any)=>{
                    return i.OriginStop.StopName == originStop.value && i.DestinationStop.StopName == targetStop.value
                })
                fareInfo.value = fareData[0].Fares[0].Price
                console.log(fareInfo.value)
            }else if(direction.value==1){
                let fareData =await routeFareData.value.back.filter((i:any)=>{
                    return i.OriginStop.StopName == originStop.value && i.DestinationStop.StopName == targetStop.value
                })
                fareInfo.value = fareData[0].Fares[0].Price
                console.log(fareInfo.value)
            }
            
        }
        return{
            //data
            fareInfo,
        }
    }
})
</script>