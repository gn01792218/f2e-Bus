<template>
    <div class="progress">
      <div class="progress-bar" role="progressbar" :aria-valuenow="updateCountDown" aria-valuemin="0" aria-valuemax="30">{{updateCountDown}}</div>
      <button class="reload" @click="updateData">重新整理</button>
    </div>
</template>

<script lang="ts">
import {defineComponent , computed , ref , watch} from 'vue'
import { useStore } from "vuex";
import { Category } from "@/types/enum";
export default defineComponent({
    components:{

    },
    setup(){
        const store = useStore();
        const selectRouteItemData = computed(() => {  //1.選擇的公車路線
            return store.state.selectRouteItem;
        });
        const itemDisplayData = computed(() => {  //取得該路線所有公車站牌資料
            return store.state.busStop.cityBusStopByRouteName;
        });
        const busEstimatedTime = computed(()=>{ //取得該路線的公車預估到站資料
            return store.state.busEstimatedTime.busEstimatedTime
        })
        const currentCategory = computed(() => {
            return Category[store.state.currentCategory];
        });
        const updateCountDown = ref(30)
        const timer = ref<any>({})
        watch(selectRouteItemData, () => {
            console.log(selectRouteItemData.value)
            store.commit("busReallTime/getRouteBusReallTime",selectRouteItemData.value)
            store.commit("busStop/getCityBusStopByRoute", selectRouteItemData.value);
            store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
            store.commit('openStreeMap/setMapZoom',14)
        });
         watch(itemDisplayData.value,()=>{
            console.log("選擇的公車路線",itemDisplayData.value)
            store.commit("busReallTime/getRouteBusReallTime",itemDisplayData.value.go[0])
            store.commit('busEstimatedTime/getBusEstimatedTime',itemDisplayData.value.go[0]);
            store.commit('openStreeMap/setMapZoom',14)
        })
        watch(busEstimatedTime.value,()=>{
            updatecountDownFun()
            console.log("預估時間資料",busEstimatedTime.value)
        })
        function updatecountDownFun(){
            resetTimer()
            timer.value = setInterval(()=>{
                if(updateCountDown.value<=0){
                    if(selectRouteItemData.value && currentCategory.value=='BusRoute'){
                        store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
                    }else if(itemDisplayData.value && currentCategory.value=='StopName'){
                         store.commit('busEstimatedTime/getBusEstimatedTime',itemDisplayData.value.go[0]);
                    }
                    updateCountDown.value = 30
                }
                updateCountDown.value--
            },1000)
        }
        function updateData(){
            resetTimer()
            if(currentCategory.value=='BusRoute' && selectRouteItemData.value){
                store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
            }else if(currentCategory.value=='StopName' && itemDisplayData.value){
                store.commit('busEstimatedTime/getBusEstimatedTime',itemDisplayData.value.go[0]);
            }
            }
        function resetTimer(){
            if(timer.value){
                clearInterval(timer.value)
                updateCountDown.value = 30
            }
        }

        return{
            //data
            updateCountDown,
            //methods
            updateData,
        }
    }
})
</script>