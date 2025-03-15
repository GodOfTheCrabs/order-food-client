import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categoriesState: [],
        selectedCategory: null,
    }),
    getters: {
        categories: (state) => state.categoriesState
    },
    actions: {
        async getCategories() {
            try {
                const response = await axiosInstance.get(`/categories`);
                this.categoriesState = response.data.data;
            } catch (error) {
                this.error = error.message || "Помилка при отриманні категорій";
                console.error(error);
            } 
        },
        selectCategory(category) {
            this.selectedCategory = category;
        },
    },
    persist: true, 
})