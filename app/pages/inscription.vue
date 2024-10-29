<template>
  <div>
    <h1>Créer votre compte</h1>
    <p>Vous avez déjà un compte ? Connectez-vous !</p>

    <!-- Affichage des messages de succès ou d'erreur -->
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errors.length" class="alert alert-danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Prénom</label>
        <input v-model="form.name" type="text" id="name" placeholder="Prénom" />
        <span v-if="fieldErrors.name" class="error">{{ fieldErrors.name }}</span>
      </div>

      <div>
        <label for="lastname">Nom</label>
        <input v-model="form.lastname" type="text" id="lastname" placeholder="Nom" />
        <span v-if="fieldErrors.lastname" class="error">{{ fieldErrors.lastname }}</span>
      </div>

      <div>
        <label for="society">Société (facultatif)</label>
        <input v-model="form.society" type="text" id="society" placeholder="Société" />
      </div>

      <div>
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" placeholder="Email" />
        <span v-if="fieldErrors.email" class="error">{{ fieldErrors.email }}</span>
      </div>

      <div>
        <label for="phone_number">Téléphone</label>
        <input v-model="form.phone_number" type="tel" id="phone_number" placeholder="Téléphone" />
        <span v-if="fieldErrors.phone_number" class="error">{{ fieldErrors.phone_number }}</span>
      </div>

      <div>
        <label for="password">Mot de passe</label>
        <input v-model="form.password" type="password" id="password" placeholder="Mot de passe" />
        <span v-if="fieldErrors.password" class="error">{{ fieldErrors.password }}</span>
      </div>

      <div>
        <label for="adress">Adresse Principale</label>
        <input v-model="form.adress" type="text" id="adress" placeholder="Adresse Principale" />
        <span v-if="fieldErrors.adress" class="error">{{ fieldErrors.adress }}</span>
      </div>

      <div>
        <button type="reset" @click="resetForm">Réinitialiser</button>
        <button type="submit">Enregistrer</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        lastname: '',
        society: '',
        email: '',
        phone_number: '',
        password: '',
        adress: ''
      },
      successMessage: '',
      errors: [],
      fieldErrors: {}
    };
  },
  methods: {
    async handleSubmit() {
      this.errors = [];
      this.fieldErrors = {};

      try {
        // Envoie le formulaire à l'API
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });
        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            this.fieldErrors = data.errors; // erreurs spécifiques à chaque champ
          } else {
            this.errors.push(data.message || 'Une erreur est survenue');
          }
        } else {
          this.successMessage = 'Compte créé avec succès !';
          this.resetForm();
        }
      } catch (error) {
        this.errors.push('Erreur de connexion au serveur.');
      }
    },
    resetForm() {
      this.form = {
        name: '',
        lastname: '',
        society: '',
        email: '',
        phone_number: '',
        password: '',
        adress: ''
      };
      this.successMessage = '';
      this.errors = [];
      this.fieldErrors = {};
    }
  }
};
</script>

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
