import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import router from './router'; 

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);

app.config.globalProperties.$axios = axios;

app.use(pinia);
app.use(router); 
app.mount('#app');
