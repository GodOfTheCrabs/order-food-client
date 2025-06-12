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
                  <th>КБЖВ на 1 од.</th>
                  <th>КБЖВ всього</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in order.foods" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.category }}</td>
                  <td>{{ item.count }}</td>
                  <td>
                    Вугл: {{ item.nutrition.carbs }}г,<br>
                    Біл: {{ item.nutrition.proteins }}г,<br>
                    Жири: {{ item.nutrition.fats }}г,<br>
                    Кал: {{ item.nutrition.calories }} ккал
                  </td>
                  <td>
                    Вугл: {{ item.nutrition.carbs * item.count }}г,<br>
                    Біл: {{ item.nutrition.proteins * item.count }}г,<br>
                    Жири: {{ item.nutrition.fats * item.count }}г,<br>
                    Кал: {{ item.nutrition.calories * item.count }} ккал
                  </td>
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

      <div class="filter-buttons">
        <el-button style="background-color: #2458D3" type="primary" @click="isOpenModalWindow = true">Експорт</el-button>
        <el-button @click="changeType">Змінити формат експорту</el-button>
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
    <ModalWindowConfirm
        :open="isOpenModalWindow"
        title="Експорт заказів"
        description="Після підтвердження буде створено Excel-файл із поточними замовленнями згідно з фільтрами"
        action="Експортувати"
        cancel="Скасувати"
        @confirm="exportOrders()"
        @cancel="isOpenModalWindow = false"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useOrderStore} from "@/store/OrderStore";
import AnalyticsBlock from "@/components/history/AnalyticsBlock.vue";
import ModalWindowConfirm from "@/components/layout/ModalWindowConfirm.vue";

const orderStore = useOrderStore();

const orders = ref([
  {
    id: 1,
    date: '2025-06-01',
    price: 250,
    foods: [
      {
        id: 101,
        name: 'Куряче філе з овочами',
        category: 'Основна страва',
        count: 2,
        price: 125,
        nutrition: {
          carbs: 10,
          proteins: 30,
          fats: 5,
          calories: 250,
        },
      },
    ],
  },
  {
    id: 2,
    date: '2025-06-02',
    price: 180,
    foods: [
      {
        id: 102,
        name: 'Гречка з грибами',
        category: 'Гарнір',
        count: 1,
        price: 80,
        nutrition: {
          carbs: 25,
          proteins: 7,
          fats: 3,
          calories: 180,
        },
      },
      {
        id: 103,
        name: 'Овочевий салат',
        category: 'Салат',
        count: 1,
        price: 100,
        nutrition: {
          carbs: 12,
          proteins: 2,
          fats: 5,
          calories: 120,
        },
      },
    ],
  },
  {
    id: 3,
    date: '2025-06-03',
    price: 300,
    foods: [
      {
        id: 104,
        name: 'Свинячий стейк',
        category: 'Основна страва',
        count: 2,
        price: 150,
        nutrition: {
          carbs: 2,
          proteins: 35,
          fats: 20,
          calories: 350,
        },
      },
    ],
  },
  {
    id: 4,
    date: '2025-06-04',
    price: 220,
    foods: [
      {
        id: 105,
        name: 'Паста з томатним соусом',
        category: 'Гарнір',
        count: 2,
        price: 110,
        nutrition: {
          carbs: 40,
          proteins: 10,
          fats: 8,
          calories: 320,
        },
      },
    ],
  },
  {
    id: 5,
    date: '2025-06-05',
    price: 270,
    foods: [
      {
        id: 106,
        name: 'Суп-пюре з броколі',
        category: 'Перша страва',
        count: 1,
        price: 90,
        nutrition: {
          carbs: 15,
          proteins: 5,
          fats: 4,
          calories: 120,
        },
      },
      {
        id: 107,
        name: 'Котлета з індички',
        category: 'Основна страва',
        count: 2,
        price: 90,
        nutrition: {
          carbs: 3,
          proteins: 28,
          fats: 6,
          calories: 220,
        },
      },
    ],
  },
  {
    id: 6,
    date: '2025-06-06',
    price: 210,
    foods: [
      {
        id: 108,
        name: 'Рис з овочами',
        category: 'Гарнір',
        count: 2,
        price: 105,
        nutrition: {
          carbs: 35,
          proteins: 6,
          fats: 3,
          calories: 200,
        },
      },
    ],
  },
  {
    id: 7,
    date: '2025-06-07',
    price: 195,
    foods: [
      {
        id: 109,
        name: 'Печена картопля',
        category: 'Гарнір',
        count: 1,
        price: 65,
        nutrition: {
          carbs: 30,
          proteins: 4,
          fats: 6,
          calories: 180,
        },
      },
      {
        id: 110,
        name: 'Курячі нагетси',
        category: 'Основна страва',
        count: 1,
        price: 130,
        nutrition: {
          carbs: 10,
          proteins: 20,
          fats: 15,
          calories: 260,
        },
      },
    ],
  },
  {
    id: 8,
    date: '2025-06-08',
    price: 160,
    foods: [
      {
        id: 111,
        name: 'Овочевий крем-суп',
        category: 'Перша страва',
        count: 2,
        price: 80,
        nutrition: {
          carbs: 20,
          proteins: 4,
          fats: 5,
          calories: 150,
        },
      },
    ],
  },
  {
    id: 9,
    date: '2025-06-09',
    price: 240,
    foods: [
      {
        id: 112,
        name: 'Яловичина в соусі',
        category: 'Основна страва',
        count: 2,
        price: 120,
        nutrition: {
          carbs: 5,
          proteins: 32,
          fats: 18,
          calories: 340,
        },
      },
    ],
  },
  {
    id: 10,
    date: '2025-06-10',
    price: 200,
    foods: [
      {
        id: 113,
        name: 'Рататуй',
        category: 'Овочева страва',
        count: 2,
        price: 100,
        nutrition: {
          carbs: 15,
          proteins: 4,
          fats: 6,
          calories: 160,
        },
      },
    ],
  },
])


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

// EXPORT
const isOpenModalWindow = ref(false);

const reportType = ref("detailed")
async function exportOrders() {
  const params = {
    report_type: reportType.value
  }

  await orderStore.exportOrders(params);

  isOpenModalWindow.value = false;
}

function changeType() {
  reportType.value = "summary";
}

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
