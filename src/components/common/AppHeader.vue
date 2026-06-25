<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {Search, SearchIcon} from "lucide-vue-next"

const router = useRouter()
const query = ref('')
const menuOpen = ref(false)

function search() {
  if (query.value.trim()) {
    router.push(`/artist/${encodeURIComponent(query.value.trim())}`)
    query.value = ''
    menuOpen.value = false
  }
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-sm border-b border-white/10">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

      <!-- Logo -->
      <RouterLink to="/" @click="closeMenu" class="text-2xl font-bold tracking-widest text-red-500 uppercase shrink-0">
        SoundVault
      </RouterLink>

      <!-- Search — oculto no mobile -->
      <div class="hidden md:flex flex-1 max-w-md">
        <div class="flex w-full items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-red-500 transition-colors">
          <input
            v-model="query"
            @keyup.enter="search"
            type="text"
            placeholder="Buscar artista..."
            class="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/30 outline-none"
          />
          <button @click="search" class="px-4 py-2 text-white/50 hover:text-red-500 transition-colors">
            <Search class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Nav — oculto no mobile -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wider uppercase">
        <RouterLink to="/" class="text-white/60 hover:text-white transition-colors">Home</RouterLink>
        <RouterLink to="/favorites" class="text-white/60 hover:text-red-500 transition-colors">Favoritos</RouterLink>
      </nav>

      <!-- Hamburguer — visível só no mobile -->
      <button
        @click="menuOpen = !menuOpen"
        class="md:hidden flex flex-col gap-1.5 p-2 text-white/60 hover:text-white transition-colors"
      >
        <span :class="['block w-6 h-0.5 bg-current transition-all duration-300', menuOpen ? 'rotate-45 translate-y-2' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-current transition-all duration-300', menuOpen ? 'opacity-0' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-current transition-all duration-300', menuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
      </button>

    </div>

    <!-- Menu mobile -->
    <div v-if="menuOpen" class="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 bg-[#111111]">
      <!-- Search mobile -->
      <div class="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-red-500 transition-colors">
        <input
          v-model="query"
          @keyup.enter="search"
          type="text"
          placeholder="Buscar artista..."
          class="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/30 outline-none"
        />
        <button @click="search" class="px-4 py-2 text-white/50 hover:text-red-500 transition-colors">
          <Search  class="w-4 h-4"  />
        </button>
      </div>

      <!-- Links mobile -->
      <nav class="flex flex-col gap-3 text-sm font-semibold tracking-wider uppercase">
        <RouterLink to="/" @click="closeMenu" class="text-white/60 hover:text-white transition-colors">Home</RouterLink>
        <RouterLink to="/favorites" @click="closeMenu" class="text-white/60 hover:text-red-500 transition-colors">Favoritos</RouterLink>
      </nav>
    </div>

  </header>
</template>