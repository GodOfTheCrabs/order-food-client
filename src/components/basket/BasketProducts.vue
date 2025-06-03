<template>
    <div class="basket-page">
        <div class="basket-title-block">
            <h3 class="basket-title">Кошик</h3>
            <button class="btn-clear" @click="clearCart">
                Очистити кошик <i class="fa-solid fa-x"></i>
            </button>
        </div>
        <div class="order">
            <div class="basket-product-block">
                <div class="product-block" v-for="food in foodsInCart" :key="food.id">
                    <div>
                        <img :src="`http://localhost:3010${food.image}`" class="img-product">
                        <h6>{{ food.name }}</h6>
                    </div>
                    <div class="counter">
                        <button class="minus" @click="decrement(food.id)">
                            -
                        </button>
                        <p> {{food.count}} шт.</p>
                        <button class="plus" @click="increment(food.id)">
                            +
                        </button>
                    </div>
                    <div class="product-price">
                        <p class="price-all">{{food.totalPrice}} грн</p>
                        <p class="price-one">{{ food.price }} грн за шт.</p>
                    </div>
                    <div class="delete">
                        <i class="fa-solid fa-trash-can" @click="removeFromCart(food.id)"></i>
                    </div>
                </div>    
                
            </div>
            <div class="order-block">
                <div class="price-items">
                    <p>Доставка:</p>
                    <p class="price-order">40 грн</p>
                </div>
                <div class="price-items">
                    <p>Вартість товарів:</p>
                    <p class="price-order">{{totalPrice}} грн</p>
                </div>
                <div class="price-items">
                    <p>До сплати:</p>
                    <p class="price-order">{{totalPrice + 40}} грн</p>
                </div>
                <div class="price-items">
                    <p>Хочу відслідковувати заказ:</p>
                    <input type="checkbox" id="trackOrder" v-model="trackOrder" @change="timeBlock">
                </div>
                <div class="price-items" v-if="trackOrder">
                    <p>Час на приготування:</p>
                    <p class="price-order">{{preparationTime}} сек.</p>
                </div>
                <div class="price-items" v-if="trackOrder">
                    <p>Час на доставку:</p>
                    <p class="price-order">{{deliveryTime}} сек.</p>
                </div>
                <div class="price-items" style="justify-content: center; border: none;">
                    <button class="btn-order" @click="placeOrder">
                        Замовити
                    </button>
                </div>
            </div>  
        </div>
        <Category/>
    </div>    
</template>

<script>
/* eslint-disable */
    import Category from '../layout/Category.vue';
    import { getUserId } from '../../../api/auth.js';
    import { useRouter } from 'vue-router';
    import { useOrderStore } from "../../store/OrderStore.js"
    import { onMounted, ref } from 'vue';
    export default {
        name: 'Basket',
        components: {
            Category
        },
        setup() {
            const foodsInCart = ref([]);
            const totalPrice = ref(0);
            const userId = ref(null);
            const trackOrder = ref(false);
            const router = useRouter()
            const orderStore = useOrderStore();

            const preparationTime = ref(0);
            const deliveryTime = ref(0);

            const timeBlock = () => {
                if(preparationTime.value == 0) {
                    preparationTime.value = Math.floor(Math.random() * 11) + 15;
                    deliveryTime.value = Math.floor(Math.random() * 11) + 15;
                } else {
                    preparationTime.value = 0
                    deliveryTime.value = 0
                }
            }

            const fetchUserDataId = async () => {
                try {
                    const userData = await getUserId();
                    userId.value = userData;
                    console.log(userId.value);
                } catch (error) {
                    console.error('Не удалось получить данные пользователя:', error);
                }
            };

            const increment = (id) => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const foodItem = cart.find(item => item.id === id);            
            if (foodItem) {
                foodItem.count++;
                foodItem.totalPrice = foodItem.count * foodItem.price;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        }

        const decrement = (id) => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const foodItem = cart.find(item => item.id === id);
            if (foodItem && foodItem.count > 1) {
                foodItem.count--;
                foodItem.totalPrice = foodItem.count * foodItem.price; 
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        };

        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            foodsInCart.value = cart;


            totalPrice.value = cart.reduce((sum, food) => {
                const price = parseFloat(food.price) || 0;
                const count = parseInt(food.count) || 0;
                return sum + (price * count); 
            }, 0);
        };

            const removeFromCart = (id) => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(item => item.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            };

            const clearCart = () => {
                localStorage.removeItem('cart');
                updateCart();
                router.push('/')
            };

            const placeOrder = async () => {
                
                const orderData = {
                    user_id: userId.value,
                    foods: foodsInCart.value.map(food => ({
                        food_id: food.id,
                        count: food.count
                    })),
                    total_price: totalPrice.value + 40,
                    track_order: trackOrder.value,
                    preparation_time: preparationTime.value, 
                    delivery_time: deliveryTime.value      
                };
                
                console.log(orderData);
                
                try {
                    if (preparationTime.value != 0) {
                        const orderTimes = JSON.parse(localStorage.getItem('orderTimes')) || [];
                        const newOrderTime = {
                            preparation_time: preparationTime.value,
                            delivery_time: deliveryTime.value,
                            total_time: preparationTime.value + deliveryTime.value,
                            created_at: new Date().toISOString() 
                        };
                        orderTimes.push(newOrderTime);
                        localStorage.setItem('orderTimes', JSON.stringify(orderTimes));
                    }
                    

                    const createdOrder = await orderStore.createOrder(orderData);
                    clearCart();
                    router.push('/').then(() => {
                        window.location.reload(); 
                    });
                } catch (error) {
                    console.error('Не удалось создать заказ:', error);
                }
            };

            onMounted(async () => {
                updateCart();
                fetchUserDataId();

            });

            return {
                foodsInCart,
                increment,
                decrement,
                removeFromCart,
                clearCart,
                totalPrice,
                placeOrder,
                userId,
                preparationTime,
                deliveryTime,
                trackOrder,
                timeBlock
            };
        }
    }

