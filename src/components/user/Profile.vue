<template>
    <div class="container">
      <div class="row">
        <!-- Левая часть с картинкой -->
        <div class="col-md-4">
          <div class="profile-img text-center">
            <img
              v-if="user?.photo"
              :src="`http://127.0.0.1:8000${user.photo}`"
              class="img-profile"
            />
            <img src="../../assets/images/profile_photo.png" v-else class="img-profile">
          </div>
          <button type="button" @click="goToProfileEdit" class="btn btn-primary" style="margin-top: 35px;">
            <i class="fas fa-user-edit"></i> Редактировать профиль
          </button>
        </div>
  
        <!-- Правая часть с информацией о пользователе -->
        <div class="col-md-8">
          <div class="profile-head">
            <h4>Профіль користувача</h4>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Timeline</a>
              </li>
            </ul>
          </div>
  
          <div class="tab-content profile-tab" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Им'я</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user?.first_name || 'Нема даних' }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Призвіще</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user?.last_name || 'Нема даних' }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Стать</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user?.gender || 'Нема даних'}}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Електрона адреса</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user?.email }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Телефон</label>
                </div>
                <div class="col-md-6">
                  <p>{{ user?.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js'
import { onMounted, ref } from 'vue';

export default {
  name: 'Profile',
  setup() {
    const user = ref(null);
    const userStore = useUserStore()
    const router = useRouter()

    const fetchUserData = async () => {
      try {
        const userData = await userStore.getUser();
        user.value = userData;
        console.log(user.value)
      } catch (error) {
        console.error('Не удалось получить данные пользователя:', error);
      }
    };

    const goToProfileEdit = () => {
      router.push('/profile/edit')
    }

    onMounted(() => {
      fetchUserData();
    });

    return {
      user,
      goToProfileEdit
    }
  }
}
</script>
  
<style scoped>
  .container {
    margin-top: 150px;
    min-height: 100vh;
  }
  
  .img-profile {
    width: 250px;
    border-radius: 50%;
  }

  .profile-tab {
    margin-top: 25px;
  }
  
  .profile-head h4 {
    font-weight: bold;
  }
  
  .nav-tabs {
    border-bottom: 2px solid #ddd;
    margin-top: 25px;
  }
  
  .nav-tabs .nav-link {
    padding: 10px 20px;
  }
  
  .nav-tabs .nav-link.active {
    background-color: #007bff;
    color: white;
  }

  
</style>
  