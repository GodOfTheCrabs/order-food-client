import { defineStore } from "pinia";
import axiosInstance from "../../services/axios";

export const useCommentStore = defineStore('comment', {
    state: () => ({
        commentsState: [], 
        error: null,
    }),
    getters: {
        comments: (state) => state.commentsState,
    },
    actions: {
        async createComment(commentData) {
            try {

                const response = await axiosInstance.post('/comments', commentData);
                
                return response.data;
            } catch (error) {
                
                this.error = 'Ошибка при создании комментария';
                throw new Error(this.error);
            }
        },
    },
    persist: true,
});