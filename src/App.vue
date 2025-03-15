<template>
  <div class="main-container">
    <Header />
    <router-view />
    <Footer/>
  </div>
</template>

<script>

import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    Header,
    RouterView,
    Footer
  },
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Yuji+Mai&display=swap');
  * {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    margin: 0;
  }
  .main-container {
    width: 1150px;
    margin: 0 auto;
  }
</style>
