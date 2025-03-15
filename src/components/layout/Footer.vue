<template>
    <div class="footer">
        <div class="logo">
            <img src="../../assets/images/logo.jpeg" alt="" class="logo-footer">
            <p class="footer-text"> © Всі права захищені</p>
        </div>
        <div class="social">
            <p class="footer-title">Food Bag у мережах</p>
            <div class="social-icon">
                <i class="fa-brands fa-facebook-f"></i>
                <i class="fa-brands fa-twitter"></i>
                <i class="fa-brands fa-instagram"></i>
            </div>
        </div>
        <div class="creator">
            <p class="footer-title">Дизайн та розробка</p>
            <p class="footer-text">Приймак Максим</p>
        </div>
        <div class="about-us">
            <p class="footer-title">Про сайт</p>
            <p class="footer-text">Контакти</p>
            <p class="footer-text">Політика конфіденційності</p>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
    .footer {
        margin-top: 200px;
        display: flex;
        justify-content: space-between;
    }
    .logo-footer {
        height: 160px;
    }
    .social-icon {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
    }
    .social-icon i {
        font-size: 32px;
        cursor: pointer;
        background-color: #2458D3;
        color: white;
        padding: 5px;
        border-radius: 15%;
        transition: opacity 0.3s;
    }
    .social-icon i:hover {
        opacity: 0.8;
    }
    .footer-text {
        color: #595F6A;
    }
    .footer-title {
        font-weight: 700;
        font-size: 18px;
    }
</style>