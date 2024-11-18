<script setup lang="ts">
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
      code: 'custom',
    })
  }
})

type FieldErrors = Record<string, string[]>

const fieldErrors = ref<FieldErrors>({})

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
  fieldErrors.value = {}
  await validate()
  if (!isValid.value) {
    return
  }

  try {
    await $fetch('http://127.0.0.1:8000/api/inscription', {
      method: 'POST',
      body: form.value,
      headers: { Accept: 'application/json' },
    })
    setSnackbarText('Votre compte a bien été créé', 'green')
    router.push({ name: 'connexion' })
  }
  catch (e) {
    interface Error { data: { error?: string | FieldErrors } }
    const err = (e as Error).data.error
    if (!err) {
      setSnackbarText('Votre compte a bien été créé', 'green')
      router.push({ name: 'connexion' })
    }
    else if (typeof err === 'string') {
      fieldErrors.value.global = [err]
    }
    else {
      fieldErrors.value = err
    }
  }
}

function getError(key: keyof Form) {
  return getErrorMessage(key) || fieldErrors.value[key]
}
</script>

<template>
  <div>
    <h1 class="text-h3 mb-10 text-center">
      Créer votre compte
    </h1>
    <v-alert v-if="fieldErrors.global?.length" type="error" variant="outlined" class="mb-4">
      <p>{{ fieldErrors.global[0] }}</p>
    </v-alert>
    <v-form class="mb-3 flex flex-col gap-3">
      <v-text-field v-model="form.name" :error-messages="getError('name')" name="name" label="Prénom *" variant="outlined" />
      <v-text-field v-model="form.lastname" :error-messages="getError('lastname')" name="lastname" label="Nom *" variant="outlined" />
      <v-text-field v-model="form.society" :error-messages="getError('society')" name="society" label="Société" variant="outlined" />
      <v-text-field v-model="form.email" :error-messages="getError('email')" name="email" type="email" label="Email *" variant="outlined" />
      <v-text-field v-model="form.phone_number" :error-messages="getError('phone_number')" name="phone_number" label="Téléphone *" variant="outlined" />
      <v-text-field v-model="form.password" :error-messages="getError('password')" name="password" type="password" label="Mot de passe *" variant="outlined" />
      <v-text-field v-model="form.confirm_password" :error-messages="getError('confirm_password')" name="confirm_password" type="password" label="Confirmer le mot de passe *" variant="outlined" />
      <v-text-field v-model="form.adress" :error-messages="getError('adress')" name="adress" label="Adresse Principale *" variant="outlined" />
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
