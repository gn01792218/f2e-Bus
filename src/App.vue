<template>
  <RequestLoading/>
  <div class="main container">
    <Header />
    <nav>
      <router-link to="/">Home</router-link>
    </nav>
    <router-view />
  </div>
  <Footer/>
</template>


<script lang="ts">
import { defineComponent } from "vue";
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
    return {};
  },
});
</script>