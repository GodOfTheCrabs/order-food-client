<template>
    <div class="foods">
        <div class="food-title">
            <h2>{{ selectedCategory ? 'Замовлення по категорії: ' + selectedCategory : 'Всі можливі замовлення'}}</h2>
            <button class="btn-clear" @click="clearCategory" v-if="selectedCategory">
                Очистити категорію <i class="fa-solid fa-x"></i>
            </button>
        </div>
        <div class="filter-block">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Пошук за назвою..."
                class="search-input"
            />
            <div class="price-filter">
                  <input
                    id="min-price"
                    type="number"
                    v-model.number="minPrice"
                    placeholder="Мін"
                    min="0"
                    class="price-input"
                  />
                  <input
                    id="max-price"
                    type="number"
                    v-model.number="maxPrice"
                    placeholder="Макс"
                    min="0"
                    class="price-input"
                  />
                </div>
            <div class="sort-block">
              <h6>Сортування:</h6>
              <div class="sort-options">
                <span
                  class="sort-option"
                  :class="{ active: sortType === 'name' }"
                  @click="setSortType('name')"
                >
                  Назва
                  <i :class="sortType === 'name' ? (sortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down') : 'fa-solid fa-sort'"></i>
                </span>
                <span
                  class="sort-option"
                  :class="{ active: sortType === 'price' }"
                  @click="setSortType('price')"
                >
                  Ціна
                  <i :class="sortType === 'price' ? (sortDirection === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down') : 'fa-solid fa-sort'"></i>
                </span>
              </div>
            </div>
        </div>
        <Pagination :items="filteredFoods"/>
    </div>
</template>

<script>
import { useFoodStore } from '../../store/FoodStore.js'; 
import { useCategoryStore } from '@/store/CategoryStore.js';
import { onMounted, computed, ref} from 'vue';
import Pagination from '../layout/Pagination.vue';

export default {
  name: 'Food',
  components: {
    Pagination
  },
  setup() {
    const foodStore = useFoodStore();
    const categoryStore = useCategoryStore();
    const selectedCategory = computed(() => categoryStore.selectedCategory)
    const searchQuery = ref('');
    const sortType = ref('name'); 
    const sortDirection = ref('asc'); 
    const minPrice = ref(null);
    const maxPrice = ref(null);


    const clearCategory = () => {
      categoryStore.selectCategory(null);
    }

    onMounted(async () => {
      await foodStore.getFoods();
    });

    const filteredFoods = computed(() => {
      let filtered = foodStore.foods;

      if (selectedCategory.value) {
        filtered = filtered.filter(food => food.category === selectedCategory.value);
      }

      if (searchQuery.value) {
        filtered = filtered.filter(food => food.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
      }

      if (minPrice.value !== null && minPrice.value !== '') {
        filtered = filtered.filter(food => food.price >= minPrice.value);
      }

      if (maxPrice.value !== null && maxPrice.value !== '') {
        filtered = filtered.filter(food => food.price <= maxPrice.value);
      }

      if (sortType.value === 'name') {
        filtered = filtered.sort((a, b) => {
          return sortDirection.value === 'asc'
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name); 
        });
      } else if (sortType.value === 'price') {
        filtered = filtered.sort((a, b) => {
          return sortDirection.value === 'asc'
            ? a.price - b.price 
            : b.price - a.price; 
        });
      }

      return filtered;
    });

    const setSortType = (type) => {
      if (sortType.value === type) {
        toggleSortDirection();
      } else {
        sortType.value = type;
        sortDirection.value = 'asc';
      }
    };

    const toggleSortDirection = () => {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    };
    return {
      filteredFoods,
      selectedCategory,
      clearCategory,
      searchQuery,
      sortType,
      sortDirection,
      setSortType,
      toggleSortDirection,
      minPrice,
      maxPrice
    };
  },
};
</script>

<style>
    @import url('../../styles/FoodsStyle.css');
</style>