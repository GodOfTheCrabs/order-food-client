<template>
  <div v-if="open" class="modal-overlay">
    <div class="modal-box">
      <h2 class="modal-title">Відстеження харчування</h2>
      <p class="modal-description">
        Ви вже спожили <strong>2350 ккал</strong> сьогодні.<br />
        Ваша рекомендована норма: <strong>2000 ккал</strong>.<br />
        <span style="color: red;">Перевищення на 350 ккал.</span><br />
        Вам варто звернути увагу на раціон або додати більше активності 🏃‍♂️
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
  margin-bottom: 10px;
}

.modal-description {
  font-size: 16px;
  color: #444;
  margin-bottom: 20px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}

.confirm-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: #2458D3;
  color: white;
  transition: background-color 0.2s ease;
}

.confirm-button:hover {
  background: #1d45a8;
}
</style>