</script>

<style scoped>

    .basket-page {
        margin-top: 150px;
        min-height: 100vh;
    }
    .basket-title-block {
        display: flex;
        justify-content: space-between;
        margin-bottom: 50px;
    }
    .order {
        min-height: 100vh;
        display: flex;
        gap: 15px;
    }
    .img-product {
        width: 95px;
        height: 95px;
        border-radius: 10px;
        margin-right: 15px;
    }
    .basket-product-block {
        min-width: 720px;
    }
    .product-block {
        height: 110px;
        width: 720px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid #EEEFF4;
        border-radius: 25px;
        margin-bottom: 25px;
    }
    .product-block div {
        display: flex;
        align-items: center;
    }
    .btn-clear {
        padding: 5px 20px;
        background-color: #F3F4F9;
        border: none;
        border-radius: 20px;
        transition: 0.3s;
    }

    .btn-clear:hover {
        background-color: #bbbbbe;
    }
    .btn-clear i {
        font-size: 10px;
        padding: 6px 7px;
        margin-left: 5px;
        color: white;
        background-color: #F04642;
        border-radius: 50%;
    }
    .counter {
        height: 40px;
        background-color: #F8F9FC;
        border: 1px solid #EEEFF4;
        border-radius: 15px;
    }
    .counter button {
        border: none;
        margin: 0 10px;
        border-radius: 15px;
        transition: 0.2 s;
    }
    .counter button:hover {
        background-color: #2458D3;
        color: white;
    }
    .minus {
        font-size: 18px;
        font-weight: 700;
        padding: 2px 10px;
    }
    .plus {
        font-size: 14px;
        font-weight: 700;
        padding: 5px 10px;
    }
    p {
        margin-bottom: 0 !important;
    }
    .product-price {
        display: flex;
        flex-direction: column;
    }
    .price-all {
        font-weight: 600;
    }
    .price-one {
        color: #B8B9B8;
        font-size: 12px
    }
    .delete i{
        font-size: 20px;
        cursor: pointer;
    }
    .order-block {
        width: 405px;
        height: 350px;
        padding: 10px;
        background-color: #F3F4F9;
        border-radius: 15px;
    }
    .price-items {
        display: flex;
        justify-content: space-between;
        padding: 25px 0;
        border-bottom: 1px solid #D7D9DF;
    }
    .price-items p {
        color: #9A9C94;
        font-weight: 600;
    }
    .price-order {
        color: black !important;
        font-weight: 700;
    }
    .btn-order {
        padding: 10px 35px;
        border: none;
        background-color: #F04642;
        color: white;
        border-radius: 25px;
        transition: 0.3s;
    }
    .btn-order:hover {
        opacity: 0.8;
    }
</style>