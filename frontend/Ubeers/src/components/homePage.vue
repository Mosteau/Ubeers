<script lang='ts' setup>
</script>
<template>
    <div class="homepage">
        <h1>Ubeers</h1>
        <p>S'incrire</p>
        <router-link to="/login">Se connecter</router-link>
    </div>
</template>


<style scoped>
.homepage {
    text-align: center;
    padding: 20px;
}

.beer-card {
    margin: 20px;
    display: inline-block;
    width: 300px;
}

.beer-image {
    width: 100%;
    height: auto;
}
</style>
