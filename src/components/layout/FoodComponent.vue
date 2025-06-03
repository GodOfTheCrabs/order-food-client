<template>
    <div>
        <div class="food-component">
            <img :src="`http://localhost:3010${food.image}`" class="img-food">
            <div class="food-desc">   
                <p class="title">{{ food.name }}</p>
                <p class="category">Категорія: {{ food.category }}</p>
                <div class="food-block">
                    <div class="price-block">
                        <p class="price">Ціна: {{ food.price }} ГРН</p>
                        <div class="basket" @click="addToCart" v-if="!isCounterVisible">
                            <i class="fas fa-shopping-cart"></i>
                        У Кошик
                        </div>
                        <div class="counter" v-else>
                            <button class="minus" @click="decrement">
                                -
                            </button>
                            <p> {{ foodCount }} шт.</p>
                            <button class="plus" @click="increment">
                                +
                            </button>
                        </div>
                    </div>

                    <div class="rating-block">
                        <i 
                            v-for="star in 5" 
                            :key="star" 
                            class="fa-star" 
                            :class="star <= Math.ceil(food.rating) ? 'fas' : 'far'" 
                            @click="rateFood(star)"
                        ></i>
                        <p class="rating-value">{{ food.rating }}/5</p>
                    </div>
                </div>
                <p class="recipe"> Склад: {{ food.recipe }}</p>
            </div>
           
        </div>
        <div class="comments-block">
                <h2>Коментарі</h2>
                <div v-if="authToken">
                    <textarea 
                        v-model="newCommentText" 
                        placeholder="Напишіть ваш коментар..." 
                        class="comment-input"
                    ></textarea>
                    <button type="submit" class="comment-submit" @click="newComment">
                        Відправити
                    </button>                  
                </div>
                <div v-else>
                    <p class="auth-warning">
                        Щоб залишити коментар, будь ласка, авторизуйтесь.
                    </p>
                </div>
                <div class="comments-list">
                    <div v-for="comment in food.comments" :key="comment.id" class="comment">
                        <div class="comment-header">
                            <p class="comment-author">{{ comment.author }}</p>
                            <p class="comment-date">{{ comment.created_at }}</p>
                        </div>
                        <p class="comment-text">{{ comment.comment }}</p>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
/* eslint-disable */
    import { useFoodStore } from '@/store/FoodStore';
    import { useCommentStore } from "../../store/CommentStore.js"
    import { useRatingStore } from '../../store/RatingStore';
    import { useUserStore } from '../../store/UserStore';
    import { computed, onMounted, ref } from 'vue';

    export default {
        name: 'FoodComponent',
        props: {
            id: {
                type: String,
                required: true
            }
        },
        setup(props) {
            const authToken = localStorage.getItem('authToken');
            const foodStore = useFoodStore();
            const commentStore = useCommentStore();
            const ratingStore = useRatingStore();
            const userStore = useUserStore()
            const newCommentText = ref('');
            const userId = ref(null);
            const isCounterVisible = ref(false)
            const foodCount = ref(1);

            const newComment = async () => {
                if (!newCommentText.value.trim()) {
                    alert('Комментарий не может быть пустым!');
                    return;
                }

                const commentData = {
                    user_id: userId.value, 
                    food_id: props.id, 
                    comment: newCommentText.value, 
                };

                await commentStore.createComment(commentData);
                window.location.reload();
                newCommentText.value = ''; 
            };

            const rateFood = async (star) => {
                if (!authToken) {
                    alert('Для оцінки потрібно зареєструвиться');
                    return;
                }

                const ratingData = {
                    user_id: userId.value,
                    food_id: props.id,
                    rating: star
                };

                const createRating = await ratingStore.setRating(ratingData);
                window.location.reload();
            };

            const addToCart = () => {
                if(!authToken) {
                    alert('Потрібно зареєструватися')
                    return
                } else {
                    isCounterVisible.value = true     
                    saveToLocalStorage(foodCount.value)
                }         
            }
            const increment = () => {
                foodCount.value++;
                saveToLocalStorage(foodCount.value)
            }
            const decrement  = () => {
                if(foodCount.value > 1) {
                    foodCount.value--;
                    saveToLocalStorage(foodCount.value)
                } else {
                    isCounterVisible.value = false;
                    removeFromLocalStorage()
                }
            }
            const saveToLocalStorage = (count) => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === props.id);
                const foodData = food.value; 
                console.log(foodData)

                if(existingItem) {
                    existingItem.count = count;
                    existingItem.totalPrice = count * foodData.price;
                } else {

                    cart.push({
                        id: props.id,
                        name: foodData.name,    
                        image: foodData.image, 
                        category: foodData.category,  
                        count,  
                        totalPrice: count * foodData.price,
                        price: foodData.price, 
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
            }
            const removeFromLocalStorage = () => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const updatedCart = cart.filter(item => item.id !== props.id);

                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
            onMounted(async () => {
                userId.value = await userStore.getUserId();  
                await foodStore.getFoods();
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === props.id);

                if (existingItem) {
                    isCounterVisible.value = true;
                    foodCount.value = existingItem.count;
                }
            });

            const food = computed(() => foodStore.getFoodById(Number(props.id)));

            return {
                food,
                isCounterVisible,
                addToCart,
                foodCount,
                increment,
                decrement,
                authToken,
                newComment,
                newCommentText,
                rateFood,
            };
        }
    }
</script>

<style scoped>
@import url('../../styles/FoodComponentStyle.css');
</style>