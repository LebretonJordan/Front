<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  email: z.string(),
  password: z.string(),
})

const backendError = ref()

type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  email: '',
  password: '',
})

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
// const { setSnackbarText } = useSnackbarStore()
const router = useRouter()

async function handleFormSubmit() {
  await validate()
  if (!isValid.value) {
    return
  }

  try {
    const response = await $fetch<{ token?: string, error?: string }>('http://127.0.0.1:8000/api/connexion', {
      method: 'POST',
      body: form.value,
      headers: {
        Accept: 'application/json',
      },
    })

    console.log(response)

    if (response.token) {
      localStorage.setItem('auth_token', response.token)

      router.push({ name: 'accueil' })
    }
    else {
      backendError.value = response.error || 'Une erreur est survenue lors de la connexion'
    }
  }
  catch {
    backendError.value = 'Erreur lors de la connexion au serveur. Veuillez réessayer.'
  }
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Connexion
    </h1>

    <v-alert v-if="backendError" type="error" variant="outlined" class="mb-4">
      <p>{{ backendError }}</p>
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
