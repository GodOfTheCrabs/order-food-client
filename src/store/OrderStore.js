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
            } catch (error) {
                this.error = error.message || "Помилка при отриманні заказів";
                console.error(error);
            } 
        },
        async exportOrders(params = {}) {
            try {
                const response = await axiosInstance.get('/history/orders/reports', {
                    params,
                    responseType: 'blob', // важливо!
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const fileName = `orders_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_')}.xlsx`;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);

            } catch (error) {
                this.error = error.message || "Помилка при експорті замовлень";
                console.error('Export error:', error);
                alert('Помилка при завантаженні файлу.');
            }
        }
    },
    persist: true, 
});