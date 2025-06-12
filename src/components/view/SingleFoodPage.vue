<template>
  <div class="main-page">
    <FoodComponent :id="id"/>
    <NutritionTrackingModal
        :open="modalWindow"
        @confirm="modalWindow = false"
    />
  </div>
</template>
  
<script>
import { useRoute } from 'vue-router';
import Category from '../layout/Category.vue';
import FoodComponent from '../layout/FoodComponent.vue';
import {computed, ref} from 'vue';
import NutritionTrackingModal from "@/components/layout/NutritionTrackingModal.vue";


export default {
  name: 'MainPage',
  components: {
    NutritionTrackingModal,
    Category,
    FoodComponent
  },
  setup() {
    const route = useRoute()
    const id = computed(() => route.params.id)
    const modalWindow = ref(true);

    return {
      id,
      modalWindow,
    }
  }
  
};
</script>

<style>
  .main-page {
    margin-top: 150px;
  }
</style>