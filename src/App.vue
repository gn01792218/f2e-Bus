<template>
  <RequestLoading/>
  <div class="main container">
    <Header />
    <router-view />
  </div>
  <Footer/>
</template>


<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Header from "@/views/Header.vue";
import Footer from "@/views/Footer.vue";
import RequestLoading from '@/components/RequestLoading.vue'
export default defineComponent({
  name: "HomeView",
  components: {
    Header,
    Footer,
    RequestLoading,
  },
  setup() {
    onMounted(()=>{  //為了部署gitHub
      const { NODE_ENV } = process.env;
      document.documentElement.className = NODE_ENV;
    })
    return {};
  },
});
</script>