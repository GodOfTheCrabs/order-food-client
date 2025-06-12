<template>
  <div v-if="open" class="modal-overlay">
    <div class="modal-box">
      <h2 class="modal-title">Ліміт на місяць</h2>
      <p class="modal-description" style="color: red">Вы вже перевищели ліміт на 7 635 грн за місяць, вам порада краще трохи з економити</p>
      <div class="modal-buttons">
        <button class="confirm-button" @click="$emit('confirm')">
          Пітвердити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

/* eslint-disable no-undef */
defineProps({
  open: Boolean,
});
defineEmits(['confirm', 'cancel']);
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
}

.modal-buttons {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button,
.confirm-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.cancel-button {
  background: #e5e7eb;
  color: #111827;
}

.cancel-button:hover {
  background: #d1d5db;
}

.confirm-button {
  background: #2458D3;
  color: white;
}

.confirm-button:hover {
  background: #1d45a8;
}
</style>
