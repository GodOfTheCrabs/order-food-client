<template>
    <div class="not-found">
        <h1>404 - Page not found</h1>
        <p>Извините, страница, которую вы ищете, не существует.</p>
    </div>
</template>
  
<script>
    export default {
        name: 'NotFound'
    };
</script>

<style scoped>
    .not-found {
        text-align: center;
        margin-top: 200px;
        min-height: 100vh;
    }
    .not-found h1 {
        font-size: 36px;
        font-weight: bold;
    }
    .not-found p {
        font-size: 18px;
        color: #777;
    }
</style>