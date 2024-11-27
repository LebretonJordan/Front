<script setup lang="ts">
import { useAuthStore } from '@/composables/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
}
const links = [
  {
    label: 'Voir et modifier mes informations personnelles',
    route: '/admin/edit',
  },
  {
    label: 'Mes commandes en cours',
    route: '/admin/current-orders',
  },
  {
    label: 'Mon historique de commande',
    route: '/admin/order-history',
  },
  {
    label: 'Mes adresses de livraison',
    route: '/admin/addresses',
  },
  {
    label: 'Mes moyens de paiement',
    route: '/admin/payment-methods',
  },
]
</script>

<template>
  <div class="profile">
    <h1 class="text-h3 mb-8 text-center">
      Mon Profil
    </h1>

    <v-card class="mb-6 pa-6">
      <v-list>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          class="cursor-pointer"
          @click="router.push(link.route)"
        >
          <v-list-item-title>{{ link.label }}</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>

    <v-btn color="red" block @click="logout">
      Se déconnecter
    </v-btn>
  </div>
</template>
