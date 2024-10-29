<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <div>
    <Suspense>
      <ClientOnly>
        <PageView v-if="online" />
        <div v-else class="text-gray:80">
          You're offline
        </div>
      </ClientOnly>
      <template #fallback>
        <div class="italic op50">
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    My page
    <DarkToggle />
  </div>
</template>
