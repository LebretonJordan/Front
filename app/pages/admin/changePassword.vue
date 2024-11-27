<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  current_password: z.string().min(1, 'Le mot de passe actuel est obligatoire'),
  new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  new_password_confirmation: z.string().min(8, 'La confirmation du mot de passe doit contenir au moins 8 caractères'),
}).refine(data => data.new_password === data.new_password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['new_password_confirmation'],
})

type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
const router = useRouter()
// Affiche les erreurs backend
const backendError = ref()

async function handleFormSubmit() {
  // Réinitialisation des erreurs backend
  backendError.value = null
  await validate()
  // Si le formulaire ne suis pas le schéma on stop l'execution
  if (!isValid.value) {
    return
  }
  // Récupére le token de connexion stocké dans sessionStorage
  const token = sessionStorage.getItem('auth_token')

  // Si le token n'est pas valide cela veut dire que l'utilisateur n'est pas connecté.
  if (!token) {
    backendError.value = 'Vous devez être connecté pour changer votre mot de passe.'
    return
  }

  try {
    await $fetch('http://127.0.0.1:8000/api/change-password', {
      method: 'POST',
      body: form.value,
      headers: {
        Authorization: `Bearer ${token}`, // On verifie le token ici
        Accept: 'application/json',
      },
    })
    // Si le token est bon alors le mot de passe est modifier
    if (token) {
      router.push({ name: 'profil' })
    }
  }
  // Mal compris la gestion des erreur je pense, j'ai essaye de faire comme la parti inscrpition à la base et je me suis vite emmêlé les pinceaux donc j'ai fait un truc simple en attendant
  catch (error) {
    backendError.value = error?.data?.error || 'Une erreur est survenue lors de la mise à jour du mot de passe.'
  }
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Changer votre mot de passe
    </h1>
    <v-alert v-if="backendError" type="error" variant="outlined" class="mb-4">
      <p>{{ backendError }}</p>
    </v-alert>

    <v-form class="mb-3 flex flex-col gap-3">
      <v-text-field v-model="form.current_password" :error-messages="getErrorMessage('current_password')" name="current_password" type="password" label="Mot de passe actuel *" variant="outlined" />
      <v-text-field v-model="form.new_password" :error-messages="getErrorMessage('new_password')" name="new_password" type="password" label="Nouveau mot de passe *" variant="outlined" />
      <v-text-field v-model="form.new_password_confirmation" :error-messages="getErrorMessage('new_password_confirmation')" name="new_password_confirmation" type="password" label="Confirmer le nouveau mot de passe *" variant="outlined" />
      <v-btn color="blue" @click.prevent="handleFormSubmit">
        Sauvegarder
      </v-btn>
    </v-form>
  </div>
</template>
