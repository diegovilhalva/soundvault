<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  artistName: string
}>()

const imageUrl = ref('')
const loading = ref(true)

const initials = computed(() => {
  return props.artistName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
})

onMounted(async () => {
  try {
    const encoded = encodeURIComponent(props.artistName)
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    const response = await fetch(url)
    const data = await response.json()
    imageUrl.value = data.thumbnail?.source || ''
  } catch (e) {
    imageUrl.value = ''
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div v-if="loading" class="animate-pulse bg-white/10 w-full h-full"></div>
    <img
      v-else-if="imageUrl"
      :src="imageUrl"
      :alt="artistName"
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center bg-white/5 text-white/40 font-bold text-xl tracking-widest"
    >
      {{ initials }}
    </div>
  </div>
</template>