<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <InputText />
    </div>
  </header>

  <main>
    <TheWelcome />
    <Button label="Click Me" />
  </main>
</template>