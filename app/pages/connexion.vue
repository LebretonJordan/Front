<script setup lang="ts">
import { useAuthStore } from '@/composables/auth'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  email: z.string(),
  password: z.string(),
})
const { login, error } = useAuthStore()
type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  email: '',
  password: '',
})

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
async function handleFormSubmit() {
  await validate()
  if (!isValid.value) {
    return
  }
  login(form.value)
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Connexion
    </h1>

    <v-alert v-if="error" type="error" variant="outlined" class="mb-4">
      <p>{{ error }}</p>
    </v-alert>

    <v-form class="mb-3 flex flex-col gap-3">
      <v-text-field v-model="form.email" :error-messages="getErrorMessage('email')" name="email" type="email" label="Email *" variant="outlined" />
      <v-text-field v-model="form.password" :error-messages="getErrorMessage('password')" name="password" type="password" label="Mot de passe *" variant="outlined" />
      <v-btn color="blue" @click.prevent="handleFormSubmit">
        Se connecter
      </v-btn>
    </v-form>

    <p class="text-body-1">
      Si vous n'avez pas de compte,
      <v-btn variant="plain" slim to="/inscription">
        inscrivez-vous ici
      </v-btn>.
    </p>
  </div>
</template>
