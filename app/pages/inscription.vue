<script setup lang="ts">
const form = ref({
  name: '',
  lastname: '',
  society: '',
  email: '',
  phone_number: '',
  password: '',
  adress: '',
})

const success = ref('')
const error = ref('')

async function handleFormSubmit() {
  success.value = ''
  error.value = ''

  if (!form.value.name || !form.value.lastname || !form.value.email || !form.value.password) {
    return error.value = 'Veuillez remplir tous les champs obligatoires.'
  }

  await $fetch('http://127.0.0.1:8000/api/inscription', {
    method: 'POST',
    body: form.value,
    headers: {
      Accept: 'application/json',
    },
  })
}
</script>

<template>
  <div>
    <h1>Créer votre compte</h1>
    <p>Vous avez déjà un compte ? Connectez-vous !</p>

    <div v-if="success">
      {{ success }}
    </div>
    <div v-if="error">
      {{ error }}
    </div>

    <form>
      <div>
        <label for="name">Prénom</label>
        <input id="name" v-model="form.name" type="text" placeholder="Prénom">
      </div>

      <div>
        <label for="lastname">Nom</label>
        <input id="lastname" v-model="form.lastname" type="text" placeholder="Nom">
      </div>

      <div>
        <label for="society">Société (facultatif)</label>
        <input id="society" v-model="form.society" type="text" placeholder="Société">
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="Email">
      </div>

      <div>
        <label for="phone_number">Téléphone</label>
        <input id="phone_number" v-model="form.phone_number" type="tel" placeholder="Téléphone">
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input id="password" v-model="form.password" type="password" placeholder="Mot de passe">
      </div>

      <div>
        <label for="adress">Adresse Principale</label>
        <input id="adress" v-model="form.adress" type="text" placeholder="Adresse Principale">
      </div>

      <div>
        <button @click.prevent="handleFormSubmit">
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
.alert {
  padding: 1em;
  margin-bottom: 1em;
}
.alert-success {
  color: #3c763d;
  background-color: #dff0d8;
}
.alert-danger {
  color: #a94442;
  background-color: #f2dede;
}
</style>
