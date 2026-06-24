<script setup lang="ts">
import { useFavoritesStore } from '../stores/favorites'
import ArtistImage from '../components/common/ArtistImage.vue'

const favorites = useFavoritesStore()
</script>

<template>
  <div class="min-h-screen">

    <!-- Header -->
    <section class="border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <h1 class="text-5xl font-bold uppercase tracking-widest text-white">
          Favor<span class="text-red-500">itos</span>
        </h1>
        <p class="text-white/40 text-sm tracking-wider mt-2">
          {{ favorites.artists.length }} artistas · {{ favorites.albums.length }} álbuns
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">

      <!-- Artistas favoritos -->
      <section>
        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Artistas</h2>

        <div v-if="favorites.artists.length === 0" class="text-white/30 text-sm tracking-wider">
          Nenhum artista favoritado ainda.
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="artist in favorites.artists"
            :key="artist.name"
            class="group flex flex-col items-center gap-2 text-center relative"
          >
            <RouterLink :to="`/artist/${encodeURIComponent(artist.name)}`" class="w-full">
              <div class="w-full aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
                <ArtistImage :artist-name="artist.name" />
              </div>
              <span class="text-sm font-semibold text-white/70 group-hover:text-white transition-colors truncate w-full block mt-2">
                {{ artist.name }}
              </span>
            </RouterLink>

            <!-- Botão remover -->
            <button
              @click="favorites.toggleArtist(artist)"
              class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white/40 hover:text-red-500 hover:bg-black/80 transition-all flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      </section>

      <!-- Álbuns favoritos -->
      <section>
        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Álbuns</h2>

        <div v-if="favorites.albums.length === 0" class="text-white/30 text-sm tracking-wider">
          Nenhum álbum favoritado ainda.
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="album in favorites.albums"
            :key="`${album.artist}-${album.name}`"
            class="group flex flex-col gap-2 relative"
          >
            <RouterLink :to="`/album/${encodeURIComponent(album.artist)}/${encodeURIComponent(album.name)}`">
              <div class="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
                <img
                  v-if="album.image"
                  :src="album.image"
                  :alt="album.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white/20 text-3xl">♪</div>
              </div>
              <div class="min-w-0 mt-2">
                <p class="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                  {{ album.name }}
                </p>
                <p class="text-xs text-white/30 truncate">{{ album.artist }}</p>
              </div>
            </RouterLink>

            <!-- Botão remover -->
            <button
              @click="favorites.toggleAlbum(album)"
              class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white/40 hover:text-red-500 hover:bg-black/80 transition-all flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>