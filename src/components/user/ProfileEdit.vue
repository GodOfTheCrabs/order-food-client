<template>
    <div class="container">
        <div class="row">
        <!-- Левая часть с картинкой -->
        <form class="form-edit" @submit.prevent="handleUpdate">
            <div class="col-md-6s">
                <div class="profile-img text-center">
                    <img
                        v-if="photo || previewPhoto"
                        :src="previewPhoto || `http://127.0.0.1:8000${photo}`"
                        class="img-profile"
                        alt="Profile"
                    />
                    <img src="../../assets/images/profile_photo.png" v-else class="img-profile">
                </div>
                <div class="mt-3">
                    <label for="file-upload" class="btn btn-outline-primary btn-sm">
                        Редагувати Фото
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        name="photo"
                        class="d-none"
                        @change="handleFileUpload"
                        accept="image/*"
                    />
                </div>
            </div>
            <div class="col-md-6">
                <div class="profile-head">
                    <h4>Редагування профілю</h4>
                </div>

            <div class="tab-content profile-tab" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div class="row">
                    <div class="col-md-6 title-profile">
                        <label>Ім'я</label>
                    </div>
                    <div class="col-md-6">
                        <input v-model="firstName" name="first_name" class="form-control border border-secondary" placeholder="Ваше Ім'я" type="text">
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6 title-profile">
                        <label>Призвіще</label>
                    </div>
                    <div class="col-md-6">
                        <input v-model="lastName" name="last_name" class="form-control border border-secondary" placeholder="Ваше Призвіще" type="text">
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6 title-profile">
                        <label>Стать</label>
                    </div>
                    <div class="col-md-6">
                        <select v-model="gender" name="gender" class="form-control border border-secondary">
                            <option value="" disabled selected>Вибір статі</option>
                            <option value="male">Чоловік</option>
                            <option value="female">Жінка</option>
                        </select>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6 title-profile">
                        <label>Електрона адреса</label>
                    </div>
                    <div class="col-md-6">
                        <input v-model="email" name="email" class="form-control border border-secondary" placeholder="Ваше Ім'я" type="text">
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-md-6 title-profile">
                        <label>Телефон</label>
                    </div>
                    <div class="col-md-6">
                        <input 
                            v-model="phone"
                            name="phone" 
                            class="form-control border border-secondary" 
                            placeholder="+380 98-668-49-67" 
                            type="tel"
                            pattern="^\+380\s\d{2}-\d{3}-\d{2}-\d{2}$"
                        >
                    </div>
                    </div>
                    <div class="text-end mt-4">
                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Сохранить изменения
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </form>
       

        <!-- Правая часть с информацией о пользователе -->
        
    </div>
</div>
</template>
<script>
/* eslint-disable */
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/UserStore.js';

export default {
  name: 'Profile',
  setup() {
    const router = useRouter();
    const userStore = useUserStore()
    const photo = ref(null);
    const email = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const phone = ref('');
    const gender = ref('');
    const errorMessage = ref('');
    const previewPhoto = ref(null);

    const fetchUserData = async () => {
      try {
        const userData = await userStore.getUser();
        photo.value = userData.photo;
        email.value = userData.email;
        firstName.value = userData.first_name;
        lastName.value = userData.last_name;
        phone.value = userData.phone;
        gender.value = userData.gender;
      } catch (error) {
        console.error('Не удалось получить данные пользователя:', error);
      }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];  
        if (file) {
            photo.value = file;
            
            previewPhoto.value = URL.createObjectURL(file); 
        }
        console.log(file)
    };
    
    const handleUpdate = async () => {
    try {

        // Отправка других данных
        const data = {
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            phone: phone.value,
            gender: gender.value,
            photo: photo.value
        };
        console.log(data);
        await userStore.updateUserProfile(data);

        router.push('/profile');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Ошибка при обновлении профиля. Пожалуйста, попробуйте позже.';
        console.error('Ошибка при обновлении профиля:', error);
    }
};

    onMounted(() => {
      fetchUserData();
    });

    return {
      email,
      firstName,
      lastName,
      phone,
      gender,
      photo,
      handleFileUpload,
      handleUpdate,
      previewPhoto,
    };
  },
};
</script>
<style scoped>
  .container {
    margin-top: 150px;
    min-height: 100vh;
  }
  
  .img-profile {
    height: 300px;
  }

  .profile-tab {
    margin-top: 25px;
  }
  
  .profile-head h4 {
    font-weight: bold;
  }
  
  .form-edit {
    display: flex;
    justify-content: space-between;
  }
  .row {
    margin-bottom: 15px;
  }
</style>