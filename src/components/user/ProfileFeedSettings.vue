<template>
  <div class="nutrition-settings">
    <button class="btn btn-success" @click="showForm = !showForm">
      Налаштувати харчування
    </button>

    <div v-if="showForm" class="mt-4 p-4 border rounded shadow-sm bg-light">
      <div class="form-check form-switch mb-3">
        <input
            class="form-check-input"
            type="checkbox"
            id="trackNutrition"
            v-model="trackingEnabled"
        />
        <label class="form-check-label" for="trackNutrition">
          Відстежувати харчування
        </label>
      </div>

      <div class="mb-3">
        <label for="height" class="form-label">Зріст (см)</label>
        <input
            type="number"
            id="height"
            class="form-control"
            v-model="height"
            :disabled="!trackingEnabled"
            placeholder="Введіть зріст"
        />
      </div>

      <div class="mb-3">
        <label for="weight" class="form-label">Вага (кг)</label>
        <input
            type="number"
            id="weight"
            class="form-control"
            v-model="weight"
            :disabled="!trackingEnabled"
            placeholder="Введіть вагу"
        />
      </div>

      <div class="mb-3">
        <label for="age" class="form-label">Вік</label>
        <input
            type="number"
            id="age"
            class="form-control"
            v-model="age"
            :disabled="!trackingEnabled"
            placeholder="Введіть вік"
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
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useUserStore} from "@/store/UserStore";

const showForm = ref(false)
const trackingEnabled = ref(true)
const height = ref(null)
const weight = ref(null)
const age = ref(null)

const userStore = useUserStore();
async function fetchUserData() {
  try {
    const userData = await userStore.getUser();
    trackingEnabled.value = !!userData?.is_manage_finances;
    height.value = userData?.height || null;
    weight.value = userData?.weight || null;
    age.value =  userData?.age || null;
  } catch (error) {
    console.error('Не удалось получить данные пользователя:', error);
  }
}

onMounted(() => {
  fetchUserData();
})
</script>

<style scoped>
.nutrition-settings {
  margin-top: 40px;
}
</style>
