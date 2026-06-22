<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function search() {
  if (query.value.trim()) {
    router.push(`/artist/${encodeURIComponent(query.value.trim())}`)
    query.value = ''
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-sm border-b border-white/10">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

      <RouterLink to="/" class="text-2xl font-bold tracking-widest text-red-500 uppercase shrink-0">
        SoundVault
      </RouterLink>

      <div class="flex-1 max-w-md">
        <div class="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-red-500 transition-colors">
          <input
            v-model="query"
            @keyup.enter="search"
            type="text"
            placeholder="Buscar artista..."
            class="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/30 outline-none font-rajdhani"
          />
          <button
            @click="search"
            class="px-4 py-2 text-white/50 hover:text-red-500 transition-colors"
          >
            ⌕
          </button>
        </div>
      </div>

      <nav class="flex items-center gap-6 text-sm font-semibold tracking-wider uppercase">
        <RouterLink to="/" class="text-white/60 hover:text-white transition-colors">Home</RouterLink>
        <RouterLink to="/favorites" class="text-white/60 hover:text-red-500 transition-colors">Favoritos</RouterLink>
      </nav>

    </div>
  </header>
</template>