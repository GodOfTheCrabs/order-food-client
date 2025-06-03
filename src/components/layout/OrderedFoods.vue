<template>
    <div v-if="foods.length > 0">
        <div class="ordered-foods"> 
            <h2 class="ordered-foods-title">Нещодавно замовленні</h2>
            <div class="ordered-foods-switch">
                <div @click="prevCategory" :class="{ disabled: currentIndex === 0 }">
                    <i class="fa-solid fa-angle-left"></i>
                </div>
                <div @click="nextCategory" :class="{ disabled: currentIndex + visibleCount >= foods.length }">
                    <i class="fa-solid fa-angle-right"></i>
                </div>
            </div>
        </div>
        <div class="ordered-foods-list">
            <div class="ordered-foods-slider" :style="{ transform: `translateX(-${currentIndex * 290}px)` }">
                <FoodCard
                  v-for="food in foods"
                  :key="food.id"
                >
                  <template #image>
                      <img :src="`http://localhost:3010${food.image}`" class="food-img" />
                  </template>
                  <template #price>
                      <p class="food-price">{{ food.price }} ГРН</p>                   
                  </template>
                  <template #name>
                      <router-link :to="{ name: 'SingleFoodPage', params: { id: food.id } }" class="food-name">{{ food.name }}</router-link>
                  </template>
              </FoodCard>
            </div>
        </div>
    </div>
</template>

<script>
// import { useRouter } from 'vue-router';
import { useOrderStore } from '../../store/OrderStore.js'; 
import { getUserId } from '../../../api/auth.js';
import { onMounted, ref, computed } from 'vue';
import FoodCard from '../layout/FoodCard.vue';

export default {
  name: 'Category',
  components: {
    FoodCard
  },
  setup() {
    const orderStore = useOrderStore();
    const currentIndex = ref(0); 
    const visibleCount = 5;
    const categoryWidth = 250;
    const userId = ref(null);


    onMounted(async () => {
      userId.value = await getUserId();
      await orderStore.getOrdersByUserId(userId.value);
    });

    const foods = computed(() => {
      const allFoods = orderStore.orders.map(order => order.foods).flat();
      const seenIds = new Set();
      return allFoods.filter(food => {
        if (seenIds.has(food.id)) {
          return false;
        }
        seenIds.add(food.id);
        return true;
      });
    });

    const prevCategory = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
      console.log(foods)
    };

    const nextCategory = () => {
      if (currentIndex.value + visibleCount < foods.value.length) {
        currentIndex.value += 1;
      }
    };

    return {
      foods,
      categoryWidth,
      currentIndex,
      prevCategory,
      nextCategory,
      visibleCount,
    };
  },
};
</script>

<style scoped>
    .ordered-foods-title {
      padding-top: 5px;
    }
    .ordered-foods {
      margin-top: 100px;
      display: flex;
      justify-content: space-between;
    }
    .ordered-foods-list {
      margin-top: 20px;
      overflow: hidden; 
      position: relative;
      width: 1150px;
    }

    .ordered-foods-slider {
      display: flex;
      flex-shrink: 0;
      gap: 20px;
      transition: transform 0.5s ease; 
    }
    .ordered-foods-item {
      width: 210px !important;
      height: 175px;
      background-repeat: no-repeat;
      background-size: cover;
      padding: 10px 0 0 20px;
      border-radius: 10%;
      color: white;
      flex-shrink: 0;
      cursor: pointer;
    }
    .ordered-foods-switch {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .ordered-foods-switch div {
      width: 50px;
      height: 50px;
      background-color: #D4D5DD;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: opacity 0.3s;
      cursor: pointer;
    }
    .ordered-foods-switch div:hover {
      opacity: 0.8;
    }
    .food-img {
      width: 270px !important;
    }
</style>