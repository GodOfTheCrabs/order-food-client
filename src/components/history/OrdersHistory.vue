<template>
  <div class="history-container">
    <div class="text-end mt-4">
      <button
          type="submit"
          class="btn btn-primary"
          @click="changeView"
      >
        Змінити вигляд
      </button>
    </div>
    <OrdersHistoryTable v-if="view === 'price'"/>
    <OrdersHistoryTableFeed v-if="view === 'feed'"/>
  </div>
</template>

<script setup>
import OrdersHistoryTable from "@/components/history/OrdersHistoryTable.vue";
import OrdersHistoryTableFeed from "@/components/history/OrdersHistoryTableFeed.vue";
import {ref} from 'vue';

const view = ref('price');

function changeView() {
  if(view.value === 'price') {
    view.value = 'feed';
  } else {
    view.value = 'price';
  }
}

</script>

<style scoped>
  .history-container {
    margin-top: 150px;
    min-height: 100vh;
  }
</style>