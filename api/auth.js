import axiosInstance from "../services/axios.js";

export const login = async (credentials) => {
    return await axiosInstance.post('/login', credentials); 
};

export const register = async (credentials) => {
  return await axiosInstance.post('/register', credentials); 
};

export const logout = async () => {
  try {
    await axiosInstance.post('/logout');

    localStorage.removeItem('authToken');

    window.location.href = '/'
  } catch(error) {
    console.error('Ошибка при выходе из системы:', error);
  }
}
export const getUserId = async () => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data.id; 
  } catch (error) {
    console.error('Ошибка при получении ID пользователя:', error);
    throw error;
  }
};