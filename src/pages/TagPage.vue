<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLastfm } from '../composables/useLastfm'
import { lastfm } from '../services/lastfm'
import ArtistImage from '../components/common/ArtistImage.vue'

const route = useRoute()

const { data: tagData,  execute: fetchTag } = useLastfm(lastfm.getTagInfo)
const { data: artistsData, loading: loadingArtists, execute: fetchArtists } = useLastfm(lastfm.getTagTopArtists)
const { data: albumsData, loading: loadingAlbums, execute: fetchAlbums } = useLastfm(lastfm.getTagTopAlbums)

function load(tag: string) {
  fetchTag(tag)
  fetchArtists(tag)
  fetchAlbums(tag)
}

onMounted(() => load(route.params.name as string))
watch(() => route.params.name, (name) => { if (name) load(name as string) })

function getTag() {
  return (tagData.value as any)?.tag
}
</script>

<template>
  <div class="min-h-screen">

    <!-- Header da tag -->
    <section class="border-b border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <p class="text-white/40 text-sm uppercase tracking-widest mb-1">Gênero</p>
        <h1 class="text-5xl font-bold uppercase tracking-widest text-white">
          {{ route.params.name }}
        </h1>
        <p v-if="getTag()?.wiki?.summary" class="mt-4 text-white/50 text-sm leading-relaxed max-w-2xl line-clamp-3">
          {{ getTag().wiki.summary.replace(/<[^>]*>/g, '').trim() }}
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">

      <!-- Top Artistas -->
      <section>
        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Top Artistas</h2>
        <div v-if="loadingArtists" class="text-white/40 tracking-wider text-sm">Carregando...</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <RouterLink
            v-for="artist in (artistsData as any)?.topartists?.artist"
            :key="artist.name"
            :to="`/artist/${encodeURIComponent(artist.name)}`"
            class="group flex flex-col items-center gap-2 text-center"
          >
            <div class="w-full aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
              <ArtistImage :artist-name="artist.name" />
            </div>
            <span class="text-sm font-semibold text-white/70 group-hover:text-white transition-colors truncate w-full">
              {{ artist.name }}
            </span>
          </RouterLink>
        </div>
      </section>

      <!-- Top Álbuns -->
      <section>
        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Top Álbuns</h2>
        <div v-if="loadingAlbums" class="text-white/40 tracking-wider text-sm">Carregando...</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <RouterLink
            v-for="album in (albumsData as any)?.albums?.album"
            :key="album.name"
            :to="`/album/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`"
            class="group flex flex-col gap-2"
          >
            <div class="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
              <img
                v-if="album.image?.find((i: any) => i.size === 'extralarge')?.['#text']"
                :src="album.image.find((i: any) => i.size === 'extralarge')['#text']"
                :alt="album.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-white/20 text-3xl">♪</div>
            </div>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                {{ album.name }}
              </p>
              <p class="text-xs text-white/30 truncate">{{ album.artist.name }}</p>
            </div>
          </RouterLink>
        </div>
      </section>

    </div>
  </div>
</template>