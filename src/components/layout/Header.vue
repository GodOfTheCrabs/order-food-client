<!-- eslint-disable -->
<template>
    <div class="header">
        <div class="header-nav">
            <img src="../../assets/images/logo.jpeg" alt="" id="logo">
            <router-link to="/" class="header-nav-link">Головна</router-link>
            <router-link to="/" class="header-nav-link">Про нас</router-link>
            <router-link to="/" class="header-nav-link">Контакти</router-link>
        </div>
        <div class="header-user">
            <button class="user-basket" @click="showOrderList" v-if="isOrderButton" style="margin-right: 50px;">
                <i class="fa-solid fa-cubes"></i>
                Відслюдковувати замовлення
            </button>
            <div class="list order-list" v-if="isOrderList"  :class="{active : isListOrderActive}">
                <template v-for="(order, index) in orderTimes">
                    <h6>Замовлення #{{ index + 1 }}</h6>
                    <p>
                        Час приготування: {{ order.preparation_time }} сек
                    </p>
                    <p>
                        Час доставки: {{ order.delivery_time }} сек
                    </p>
                    <p>
                        Повний час: {{ order.preparation_time + order.delivery_time}} сек
                    </p>
                    <p style="color: #2458D3;">
                        Скільки часу пройшло: {{ timers[index] || '00:00' }}
                    </p>
                    <button v-if="getTimeInSeconds(timers[index]) >= maxTime[index] / 1000" @click="resetOrder(index)" class="user-profile" >
                        Пітвердити замовлення
                    </button>
                    <hr> 
                 </template>
            </div>
            <button @click="showProfileList"  v-if="isAuthenticated" class="user-profile">
                <i class="fa-regular fa-user"></i>
                Профіль
            </button>
            <button @click="isVisibleLogin = !isVisibleLogin" v-else class="user-profile">
                <i class="fa-regular fa-user"></i>
                Увійти
            </button>
            <div class="list profile-list" v-if="isAuthenticated" :class="{active : isListActive}">
                <button @click="goToProfile">
                    Особистий кабінет <i class="fa-solid fa-angle-right"></i>
                </button>
                <button>
                    Історія заказів <i class="fa-solid fa-angle-right"></i>
                </button>
                <button class="logout" @click="handleLogout">
                    Выйти <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
            <button class="user-basket" @click="goToBasket">
                <i class="fas fa-shopping-cart"></i>
                Кошик
            </button>
        </div>
        <Login v-if="isVisibleLogin" @loginSuccess="handleLoginSuccess">
            <template #close>
                <i class="fa-solid fa-x close-button" @click="isVisibleLogin = !isVisibleLogin"></i>
            </template>
        </Login>
    </div>
</template>

<script>
/* eslint-disable */

