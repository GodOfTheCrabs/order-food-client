<template>
    <div class="basket-page">
        <div class="basket-title-block">
            <h3 class="basket-title">Кошик</h3>
        </div>
        <div class="basket-product-block">
           <div class="product-block">
                <img src="../../assets/images/logo.jpeg" class="img-basket">
                <h5>У вашому кошику немає товарів</h5>
                <button class="btn-back" @click="goToMainPage">
                    На головну
                </button>
           </div>
        </div>
        <Category/>
    </div>    
</template>

<script>
import Category from '../layout/Category.vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Basket',
    components: {
        Category
    },
    setup() {
        const router = useRouter()
        const goToMainPage = () => {
            router.push('/')
        }

        return {
            goToMainPage
        }
    }
}

</script>

<style scoped>
    .basket-page {
        margin-top: 150px;
        min-height: 100vh;
    }
    .img-basket {
        width: 110px;
    }
    .product-block {
        margin-bottom: 300px;
        width: 750px;
        min-height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 25px;
        border: 1px solid #EEEFF4;
        border-radius: 25px;
    }
    .btn-back {
        background-color: #F04642;
        padding: 10px 60px;
        border: none;
        border-radius: 25px;
        color: white;
        transition: 0.3s;
    }
    .btn-back:hover {
        opacity: 0.9;
    }
</style>