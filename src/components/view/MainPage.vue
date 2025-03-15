<template>
  <div class="main-page">
    <Category/>
    <OrderedFoods v-if="authToken"/>
    <Foods/>
  </div>
</template>

<script>
import Category from '../layout/Category.vue';
import Foods from '../layout/Foods.vue';
import OrderedFoods from '../layout/OrderedFoods.vue';
import Login from '../user/Login.vue';


export default {
  name: 'MainPage',
  components: {
    Category,
    Foods,
    Login,
    OrderedFoods
  },
  setup() {
    const authToken = localStorage.getItem('authToken');
    return {
      authToken
    }
  }
  
};
</script>

<style>
  .main-page {
    margin-top: 150px;
    min-height: 100vh;
  }
</style>