<script lang="ts" setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Button from 'primevue/button';

const username = ref('');
const password = ref('');
const usernameError = ref('');
const passwordError = ref('');

const handleSubmit = () => {
  usernameError.value = '';
  passwordError.value = '';

  if (!username.value) {
    usernameError.value = 'Username is required';
  }
  if (!password.value) {
    passwordError.value = 'Password is required';
  }

  if (!usernameError.value && !passwordError.value) {
    console.log('Username:', username.value);
    console.log('Password:', password.value);
    // Handle form submission logic here
  }
};
</script>
<template>
  <Form @submit.prevent="handleSubmit" class="flex justify-center flex-col gap-4">
      <div class="flex flex-col gap-1">
          <InputText name="username" type="text" placeholder="Username" />
          <Message v-if="usernameError" severity="error" size="small" variant="simple">{{ usernameError }}</Message>
      </div>
      <div class="flex flex-col gap-1">
          <InputText name="email" type="text" placeholder="Email" />
          <Message v-if="passwordError" severity="error" size="small" variant="simple">{{ passwordError }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<style scoped>
/* TODO */
</style>
