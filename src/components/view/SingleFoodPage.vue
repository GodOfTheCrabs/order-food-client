<template>
  <div class="main-page">
    <FoodComponent :id="id"/>
  </div>
</template>
  
<script>
import { useRoute } from 'vue-router';
import Category from '../layout/Category.vue';
import FoodComponent from '../layout/FoodComponent.vue';
import { computed } from 'vue';


export default {
  name: 'MainPage',
  components: {
    Category,
    FoodComponent
  },
  setup() {
    const route = useRoute()
    const id = computed(() => route.params.id)

    return {
      id
    }
  }
  
};
</script>

<style>
  .main-page {
    margin-top: 150px;
  }
</style>