<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Le champs prénom est obligatoire'),
  lastname: z.string().min(1, 'Le champs nom est obligatoire'),
  society: z.optional(z.string()),
  email: z.string().min(1, 'Le champs email est obligatoire').email('Veuillez saisir un email valide'),
  phone_number: z.string().min(1, 'Le champs téléphone est obligatoire'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  adress: z.string().min(1, 'Le champs adresse est obligatoire'),
})
const backendError = ref()

type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  name: '',
  lastname: '',
  society: '',
  email: '',
  phone_number: '',
  password: '',
  adress: '',
})

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
const { setSnackbarText } = useSnackbarStore()
const router = useRouter()

async function handleFormSubmit() {
  await validate()
  if (!isValid.value) {
    return
  }
  const response = await $fetch<{ status?: string, code: number, error?: string }>('http://127.0.0.1:8000/api/inscription', {
    method: 'POST',
    body: form.value,
    headers: {
      Accept: 'application/json',
    },
  })
  if (response.error) {
    backendError.value = response.error
  }
  else if (response.status === 'OK') {
    setSnackbarText('Votre compte a bien été créé', 'green')
    router.push({ name: 'connexion' })
  }
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Créer votre compte
    </h1>
    <v-alert v-if="backendError" type="error" variant="outlined" class="mb-4">
      <p>Erreur serveur : {{ backendError }}</p>
    </v-alert>
    <v-form class="mb-3 flex flex-col gap-3">
      <v-text-field v-model="form.name" :error-messages="getErrorMessage('name')" name="name" label="Prénom *" variant="outlined" />
      <v-text-field v-model="form.lastname" :error-messages="getErrorMessage('lastname')" name="lastname" label="Nom *" variant="outlined" />
      <v-text-field v-model="form.society" :error-messages="getErrorMessage('society')" name="society" label="Société" variant="outlined" />
      <v-text-field v-model="form.email" :error-messages="getErrorMessage('email')" name="email" type="email" label="Email *" variant="outlined" />
      <v-text-field v-model="form.phone_number" :error-messages="getErrorMessage('phone_number')" name="phone_number" label="Téléphone *" variant="outlined" />
      <v-text-field v-model="form.password" :error-messages="getErrorMessage('password')" name="password" type="password" label="Mot de passe *" variant="outlined" />
      <v-text-field v-model="form.adress" :error-messages="getErrorMessage('adress')" name="adress" label="Adresse Principale *" variant="outlined" />
      <v-btn color="blue" @click.prevent="handleFormSubmit">
        Enregistrer
      </v-btn>
    </v-form>
    <p class="text-body-1">
      Déjà un compte ?
      <v-btn variant="plain" slim to="/connexion">
        Connectez-vous
      </v-btn> !
    </p>
  </div>
</template>
