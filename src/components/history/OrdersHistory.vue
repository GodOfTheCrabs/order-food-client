<template>
  <div class="history-container">
    <OrdersHistoryTable/>
  </div>
</template>

<script setup>

import OrdersHistoryTable from "@/components/history/OrdersHistoryTable.vue";
</script>

<style scoped>
  .history-container {
    margin-top: 150px;
    min-height: 100vh;
  }
</style>