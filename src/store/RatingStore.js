import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useRatingStore = defineStore('rating', {
    state: () => ({
        ratingsState: [], 
        error: null,
    }),
    getters: {
        ratings: (state) => state.ratingsState,
    },
    actions: {
        async setRating(ratingData) {
            try {
                const response = await axiosInstance.post('/ratings', ratingData);
                if (response.status === 201) {
                    alert('Дякуюем за відгук');
                    this.ratingsState.push(response.data); 
                    return response.data;
                }
            } catch (error) {
                this.error = error.message || "Ошибка при оформлении заказа";
                console.error('Ошибка при оформлении заказа:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
                throw error; 
            }
        },
    },
    persist: true, 
});