import { onMounted, ref } from 'vue';
import Login from '../user/Login.vue'
import { useRouter } from 'vue-router';
import { logout } from '../../../api/auth.js';
    export default {
        
        name: 'Header',
        components:{
            Login
        },
        setup() {
            const isAuthenticated = ref(false);
            const isVisibleLogin = ref(false)
            const isListActive = ref(false) 
            const isListOrderActive = ref(false) 
            const isOrderList = ref(false)
            const isOrderButton = ref(false);
            const orderTimes = ref([]); 

            const timers = ref({}); 
            const maxTime = ref([]);

            const getTimeInSeconds = (timeStr) => {
                if (!timeStr) return 0; 
                const [minutes, seconds] = timeStr.split(':').map(Number);
                return minutes * 60 + seconds;
            };

            const updateTimers = () => {
                const now = Date.now(); 
                const updatedTimers = {};
                const updatedMaxTime = [];

                orderTimes.value.forEach((order, index) => {
                    const orderStartTime = new Date(order.created_at).getTime(); 
                    const elapsed = now - orderStartTime; 
                    const totalMaxTime = (order.preparation_time + order.delivery_time) * 1000; 

                    updatedMaxTime[index] = totalMaxTime;

                    if (elapsed < totalMaxTime) {
                        const minutes = Math.floor(elapsed / 1000 / 60);
                        const seconds = Math.floor((elapsed / 1000) % 60);
                        updatedTimers[index] = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    } else {
                        updatedTimers[index] = `${Math.floor(totalMaxTime / 1000 / 60)}:${Math.floor((totalMaxTime / 1000) % 60)}`;
                    }
                });

                timers.value = updatedTimers; 
                maxTime.value = updatedMaxTime;
            };

            const showOrderList = () => {
                const orders = JSON.parse(localStorage.getItem('orderTimes')) || [];
                if (orders.length > 0) {
                    isOrderList.value = !isOrderList.value;
                    isListOrderActive.value = !isListOrderActive.value;
                    orderTimes.value = orders;
                }
            }

            const resetOrder = (index) => {
                const orders = JSON.parse(localStorage.getItem('orderTimes')) || [];
                orders.splice(index, 1); 
                localStorage.setItem('orderTimes', JSON.stringify(orders)); 
                orderTimes.value = orders;
                if(orders.length < 1) {
                    window.location.reload()
                }
                updateTimers(); 
            };

            const router = useRouter()

            const showProfileList = () => {
                isListActive.value = !isListActive.value;
            }

            const checkAuth = () => {
                const token = localStorage.getItem('authToken');
                isAuthenticated.value = !!token; 
            };

            const handleLogout = async () => {
                await logout();
            }

            const goToProfile = () => {
                isListActive.value = false;
                router.push('/profile')
            }

            const goToBasket = () => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                console.log(cart);
                if (cart.length > 0) {
                    router.push('/basket-products');
                } else {
                    router.push('/basket');
                }
            }
            const handleLoginSuccess = () => {
                isVisibleLogin.value = false;  
                checkAuth();  
            }
            onMounted(() => {
                checkAuth();
                const orders = JSON.parse(localStorage.getItem('orderTimes')) || [];
                if (orders.length > 0) {
                    orderTimes.value = orders;
                    isOrderButton.value = true;

                    setInterval(updateTimers, 1000); 
                }
            });
            return {
                isVisibleLogin,
                goToProfile,
                isAuthenticated,
                isListActive,
                showProfileList,
                handleLogout,
                handleLoginSuccess,
                goToBasket,
                showOrderList,
                isOrderList,
                isListOrderActive,
                isOrderButton,
                orderTimes,
                timers,
                resetOrder,
                maxTime,
                getTimeInSeconds
            }
        }
    }
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        position: fixed; 
        top: 0; 
        width: 1150px; 
        background-color: white; 
        z-index: 100; 
    }
    #logo {
        height: 80px;
    }
    .header-user {
        position: relative;
    }
    .list {
        background-color: white;
        opacity: 0;
        visibility: hidden;
        position: absolute;
        display: flex;
        flex-direction: column;
        border-radius: 5%;
        width: 220px;
        box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.1);
        padding: 10px;
        gap: 5px;
        transition: opacity 0.3s;
    }

    .profile-list {
        top: 60px;
        right: 150px;
    }

    
    .order-list {
        top: 60px;
        left: 0px;
        width: 350px;
    }
    .order-list p {
        font-size: 14px;
        color: #93969C;
    }
    .list button {
        border: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        background-color: white;
        transition: 0.3s;
    }

    .list button i {
        padding: 5px 6px;
        border-radius: 50%;
        font-size: 12px;
        transition: 0.3s;
    }

    .list button:hover {
        font-weight: 700;
        padding-bottom: 5px;
    }
    .list button:hover i {
        background-color: #2458D3;
        color: white;
    }
    .logout {
        padding-top: 8px;
        border-top: 1px solid #EBECF1 !important;
    }
    .logout:hover i {
        background-color: #F04642 !important;
    }
    .logout:hover {
        color: #F04642;
    }
    .header-nav {
        display: flex;
        align-items: center;
        width: 350px;
        justify-content: space-between;
    }
    .header-nav-link {
        color: #93969C;
        transition: 0.3s;
        text-decoration: none;
    }
    .header-nav-link:hover {
        color: #FAD84B;
    }
    .user-profile{
        border: none;
        background-color: #d4d5dd;
        padding: 10px 15px; 
        border-radius: 30px;
        transition: 0.3s;
        cursor: pointer;
        text-decoration: none;
        color: black;
        margin-right: 40px;
    }
    .user-profile:hover {
        opacity: 0.8;

    }
    .fa-user {
        margin-right: 10px;
    }
    .fa-shopping-cart {
        margin-right: 10px;
    }
    .user-basket{
        background-color: #2458D3;
        padding: 10px 30px; 
        border-radius: 30px;
        transition: 0.3s;
        cursor: pointer;
        border: none;
        color: white;
    }
    .user-basket:hover {
        opacity: 0.8;
    }
    .active {
        opacity: 1;
        visibility: visible;
    }
</style>