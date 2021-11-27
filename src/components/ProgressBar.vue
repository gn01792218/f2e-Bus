<template>
    <div class="progress">
      <div class="progress-bar" role="progressbar" :aria-valuenow="updateCountDown" aria-valuemin="0" aria-valuemax="30">{{updateCountDown}}</div>
      <button class="reload" @click="updateData">重新整理</button>
    </div>
</template>

<script lang="ts">
import {defineComponent , computed , ref , watch} from 'vue'
import { useStore } from "vuex";
export default defineComponent({
    components:{

    },
    setup(){
        const store = useStore();
        const selectRouteItemData = computed(() => {  //1.選擇的公車路線
            return store.state.selectRouteItem;
        });
        const busEstimatedTime = computed(()=>{ //取得該路線的公車預估到站資料
            return store.state.busEstimatedTime.busEstimatedTime
        })
        const updateCountDown = ref(30)
        const timer = ref<any>({})
        watch(selectRouteItemData, () => {
            store.commit("busStop/getCityBusStopByRoute", selectRouteItemData.value);
            store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
        });
        watch(busEstimatedTime.value,()=>{
            updatecountDownFun()
            console.log("預估時間資料",busEstimatedTime.value)
        })
        function updatecountDownFun(){
            resetTimer()
            timer.value = setInterval(()=>{
                if(updateCountDown.value<=0){
                if(selectRouteItemData.value){
                    store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
                }
                updateCountDown.value = 30
                }
                updateCountDown.value--
            },1000)
        }
        function updateData(){
            resetTimer()
            store.commit('busEstimatedTime/getBusEstimatedTime',selectRouteItemData.value);
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