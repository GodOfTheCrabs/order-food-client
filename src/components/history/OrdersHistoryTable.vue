<template>
  <div>
    <div class="table-container">
      <h2 class="title">Список Заказів</h2>
      <div class="container">
        <h5 class="title">Фільтр</h5>
        <div class="filters-row">
          <div class="filter-block">
            <span class="label">Місяць</span>
            <el-date-picker
                v-model="month"
                type="month"
                value-format="YYYY-MM"
                placeholder="Виберіть Місяць"
            />
          </div>
          <div class="filter-block">
            <span class="label">Дата</span>
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="По"
                value-format="YYYY-MM-DD"
                start-placeholder="Початок Дати"
                end-placeholder="Кінець Дати"
            />
          </div>
        </div>

        <div class="filter-buttons">
          <el-button style="background-color: #2458D3" type="primary" @click="applyFilters">Застосувати</el-button>
          <el-button @click="resetFilters">Скинути</el-button>
        </div>
      </div>
      <table class="custom-table">
        <thead>
        <tr>
          <th>Заказ</th>
          <th>Дата</th>
          <th>Ціна</th>
          <th>Подивитися Деталі</th>
        </tr>
        </thead>
        <tbody>
        <!-- eslint-disable-next-line vue/no-v-for-template-key -->
        <template v-for="order in orders" :key="order.id">
          <tr>
            <td>Заказ #{{ order.id }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.price }} ₴</td>
            <td class="view-detail">
              <button @click="toggleDetails(order.id)" class="btn btn-success btn-primary">
                <i class="fa fa-magnifying-glass"></i>
              </button>
            </td>
          </tr>
          <tr v-if="expandedOrderIds.includes(order.id)" class="order-details-row">
            <td colspan="4">
              <table class="inner-table">
                <thead>
                <tr>
                  <th>Блюдо</th>
                  <th>Категорія</th>
                  <th>Кількість</th>
                  <th>Ціна за од.</th>
                  <th>Разом</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in order.foods" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.count }}</td>
                  <td>{{ item.price }} ₴</td>
                  <td>{{ item.price * item.count }} ₴</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="per-page-select">
        <label for="perPage">Показувати по:</label>
        <select id="perPage" v-model="perPage" @change="changePerPage">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>


    <div class="pagination">
      <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
      >
        <i class="fa-solid fa-angle-left"></i>
      </button>

      <button
          v-for="page in visiblePages"
          :key="page.key"
          class="pagination-btn"
          :disabled="page.disabled"
          :class="{ active: page.number === currentPage, dots: page.dots }"
          @click="!page.dots && changePage(page.number)"
      >
        {{ page.label }}
      </button>

      <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
      >
        <i class="fa-solid fa-angle-right"></i>
      </button>
    </div>
    <AnalyticsBlock
        :analytics="orderStore.analytics"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useOrderStore} from "@/store/OrderStore";
import AnalyticsBlock from "@/components/history/AnalyticsBlock.vue";

const orderStore = useOrderStore();

const orders = computed(() => {
  return orderStore.orders
})

// PAGINATION
const perPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => orderStore.meta.last_page || 1);

const changePage = (page) => {
  currentPage.value = page;
  const params = {
    page: page,
    per_page: perPage.value,
  }

  orderStore.getOrdersForHistory(params);
}

const changePerPage = () => {
  currentPage.value = 1;
  changePage(1);
};

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push({ number: i, label: i, key: i });
    }
  } else {
    pages.push({ number: 1, label: 1, key: 1 });

    if (current > 3) {
      pages.push({ label: '...', key: 'dots-left', dots: true, disabled: true });
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push({ number: i, label: i, key: i });
    }

    if (current < total - 2) {
      pages.push({ label: '...', key: 'dots-right', dots: true, disabled: true });
    }

    pages.push({ number: total, label: total, key: total });
  }

  return pages;
});

// DATE FILTERS
const month = ref('2025-05');
const dateRange = ref(null);

const applyFilters = async () => {
  const params = {};

  if (month.value) {
    params.created_at = month.value;
  }

  if (dateRange.value && dateRange.value.length === 2) {
    const [from, to] = dateRange.value;
    params.created_at_from = from;
    params.created_at_to = to;
  }

  await orderStore.getOrdersForHistory(params);
  await orderStore.getOrdersAnalytics(params);
}

const resetFilters = async () => {
  month.value = null;
  dateRange.value = null;
  await orderStore.getOrdersForHistory();
  await orderStore.getOrdersAnalytics();
};

watch(month, (newVal) => {
  if (newVal) {
    dateRange.value = null
  }
})

watch(dateRange, (newVal) => {
  if (newVal) {
    month.value = null
  }
})



// ORDERS DETAIL
const expandedOrderIds = ref([])

const toggleDetails = (orderId) => {
  if (expandedOrderIds.value.includes(orderId)) {
    expandedOrderIds.value = expandedOrderIds.value.filter(id => id !== orderId)
  } else {
    expandedOrderIds.value.push(orderId)
  }
}

onMounted(async () => {
  const params= {
    created_at: month.value,
  }
  await orderStore.getOrdersForHistory(params);
  await orderStore.getOrdersAnalytics(params);
});
</script>

<style scoped>
@import url('../../styles/OrdersHistoryTable.css');
</style>
