<template>
  <div id="map" class="mapContainer position-relative mb-3 col-12 col-md-6">
    <div class="island position-absolute">
      <div class="langjon text-center" @click="toCity('LienchiangCounty')">
        連江
      </div>
      <div class="kin text-center" @click="toCity('KinmenCounty')">金門</div>

      <div class="ponho text-center" @click="toCity('PenghuCounty')">澎湖</div>
    </div>
    <svg
      id="svg"
      class="sv"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    ></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import d3 from "@/types/d3.min";
import { useStore } from "vuex";
import { Category } from "@/types/enum";
export default defineComponent({
  components: {},
  setup() {
    onMounted(() => {
      mapInit();
    });
    const store = useStore();
    const currentCity = computed(() => {
      return store.state.currentCity;
    });
    const currentCategory = computed(() => {
      return Category[store.state.currentCategory];
    });
    async function mapInit() {
      const map = document.querySelector("#map") as HTMLElement;
      const width = Number(map?.offsetWidth.toFixed());
      const height = Number(map?.offsetHeight.toFixed());
      let mercatorScale,
        w = window.screen.width;
      //使用以下來縮小地圖
      if (w > 1366) {
        mercatorScale = 5000;
      } else if (w <= 1366 && w > 480) {
        mercatorScale = 9000;
      } else {
        mercatorScale = 6000;
      }
      const path = await d3.geo.path().projection(
        d3.geo
          .mercator()
          .center([121, 24])
          .scale(mercatorScale)
          .translate([width / 2, height / 2.5])
      );
      const svg = await d3
        .select("#svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
      d3.json("/taiwan.json", (error: any, geometry: any) => {
        if (error) throw error;
        svg
          .selectAll("path")
          .data(geometry.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr({
            id: (d: any) => `city${d.properties.COUNTYCODE}`, //設id用來之後動態添加class用
          })
          .on("click", (d: any) => {
            store.commit(
              "setCurrentCity",
              d.properties.COUNTYENG.split(" ")[0]
            );
            switch (currentCategory.value) {
              case Category[Category.BusRoute]:
                console.log("執行公車路線搜尋");
                store.commit("busRoute/getCityBusRoute", currentCity.value);
                break;
              case Category[Category.StopName]:
                console.log("執行公車站牌搜尋");
                store.commit("busStop/getCityBusStop", currentCity.value);
                break;
            }
            // store.commit(
            //   "busRoute/getCityBusRoute",
            //   d.properties.COUNTYENG.split(" ")[0]
            // ); //請求該縣市路線資料
            if (document.querySelector(".active")) {
              document.querySelector(".active")?.classList.remove("active");
            }
            document
              .getElementById(`city${d.properties.COUNTYCODE}`)
              ?.classList.add("active");
          })
          .on("mouseover", (d: any) => {
            document
              .getElementById(`city${d.properties.COUNTYCODE}`)
              ?.classList.add("hover");
          })
          .on("mouseout", (d: any) => {
            if (document.querySelector(".hover")) {
              document.querySelector(".hover")?.classList.remove("hover");
            }
          });
      });

      return svg;
    }
    function toCity(city: string) {
      store.commit("setCurrentCity", city);
      store.commit("busRoute/getCityBusRoute", city);
    }
    return {
      //methods
      toCity,
    };
  },
});
</script>