<template>
  <h2>查詢:{{ currentCategory }}</h2>
  <h2>{{ countDisplay }}秒後刷新</h2>
  <button @click="updateData">資料刷新</button>
  <h2>
    {{ selectItemData.DepartureStopNameZh }}-{{selectItemData.DestinationStopNameZh}}
  </h2>
  <ul class="nav nav-tabs">
    <li class="nav-item" @click="selectDirection(0)">
      <a class="nav-link" :class="{ active: direction == 0 }"
        >{{ selectItemData.DepartureStopNameZh }}-{{
          selectItemData.DestinationStopNameZh
        }}</a
      >
    </li>
    <li class="nav-item" @click="selectDirection(1)">
      <a class="nav-link" :class="{ active: direction == 1 }"
        >{{ selectItemData.DestinationStopNameZh }}-{{
          selectItemData.DepartureStopNameZh
        }}</a
      >
    </li>
  </ul>
  <div class="d-flex">
    <div class="busInfo">
      <ul v-if="direction == 0 && itemDisplayData.go">
        <li>去</li>
        <li class="busInfo-li d-flex"
          v-for="(i, index) in itemDisplayData.go[0].Stops"
          :key="index"
        >
            <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
            <p v-if="i.PlateNumb">行駛車輛{{ i.PlateNumb }}</p>
            <p v-else>目前無發車</p>
            <p v-if="i.EstimateTime">
              預估{{ Number(i.Estimates[0].EstimateTime) / 60 }}分後到站
            </p>
        </li>
      </ul>
      <ul v-if="direction == 1 && itemDisplayData.back">
        <li>返</li>
        <li class="busInfo-li d-flex"
          v-for="(i, index) in itemDisplayData.back[0].Stops"
          :key="index"
        >
            <p>[{{ i.StopSequence }}]{{ i.StopName.Zh_tw }}</p>
            <p v-if="i.PlateNumb">行駛車輛{{ i.PlateNumb }}</p>
            <p v-else>目前無發車</p>
            <p v-if="i.EstimateTime">
              預估{{ Number(i.Estimates[0].EstimateTime) / 60 }}分後到站
            </p>
        </li>
      </ul>
    </div>
    <div class="openStreeMap">
      <OpenStreeMap />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import OpenStreeMap from "@/components/OpenStreeMap.vue";
import { useStore } from "vuex";
import { Category , Direction} from "@/types/enum";
export default defineComponent({
  components: {
    OpenStreeMap,
  },
  setup() {
    onMounted(() => {
    });
    const store = useStore();
    const selectItemData = computed(() => {
      return store.state.selectItem;
    });
    const itemDisplayData = computed(() => {
      console.log(store.state.busStop.cityBusStopByRouteName)
      return store.state.busStop.cityBusStopByRouteName;
    });
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
    const direction = computed(()=>{
      return store.state.busStop.currentDirection
    });
    const updateCount = ref(30);
    const countDisplay = computed(() => {
      return updateCount.value;
    });
    const updateTimer = ref({});
    watch(selectItemData, () => {
      store.commit("busStop/getCityBusStopByRoute", selectItemData.value);
    });
    watch(itemDisplayData.value, () => {
      console.log(itemDisplayData.value);
    });
    function updateData() {
      store.commit("busStop/getCityBusStopByRoute", selectItemData.value);
    }
    function selectDirection(directionNum:Direction) {
      store.commit('busStop/setCurrentDirection',directionNum)
    }
    return {
      //dtat
      itemDisplayData,
      selectItemData,
      direction,
      currentCategory,
      countDisplay,
      //methods
      selectDirection,
      updateData,
    };
  },
});
</script>