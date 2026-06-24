<script setup lang="ts">
import AppFooter from './components/common/AppFooter.vue';
import AppHeader from './components/common/AppHeader.vue';


</script>

<template>
    <AppHeader />
  <main class="pt-16">
    <RouterView />
  </main>
  <AppFooter />
</template>
