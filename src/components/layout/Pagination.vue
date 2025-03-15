<template>
    <div class="pagination-food">
        <div class="foods-list">
            <FoodCard
                v-for="food in paginatedItems"
                :key="food.id"
            >
                <template #image>
                    <img :src="`http://127.0.0.1:8000${food.image}`" class="food-img" />
                    <div class="counter" v-if="food.showCounter" >
                        <button class="minus" @click="decrement(food)">-</button>
                        <p>{{ food.count }} шт.</p>
                        <button class="plus" @click="increment(food)">+</button>
                    </div>
                    
                    <div class="plus-counter" v-else @click="showCounter(food)">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                </template>
                <template #price>
                    <p class="food-price">{{ food.price }} ГРН</p>
                    
                </template>
                <template #name>
                    <router-link :to="{ name: 'SingleFoodPage', params: { id: food.id } }" class="food-name">{{ food.name }}</router-link>
                </template>
            </FoodCard>
        </div>
        <div class="pagination">
            <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
            >
                <i class="fa-solid fa-angle-left"></i>
            </button>
            <span v-for="page in totalPages" :key="page">
                <button
                    class="pagination-btn"
                    :class="{ active: page === currentPage }"
                    @click="changePage(page)"
                >
                {{ page }}
                </button>
            </span>
            <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
            >
                <i class="fa-solid fa-angle-right"></i>
            </button>
        </div>
    </div>    
</template>

<script>
import FoodCard from '../layout/FoodCard.vue';
import { ref, computed, onMounted } from "vue";
    export default{
        name: 'Pagination',
        components: {
            FoodCard
        },
        props: {
            items: {type: Array, required: true},
            itemsPerPage: {type: Number, default: 12},
        },
        setup(props) {
            const currentPage = ref(1);           
            const authToken = localStorage.getItem('authToken');
            const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

            const paginatedItems = computed(() => {
            const start = (currentPage.value - 1) * props.itemsPerPage;
            const end = start + props.itemsPerPage;
            return props.items.slice(start, end);
            });

            const changePage = (page) => {
                if (page >= 1 && page <= totalPages.value) {
                    currentPage.value = page;
                }
            };

            const showCounter = (food) => {
                if(!authToken) {
                    alert('Потрібно зареєструватися')
                    return;
                } else {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.id === food.id);
                    food.showCounter = true;
                    if (existingItem) {    
                        food.count = existingItem.count;
                    } else {
                        food.count = 1; 
                        saveToLocalStorage(food); 
                    }
                }
            };

            const increment = (food) => {
                food.count++;
                saveToLocalStorage(food);
                console.log(food)
            };

            const decrement = (food) => {
                if (food.count > 1) {
                    food.count--;
                    saveToLocalStorage(food);
                } else {
                    food.showCounter = false;
                    removeFromLocalStorage(food);
                }
            };

            const saveToLocalStorage = (food) => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === food.id);

                if (existingItem) {
                    existingItem.count = food.count;
                    existingItem.totalPrice = food.count * food.price;
                } else {
                    cart.push({
                        id: food.id,
                        name: food.name,
                        image: food.image,
                        category: food.category,
                        count: food.count,
                        totalPrice: food.count * food.price,
                        price: food.price
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
            };

            const removeFromLocalStorage = (food) => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.filter(item => item.id !== food.id);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            };

            onMounted(() => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                props.items.forEach(food => {
                    const existingItem = cart.find(item => item.id === food.id);
                    if (existingItem) {
                        food.showCounter = true;
                        food.count = existingItem.count;
                    }
                });
            });

            return {
                currentPage,
                totalPages,
                paginatedItems,
                changePage,
                showCounter,
                increment,
                decrement,
            };
        }
    }
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.pagination-btn:hover {
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.pagination-btn.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.pagination-btn:disabled {
  background-color: #f1f1f1;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}
.counter {
    position: absolute;
    top: 56%;
    right: 13%;
    height: 50px;
    width: 200px;
    background-color: #F8F9FC;
    border: 1px solid #cbccce;
    border-radius: 25px;
    gap: 25px;
    display: flex;
    align-items: center;
}
.counter button {
    border: none;
    border-radius: 15px;
    transition: 0.2 s;
    margin: 0 10px;
}
.counter button:hover {
    background-color: #2458D3;
    color: white;
}
.minus {
    font-size: 18px;
    font-weight: 700;
    padding: 3px 12px;
}
.plus {
    font-size: 14px;
    font-weight: 700;
    padding: 5px 12px;
}
p {
    margin-bottom: 0 !important;
}
</style>