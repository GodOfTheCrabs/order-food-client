import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useFoodStore = defineStore('food', {
    state: () => ({
        foodsState: [],
    }),
    getters: {
        foods: (state) => state.foodsState,
        getFoodById: (state) => (id) => state.foodsState.find(food => food.id === id),
    },
    actions: {
        async getFoods() {
            try {
                const response = await axiosInstance.get(`/foods`);
                this.foodsState = response.data.data;
            } catch (error) {
                this.error = error.message || "Помилка при отриманні Їжі";
                console.error(error);
            } 
        },
        getFoodsFromCart() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartIds = [...new Set(cart.map(item => Number(item.id)))]; 
           
            const foodsInCart = this.foodsState.filter(food => cartIds.includes(food.id));
            return foodsInCart;
        },
        filterFoodsByCategory(category) {
            this.foodsState = this.foodsState.filter(food => food.category === category);
        }

    },
    persist: true, 
})