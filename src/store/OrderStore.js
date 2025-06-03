import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useOrderStore = defineStore('order', {
    state: () => ({
        ordersState: [],
        metaState: [],
        analyticsState: [],
        error: null,
    }),
    getters: {
        orders: (state) => state.ordersState,
        meta: (state) => state.metaState,
        analytics: (state) => state.analyticsState,
    },
    actions: {
        async createOrder(orderData) {
            try {
                const response = await axiosInstance.post('/orders', orderData);
                if (response.status === 201) {
                    alert('Заказ успешно оформлен!');
                }
            } catch (error) {
                this.error = error.message || "Ошибка при оформлении заказа";
                console.error('Ошибка при оформлении заказа:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
                throw error; 
            }
        },
        async getOrdersForHistory(params = {}) {
            try {
                const response = await axiosInstance.get('/history/orders', {
                    params
                });
                this.ordersState = response.data.data;
                this.metaState = response.data.meta;
            } catch (error) {
                this.error = error.message || "Помилка при отриманні заказів";
                console.error(error);
            }
        },
        async getOrdersAnalytics(params = {}) {
            try {
                const response = await axiosInstance.get('/history/orders/analytics', {
                    params
                });
                this.analyticsState = response.data.data;
            } catch (error) {
                this.error = error.message || "Помилка при отриманні заказів";
                console.error(error);
            }
        },
        async getOrdersByUserId() {
            try {
                const response = await axiosInstance.get('/orders')
                this.ordersState = response.data.data;
                console.log(response.data.data);
            } catch (error) {
                this.error = error.message || "Помилка при отриманні заказів";
                console.error(error);
            } 
        }
    },
    persist: true, 
});