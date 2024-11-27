<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import { useFormValidation } from 'vue-use-form-validation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Le champ prénom est obligatoire'),
  lastname: z.string().min(1, 'Le champ nom est obligatoire'),
  society: z.optional(z.string()),
  email: z.string().min(1, 'Le champ email est obligatoire').email('Veuillez saisir un email valide'),
  phone_number: z.string().min(1, 'Le champ téléphone est obligatoire').max(15, 'Le champs téléphone doit contenir au maximum 15 caractères'),
})

type Form = z.infer<typeof schema>
const form: Ref<Form> = ref({
  id: '',
  name: '',
  lastname: '',
  society: '',
  email: '',
  phone_number: '',
})

const fieldErrors = ref<Record<string, string[]>>({})

const profileData = ref({
  id: '',
  name: '',
  lastname: '',
  society: '',
  email: '',
  phone_number: '',
})

interface CustomJwtPayload {
  id: string
  name: string
  lastname: string
  society: string
  email: string
  phone_number: string
}

const { validate, getErrorMessage, isValid } = useFormValidation(schema, form)
const editingField = ref<string | null>(null)
const error = ref<string | null>(null)

async function fetchProfile() {
  try {
    const token = useCookie('token').value
    if (!token) {
      throw new Error('Aucun token trouvé. Veuillez vous connecter.')
    }

    const decodedToken = jwtDecode<CustomJwtPayload>(token)
    profileData.value = {
      id: decodedToken.id || '',
      name: decodedToken.name || '',
      lastname: decodedToken.lastname || '',
      society: decodedToken.society || '',
      email: decodedToken.email || '',
      phone_number: decodedToken.phone_number || '',
    }

    form.value = { ...profileData.value }
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la récupération des données utilisateur :', err)
      error.value = err.message || 'Erreur lors du chargement des données utilisateur.'
    }
    else {
      console.error('Erreur inconnue lors de la récupération des données utilisateur', err)
      error.value = 'Erreur inconnue.'
    }
  }
}

async function saveField(field: keyof Form) {
  fieldErrors.value = {}
  await validate()

  if (!isValid.value) {
    return
  }

  try {
    const response = await $fetch('http://127.0.0.1:8000/api/profile', {
      method: 'PUT',
      body: {
        id: profileData.value.id,
        [field]: form.value[field],
      },
      headers: { Accept: 'application/json' },
    })

    if (response && response.success) {
      profileData.value[field] = form.value[field]
      editingField.value = null
      alert(`${field} mis à jour avec succès.`)
    }
    else {
      throw new Error('Échec de la mise à jour du champ.')
    }
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la mise à jour du champ :', err)
      error.value = err.message || 'Une erreur est survenue lors de la mise à jour.'
    }
    else {
      console.error('Erreur inconnue lors de la mise à jour du champ', err)
      error.value = 'Erreur inconnue.'
    }
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="edit-profile">
    <h1 class="text-h3 mb-8 text-center">
      Modifier mes informations
    </h1>

    <div v-if="error">
      <v-alert type="error">
        {{ error }}
      </v-alert>
    </div>

    <div v-if="profileData.name">
      <v-card class="mb-6 pa-6">
        <div class="field">
          <v-text-field
            v-model="form.name"
            :error-messages="getErrorMessage('name')"
            label="Prénom"
            outlined
            :readonly="editingField !== 'name'"
          />
          <v-btn icon @click="editingField === 'name' ? saveField('name') : (editingField = 'name')">
            <v-icon>{{ editingField === 'name' ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          </v-btn>
        </div>

        <div class="field">
          <v-text-field
            v-model="form.lastname"
            :error-messages="getErrorMessage('lastname')"
            label="Nom"
            outlined
            :readonly="editingField !== 'lastname'"
          />
          <v-btn icon @click="editingField === 'lastname' ? saveField('lastname') : (editingField = 'lastname')">
            <v-icon>{{ editingField === 'lastname' ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          </v-btn>
        </div>

        <div class="field">
          <v-text-field
            v-model="form.society"
            :error-messages="getErrorMessage('society')"
            label="Société"
            outlined
            :readonly="editingField !== 'society'"
          />
          <v-btn icon @click="editingField === 'society' ? saveField('society') : (editingField = 'society')">
            <v-icon>{{ editingField === 'society' ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          </v-btn>
        </div>

        <div class="field">
          <v-text-field
            v-model="form.email"
            :error-messages="getErrorMessage('email')"
            label="Email"
            outlined
            :readonly="editingField !== 'email'"
          />
          <v-btn icon @click="editingField === 'email' ? saveField('email') : (editingField = 'email')">
            <v-icon>{{ editingField === 'email' ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          </v-btn>
        </div>

        <div class="field">
          <v-text-field
            v-model="form.phone_number"
            :error-messages="getErrorMessage('phone_number')"
            label="Téléphone"
            outlined
            :readonly="editingField !== 'phone_number'"
          />
          <v-btn icon @click="editingField === 'phone_number' ? saveField('phone_number') : (editingField = 'phone_number')">
            <v-icon>{{ editingField === 'phone_number' ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.edit-profile {
  max-width: 600px;
  margin: 0 auto;
}
.field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
