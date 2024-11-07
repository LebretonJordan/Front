<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Le champ prénom est obligatoire'),
  lastname: z.string().min(1, 'Le champ nom est obligatoire'),
  society: z.optional(z.string()),
  email: z.string().min(1, 'Le champ email est obligatoire').email('Veuillez saisir un email valide'),
  phone_number: z.string().min(1, 'Le champ téléphone est obligatoire').max(15, 'Le champs téléphone doit contenir au maximum 15 caractères'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string().min(8, 'Le mot de passe de confirmation doit contenir au moins 8 caractères'),
  adress: z.string().min(1, 'Le champ adresse est obligatoire'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      path: ['confirm_password'],
      message: 'Les mots de passe ne correspondent pas',
    })
  }
})

const backendError = ref('')
const fieldErrors = ref<Record<string, string | undefined>>({})

type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  name: '',
  lastname: '',
  society: '',
  email: '',
  phone_number: '',
  password: '',
  confirm_password: '',
  adress: '',
})

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
const { setSnackbarText } = useSnackbarStore()
const router = useRouter()

async function handleFormSubmit() {
  await validate()
  backendError.value = ''
  fieldErrors.value = {}
  if (!isValid.value) {
    return
  }

  try {
    const { data, error } = await useFetch<{ error?: Record<string, string[]> }>(
      'http://127.0.0.1:8000/api/inscription',
      {
        method: 'POST',
        body: form.value,
        headers: { Accept: 'application/json' },
      },
    )

    if (error.value) {
      if (error.value.error) {
        Object.keys(error.value.error).forEach((key) => {
          fieldErrors.value[key] = error.value.error[key][0]
        })
      }
      else {
        backendError.value = 'Cette adresse mail est déjà lier à un compte'
      }
    }
    else {
      setSnackbarText('Votre compte a bien été créé', 'green')
      router.push({ name: 'connexion' })
    }
  }
  catch {
    backendError.value = 'Erreur lors de la connexion au serveur.'
  }
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Créer votre compte
    </h1>
    <v-alert v-if="backendError" type="error" variant="outlined" class="mb-4">
      <p>{{ backendError }}</p>
    </v-alert>
    <v-form class="mb-3 flex flex-col gap-3">
      <v-text-field v-model="form.name" :error-messages="[getErrorMessage('name'), fieldErrors.name].filter(Boolean)" name="name" label="Prénom *" variant="outlined" />
      <v-text-field v-model="form.lastname" :error-messages="[getErrorMessage('lastname'), fieldErrors.lastname].filter(Boolean)" name="lastname" label="Nom *" variant="outlined" />
      <v-text-field v-model="form.society" :error-messages="getErrorMessage('society')" name="society" label="Société" variant="outlined" />
      <v-text-field v-model="form.email" :error-messages="[getErrorMessage('email'), fieldErrors.email].filter(Boolean)" name="email" type="email" label="Email *" variant="outlined" />
      <v-text-field v-model="form.phone_number" :error-messages="[getErrorMessage('phone_number'), fieldErrors.phone_number].filter(Boolean)" name="phone_number" label="Téléphone *" variant="outlined" />
      <v-text-field v-model="form.password" :error-messages="[getErrorMessage('password'), fieldErrors.password].filter(Boolean)" name="password" type="password" label="Mot de passe *" variant="outlined" />
      <v-text-field v-model="form.confirm_password" :error-messages="[getErrorMessage('confirm_password'), fieldErrors.confirm_password].filter(Boolean)" name="confirm_password" type="password" label="Confirmer le mot de passe *" variant="outlined" />
      <v-text-field v-model="form.adress" :error-messages="[getErrorMessage('adress'), fieldErrors.adress].filter(Boolean)" name="adress" label="Adresse Principale *" variant="outlined" />
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
