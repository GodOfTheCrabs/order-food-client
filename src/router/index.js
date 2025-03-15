import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/components/view/MainPage.vue";
import SingleFoodPage from "@/components/view/SingleFoodPage.vue";
import Profile from "@/components/user/Profile.vue";
import ProfileEdit from "@/components/user/ProfileEdit.vue";
import Basket from "@/components/basket/Basket.vue";
import BasketProducts from "@/components/basket/BasketProducts.vue";
import NotFound from "@/components/view/NotFound.vue";

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/food/:id',
        name: 'SingleFoodPage',
        component: SingleFoodPage,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: ProfileEdit,
        meta: { requiresAuth: true }
    },
    {
        path: '/basket',
        name: 'Basket',
        component: Basket,
        meta: { requiresAuth: true }
    },
    {
        path: '/basket-products',
        name: 'BasketProducts',
        component: BasketProducts,
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
})

router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem("authToken");

    if (to.meta.requiresAuth && !authToken) {
        alert('Потрібно зареєструватися')
        next({ name: 'MainPage' });
    } else {

        next();
    }
});

export default router;
