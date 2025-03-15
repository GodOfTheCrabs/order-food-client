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

                const formData = new FormData();

                formData.append('first_name', userData.first_name);
                formData.append('last_name', userData.last_name);
                formData.append('email', userData.email);
                formData.append('phone', userData.phone);
                formData.append('gender', userData.gender);

                if (userData.photo) {
                    formData.append('photo', userData.photo);
                }
                const response = await axiosInstance.put('/update', userData, 'test.jpg');
                if (response.status === 201) {
                    alert('Успішно оновлено профіль!');
                }
            } catch (error) {
                this.error = error.message || "Ошибка при изминении профеля";
                console.error('Ошибка при изминении профеля:', error);
                alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
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