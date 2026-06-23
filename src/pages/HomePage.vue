<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useLastfm } from '../composables/useLastfm'
import { lastfm } from '../services/lastfm'
import ArtistImage from '../components/common/ArtistImage.vue'


const router = useRouter()
const query = ref('')

const { data: topArtists, loading: loadingArtists, execute: fetchTopArtists } = useLastfm(lastfm.getTopArtists)
const { data: topTags, loading: loadingTags, execute: fetchTopTags } = useLastfm(lastfm.getTopTags)


onMounted(() => {
  fetchTopArtists()
  fetchTopTags()
})

function search() {
  if (query.value.trim()) {
    router.push(`/artist/${encodeURIComponent(query.value.trim())}`)
    query.value = ''
  }
}



</script>

<template>
  <div class="min-h-screen">

    <!-- Hero -->
    <section class="relative flex flex-col items-center justify-center text-center px-6 py-32 border-b border-white/10">
      <h1 class="text-6xl font-bold uppercase tracking-widest text-white mb-2">
        Sound<span class="text-red-500">Vault</span>
      </h1>
      <p class="text-white/40 text-lg tracking-wider mb-10">
        Descubra artistas, álbuns e gêneros
      </p>
      <div class="flex items-center w-full max-w-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:border-red-500 transition-colors">
        <input
          v-model="query"
          @keyup.enter="search"
          type="text"
          placeholder="Buscar artista..."
          class="flex-1 bg-transparent px-5 py-4 text-white placeholder-white/30 outline-none text-lg"
        />
        <button
          @click="search"
          class="px-6 py-4 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold tracking-wider uppercase text-sm"
        >
          Buscar
        </button>
      </div>
    </section>

    <!-- Top Artistas -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <h2 class="text-2xl font-bold uppercase tracking-widest text-white mb-8">
        Top Artistas
      </h2>

      <div v-if="loadingArtists" class="text-white/40 tracking-wider">Carregando...</div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <RouterLink
          v-for="artist in (topArtists as any)?.artists?.artist"
          :key="artist.name"
          :to="`/artist/${encodeURIComponent(artist.name)}`"
          class="group flex flex-col items-center gap-2 text-center"
        >
          <div class="w-full aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
            <ArtistImage   :artist-name="artist.name" />
          </div>
          <span class="text-sm font-semibold text-white/70 group-hover:text-white transition-colors truncate w-full">
            {{ artist.name }}
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- Top Tags -->
    <section class="max-w-7xl mx-auto px-6 py-8 pb-16">
      <h2 class="text-2xl font-bold uppercase tracking-widest text-white mb-8">
        Explorar por Gênero
      </h2>

      <div v-if="loadingTags" class="text-white/40 tracking-wider">Carregando...</div>

      <div v-else class="flex flex-wrap gap-3">
        <RouterLink
          v-for="tag in (topTags as any)?.tags?.tag?.slice(0, 24)"
          :key="tag.name"
          :to="`/tag/${encodeURIComponent(tag.name)}`"
          class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold tracking-wider text-white/60 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-all uppercase"
        >
          {{ tag.name }}
        </RouterLink>
      </div>
    </section>

  </div>
</template>