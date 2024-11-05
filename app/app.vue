<script setup lang="ts">
import { appName } from '~/constants'

const { showSnackbar, snackbarText, snackbarColor } = useSnackbarStore()

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <v-app>
      <NuxtPage />
      <v-snackbar
        v-model="showSnackbar"
        :timeout="3000"
        :color="snackbarColor"
        multi-line
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-app>
  </NuxtLayout>
</template>
