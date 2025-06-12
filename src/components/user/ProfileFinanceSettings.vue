<template>
  <div class="finance-settings">
    <button class="btn btn-primary" @click="showForm = !showForm">
      Налаштувати фінанси
    </button>


    <div v-if="showForm" class="mt-4 p-4 border rounded shadow-sm bg-light">
      <form @submit.prevent="handleUpdate">
        <div class="form-check form-switch mb-3">
          <input
              class="form-check-input"
              type="checkbox"
              id="trackFinances"
              v-model="trackingEnabled"
          />
          <label class="form-check-label" for="trackFinances">
            Відстежувати фінанси
          </label>
        </div>

        <div class="mb-3">
          <label for="dailyLimit" class="form-label">Денний ліміт (грн)</label>
          <input
              type="number"
              id="dailyLimit"
              class="form-control"
              v-model="dailyLimit"
              :disabled="!trackingEnabled"
              placeholder="Введіть денний ліміт"
          />
        </div>

        <div class="mb-3">
          <label for="monthlyLimit" class="form-label">Місячний ліміт (грн)</label>
          <input
              type="number"
              id="monthlyLimit"
              class="form-control"
              v-model="monthlyLimit"
              :disabled="!trackingEnabled"
              placeholder="Введіть місячний ліміт"
          />
        </div>

        <div class="text-end mt-4">
          <button
              type="submit"
              class="btn btn-primary"
          >
            Зберегти зміни
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useUserStore} from "@/store/UserStore";

const userStore = useUserStore();

const showForm = ref(false)
const trackingEnabled = ref(null);
const dailyLimit = ref(null)
const monthlyLimit = ref(null)

async function fetchUserData() {
  try {
    const userData = await userStore.getUser();
    trackingEnabled.value = !!userData?.is_manage_finances;
    dailyLimit.value = userData?.daily_limit || null;
    monthlyLimit.value = userData?.monthly_limit || null;
  } catch (error) {
    console.error('Не удалось получить данные пользователя:', error);
  }
}
async function handleUpdate() {
  try {
    const data = {
      is_manage_finances: trackingEnabled.value,
      daily_limit: dailyLimit.value,
      monthly_limit: monthlyLimit.value,
    };

    await userStore.updateUserProfile(data);
  } catch (error) {
    console.error('Помилка при оновленні профілю:', error);
  }
}

onMounted(() => {
  fetchUserData();
})

</script>

<style scoped>
.finance-settings {
  margin-top: 40px;
}
</style>