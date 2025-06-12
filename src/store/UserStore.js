import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        usersState: [], 
        error: null,
    }),
    getters: {
        users: (state) => state.usersState,
    },
    actions: {
        async updateUserProfile(userData) {
            try {
                console.log(userData);
                const response = await axiosInstance.put('/update', {
                    first_name: userData?.first_name,
                    last_name: userData?.last_name,
                    email: userData?.email,
                    phone: userData?.phone,
                    gender: userData?.gender,
                    is_manage_finances: userData?.is_manage_finances,
                    daily_limit: userData?.daily_limit,
                    monthly_limit: userData?.monthly_limit,
                });

                if (response.status === 200 || response.status === 201) {
                    alert('Успішно оновлено профіль!');
                }
            } catch (error) {
                this.error = error?.response?.data?.message || "Помилка при оновленні профілю";
                console.error('Помилка при оновленні профілю:', error);
                alert('Сталася помилка. Спробуйте ще раз.');
                throw error;
            }
        },
        async getUser() {
            try {
                const response = await axiosInstance.get('/user');
                return response.data;
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                throw error;
            }
        },
        async getUserId() {
            try {
                const response = await axiosInstance.get('/user');
                return response.data.id
            } catch (error) {
                console.error('Ошибка при получении id пользователя:', error)
                throw error;
            }
        }
    },
    persist: true, 
});