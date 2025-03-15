<template>
  <div class="overlay"> 
    <section class="pb-5 mt-0 align-items-center d-flex form-login">
        <div class="container-fluid">
          <div class="row  justify-content-center align-items-center d-flex-row text-center h-100">
            <div class="col-12 col-md-4 h-50 ">
              <div class="card shadow">
                <div class="card-body mx-auto">
                  <h3 class="card-title mt-3 text-center">Увійти</h3>
                  <form @submit.prevent="isLoginForm ? handleLogin() : handleRegister()">
                    <slot name="close"></slot>

                    <div class="form-group">
                      <button @click.prevent="handleGoogleLogin" type="button" class="btn btn-outline-danger btn-block">
                        <i class="fab fa-google"></i> Увійти з Google
                      </button>
                    </div>

                    <div class="form-group input-group" v-if="!isLoginForm">
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                        </div>
                        <input name="first_name" v-model="firstName" class="form-control border border-secondary" placeholder="Ваще им'я" type="text">
                    </div>

                    <div class="form-group input-group" v-if="!isLoginForm">
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-phone"></i> </span>
                        </div>
                        <input 
                            v-model="phone"
                            name="phone" 
                            class="form-control border border-secondary" 
                            placeholder="+380 98-668-49-67" 
                            type="tel"
                            pattern="^\+380\s\d{2}-\d{3}-\d{2}-\d{2}$"
                        >
                    </div>

                    <div class="form-group input-group" >
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
                        </div>
                        <input v-model="email" name="email" class="form-control border border-secondary" placeholder="Email address" type="text">
                    </div>

                    <div class="form-group input-group" v-if="!isLoginForm">
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-genderless"></i> </span>
                        </div>
                        <select v-model="gender" name="gender" class="form-control border border-secondary">
                            <option value="" disabled selected>Вибір статі</option>
                            <option value="male">Чоловік</option>
                            <option value="female">Жінка</option>
                        </select>
                    </div>

                    <div class="form-group input-group">
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                        </div>
                        <input v-model="password" name="password" class="form-control border border-secondary" placeholder="Password" :type="isPasswordVisible ? 'text' : 'password'">
                    </div>

                    <div class="form-group input-group" v-if="!isLoginForm">
                        <div class="input-group-prepend border border-secondary">
                            <span class="input-group-text"> <i class="fa fa-key"></i> </span>
                        </div>
                        <input name="password_confirmation" v-model="passwordConfirmation" class="form-control border border-secondary" placeholder="Repeat your password" :type="isPasswordVisible ? 'text' : 'password'">
                    </div>

                    <div class="form-group input-group">
                      <label for="toggle-password" class="form-check-label">
                        <i :class="isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                      </label>
                      <input 
                        type="checkbox" 
                        class="form-check-input" 
                        v-model="isPasswordVisible"
                        id="toggle-password" 
                        style="cursor: pointer; border: 1px solid black; margin-left: 10px;" 
                      />
                    </div>

                    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

                    <div class="form-group">
                      <button type="submit" class="btn btn-primary btn-block"> {{ isLoginForm ? 'Увійти' : 'Зареєструватися' }} </button>
                    </div>
                  </form>
                    <p class="text-center">  {{ isLoginForm ? 'Немає облікового запису?' : 'Акаунт є?' }}
                      <button @click="isLoginForm = !isLoginForm" class="btn-register">
                        {{ isLoginForm ? 'Реєстрація' : 'Увійти' }}
                      </button>
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
     </section>
  </div>
</template>

<script>
/* eslint-disable */

import { login, register } from '../../../api/auth.js'
import { initGoogleAuth, googleSignIn } from '../../../api/google-auth.js'
import { ref, onMounted, nextTick, defineEmits } from 'vue';

export default {
  name: 'Login',
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');
    const passwordConfirmation = ref('');
    const firstName = ref('');
    const phone = ref('');
    const gender = ref('');
    const errorMessage = ref('');
    const isLoginForm = ref(true);
    const isPasswordVisible = ref(false);

    const clientId = "515637859526-d7fnov8pc67sr02bcf6p0es2720lldkc.apps.googleusercontent.com"; 

    const initializeGoogleAuth = async () => {
      try {
        await initGoogleAuth(clientId);
        console.log("Google Auth успешно инициализирован.");
      } catch (error) {
        console.error("Ошибка инициализации Google Auth:", error);
      }
    };

    const handleLogin = async () => {
      try {
        const response = await login({ email: email.value, password: password.value });
        console.log('Response:', response); 

        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token); 
          nextTick(() => {
            emit('loginSuccess'); 
          });
          window.location.reload()
        } else {
          errorMessage.value = 'Неверный логин или пароль';
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Ошибка при авторизации';
      }
    }

    const handleRegister = async () => {
      try {
        const response = await register({
          email: email.value,
          password: password.value,
          password_confirmation: passwordConfirmation.value,
          first_name: firstName.value,
          phone: phone.value,
          gender: gender.value
        });
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          nextTick(() => {
            emit('loginSuccess');
          });
          window.location.reload()
        } else {
          errorMessage.value = 'Не удалось зарегистрироваться';
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Ошибка регистрации';
      }
    };

    const handleGoogleLogin = async () => {
      try {
        const idToken = await googleSignIn(); 
        console.log('Google token received:', idToken);
        const response = await axios.post('/auth/google', { id_token: idToken });
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          nextTick(() => {
            emit('loginSuccess');
          });
        } else {
          errorMessage.value = 'Не удалось войти через Google';
        }
      } catch (error) {
        errorMessage.value = 'Не удалось увійти через Google';
      }
    };

    onMounted(() => {
      initializeGoogleAuth();
    });

    return {
      isLoginForm,
      email,
      password,
      errorMessage,
      handleLogin,
      handleRegister,
      passwordConfirmation,
      phone,
      firstName,
      gender,
      isPasswordVisible,
      handleGoogleLogin
    }
  }
}
</script>



<style>
    .form-group {
        margin: 30px 0;
    }
    .form-control {
      width: 100px;
    }
    .form-login {
      position: relative;
      padding-top: 10rem;
    }
    .input-group-text {
        padding: 0.8rem, 0.75rem !important;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999;
      margin: auto;
    }
    .close-button {
      position: absolute;
      font-size: 18px;
      right: 30px;
      top: 15px;
      cursor: pointer;
      transition: 0.2s;
    }
    .close-button:hover {
      color: red;
    }
    .btn-register {
      border: none;
      text-decoration: none;
      color: #0A58CA;
    }
    .card-body {
      width: 450px;
    }
</style>