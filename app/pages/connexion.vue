<script setup lang="ts">
const form = ref({
  email: '',
  password: '',
})

async function handleFormSubmit() {
  const response = await $fetch('http://127.0.0.1:8000/api/connexion', {
    method: 'POST',
    body: form.value,
  })

  if (response) {
    console.log(response)
  }

  console.log('Connexion réussie')
}
</script>

<template>
  <div>
    <h1>Connexion</h1>

    <form>
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="Email" required>
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" placeholder="Mot de passe" required>
      </div>

      <div>
        <button @click.prevent="handleFormSubmit">
          Se connecter
        </button>
      </div>
      <p>Si vous n'avez pas de compte, veuillez vous inscrire ici</p>
    </form>
  </div>
</template>

<style scoped>
.alert {
  padding: 1em;
  margin-bottom: 1em;
}
.alert-danger {
  color: #a94442;
  background-color: #f2dede;
}
</style>
