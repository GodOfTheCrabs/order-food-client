<template>
  <div class="analytics-container" style="margin-top: 35px; ">

    <h2 class="title">Аналітичний Блок</h2>

    <div class="analytics-grid">
      <div v-for="(item, index) in categories" :key="index" class="analytics-card">
        <div class="analytics-category-name">{{ item.category }}</div>
        <div class="analytics-category-amount">{{ formatCurrency(item.sum) }}</div>

        <div class="analytics-circle-progress-wrapper">
          <svg viewBox="0 0 36 36" class="analytics-circular-chart">
            <path
                class="analytics-circle-bg"
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
                class="analytics-circle"
                :stroke="mainColor"
                :stroke-dasharray="item.percent + ', 100'"
                d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" class="analytics-percentage-text">{{ item.percent }}%</text>
          </svg>
        </div>
      </div>
    </div>

    <div class="analytics-card">
      <h2>Середній чек</h2>
      <div class="analytics-stats-row">
        <div class="analytics-stat-block">
          <div class="analytics-stat-value">{{ formatCurrency(stats.total) }}</div>
          <div class="analytics-stat-label">Всього витрачено</div>
        </div>
        <div class="analytics-stat-block">
          <div class="analytics-stat-value">{{ formatCurrency(stats.average) }}</div>
          <div class="analytics-stat-label">Середній чек</div>
        </div>
        <div class="analytics-stat-block">
          <div class="analytics-stat-value">{{ formatCurrency(stats.min) }}</div>
          <div class="analytics-stat-label">Мінімальний</div>
        </div>
        <div class="analytics-stat-block">
          <div class="analytics-stat-value">{{ formatCurrency(stats.max) }}</div>
          <div class="analytics-stat-label">Максимальний</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const mainColor = '#2458D3'

/* eslint-disable no-undef */
const props = defineProps({
  analytics: {
    type: Object,
    default: null
  },
});

const categories = props.analytics?.categories;

const stats = {
  total: props.analytics?.total_spent,
  average: props.analytics?.average,
  min: props.analytics?.min,
  max: props.analytics?.max,
}

function formatCurrency(value) {
  if (typeof value !== 'number') return '–';

  return value.toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  });
}

</script>

<style scoped>
  @import url('../../styles/AnalyticsBlock.css');
</style>
