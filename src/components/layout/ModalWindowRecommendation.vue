<template>
  <div v-if="open" class="modal-overlay">
    <div class="modal-box">
      <h2 class="modal-title">Рекомендація на сьогодні</h2>
      <p class="modal-description">
        🥦 Сьогодні ви спожили мало клітковини. Рекомендуємо додати більше овочів (броколі, морква, салат) або злакових.
      </p>
      <div class="modal-buttons">
        <button class="confirm-button" @click="$emit('confirm')">Зрозуміло</button>
      </div>
    </div>
  </div>
</template>

<script setup>

/* eslint-disable no-undef */
defineProps({
  open: Boolean,
});
defineEmits(['confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.modal-description {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.confirm-button {
  background: #2458D3;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.confirm-button:hover {
  background: #1d45a8;
}
</style>
