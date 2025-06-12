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
            <i class="fas fa-user-edit"></i> Редагувати профіль
          </button>
        </div>
  
        <!-- Правая часть с информацией о пользователе -->
        <div class="col-md-8">
          <div class="profile-head">
            <h4>Профіль користувача</h4>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" href="#home">Інформація користувача</a>
              </li>
              <li class="nav-item">
                <button @click="goToOrdersHistory" class="nav-link">
                  Історія заказів
                </button>
              </li>
            </ul>
          </div>

          <div class="tab-content profile-tab" id="myTabContent">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Ім'я</label>
                </div>
                <div class="col-md-6">
                  <input v-model="firstName" name="first_name" class="form-control border border-secondary mt-3" placeholder="Ваше Ім'я" type="text" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Призвіще</label>
                </div>
                <div class="col-md-6">
                  <input v-model="lastName" name="last_name" class="form-control border border-secondary mt-3" placeholder="Ваше Призвіще" type="text" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Стать</label>
                </div>
                <div class="col-md-6">
                  <select v-model="gender" name="gender" class="form-control border border-secondary mt-3" disabled>
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
                  <input v-model="email" name="email" class="form-control border border-secondary mt-3" placeholder="Ваше Ім'я" type="text" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 title-profile">
                  <label>Телефон</label>
                </div>
                <div class="col-md-6">
                  <input
                      readonly
                      v-model="phone"
                      name="phone"
                      class="form-control border border-secondary mt-3"
                      placeholder="+380 98-668-49-67"
                      type="tel"
                      pattern="^\+380\s\d{2}-\d{3}-\d{2}-\d{2}$"
                  >
                </div>
              </div>
              <div class="row">
                <ProfileFinanceSettings/>
                <ProfileFeedSettings/>
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
import { onMounted, ref, computed } from 'vue';
import ProfileFinanceSettings from "@/components/user/ProfileFinanceSettings.vue";
import ProfileFeedSettings from "@/components/user/ProfileFeedSettings.vue";

export default {
  name: 'Profile',
  components: {ProfileFeedSettings, ProfileFinanceSettings},
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

    const goToOrdersHistory = () => {
      router.push('/profile/history')
    }

    onMounted(() => {
      fetchUserData();
    });

    const firstName = computed(() => user.value?.first_name || 'Нема даних')
    const lastName = computed(() => user.value?.last_name || 'Нема даних')
    const gender = computed(() => user.value?.gender || 'Нема даних')
    const email = computed(() => user.value?.email || 'Нема даних')
    const phone = computed(() => user.value?.phone || 'Нема даних')

    return {
      user,
      firstName,
      lastName,
      gender,
      email,
      phone,
      goToOrdersHistory,
      goToProfileEdit,
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
  