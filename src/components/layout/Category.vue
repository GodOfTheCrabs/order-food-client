<template>
    <div>
        <div class="category">
            <h2 class="categories-title">Категории</h2>
            <div class="category-switch">
                <div @click="prevCategory" :class="{ disabled: currentIndex === 0 }">
                    <i class="fa-solid fa-angle-left"></i>
                </div>
                <div @click="nextCategory" :class="{ disabled: currentIndex + visibleCount >= categories.length }">
                    <i class="fa-solid fa-angle-right"></i>
                </div>
            </div>
        </div>
        <div class="categories-list">
            <div class="categories-slider" :style="{ transform: `translateX(-${currentIndex * 220}px)` }">
                <div
                    v-for="category in categories"
                    :key="category.id"
                    class="category-item"
                    :style="{ backgroundImage: `url(http://localhost:3010${category.image})` }"
                    @click="searchByCategory(category.name)"
                >
                    {{ category.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCategoryStore } from '../../store/CategoryStore.js'; 
import { onMounted, ref, computed } from 'vue';

export default {
  name: 'Category',
  setup() {
    const categoryStore = useCategoryStore();
    const currentIndex = ref(0); 
    const visibleCount = 5;

    onMounted(async () => {
      await categoryStore.getCategories();
    });

    const categories = computed(() => categoryStore.categories);

    const prevCategory = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
    };

    const nextCategory = () => {
      if (currentIndex.value + visibleCount < categories.value.length) {
        currentIndex.value += 1;
      }
    };

    const searchByCategory = (category) => {
      categoryStore.selectCategory(category);
    }

    return {
      categories,
      currentIndex,
      prevCategory,
      nextCategory,
      visibleCount,
      searchByCategory
    };
  },
};
</script>

<style scoped>
  @import url('../../styles/CategoryStyle.css');
</style>