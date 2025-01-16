<template>
  <div class="not-found">
    <img
      src="https://img.icons8.com/?size=100&id=Vm6HTQD41MIU&format=png&color=000000"
      alt="Beer icon"
    />
    <h1>Oups, désolé mais la bière recherchée n'existe pas !</h1>
    <router-link to="/" class="home-link"
      >Retour à la page d'accueil</router-link
    >
  </div>
</template>

<script lang="ts">
export default {
  name: "NotFoundPage",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 50px auto;
}

.not-found img {
  width: 150px;
  margin-bottom: 20px;
}

.not-found h1 {
  font-size: 60px;
  color: #343a40;
  margin-bottom: 20px;
}

.not-found p {
  font-size: 20px;
  color: #6c757d;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #0056b3;
}
</style>
