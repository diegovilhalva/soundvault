<script setup lang="ts">
import { onMounted, watch, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLastfm } from '../composables/useLastfm'
import { useFavoritesStore } from '../stores/favorites'
import { lastfm } from '../services/lastfm'
import { Heart } from 'lucide-vue-next'
import TrackItem from '../components/common/TrackItem.vue'


const route = useRoute()
const favorites = useFavoritesStore()

const { data: albumData, loading, execute: fetchAlbum } = useLastfm(lastfm.getAlbumInfo)

function load(artist: string, album: string) {
    fetchAlbum(artist, album)
}

onMounted(() => load(
    route.params.artist as string,
    route.params.album as string
))

watch(() => [route.params.artist, route.params.album], ([artist, album]) => {
    if (artist && album) load(artist as string, album as string)
})

function getAlbum() {
    return (albumData.value as any)?.album
}

function getAlbumImage() {
    const images = getAlbum()?.image
    return images?.find((i: any) => i.size === 'extralarge')?.['#text'] || ''
}

function toggleFavorite() {
    const album = getAlbum()
    if (!album) return
    favorites.toggleAlbum({
        name: album.name,
        artist: album.artist,
        image: getAlbumImage(),
        url: album.url,
    })
}

function formatDuration(seconds: string) {
    const s = parseInt(seconds)
    if (!s) return null
    const m = Math.floor(s / 60)
    const rem = s % 60
    return `${m}:${rem.toString().padStart(2, '0')}`
}

const currentAudioUrl = ref<string | null>(null)
const audioPlayer = ref<HTMLAudioElement | null>(null)

function playTrack(url: string) {
    currentAudioUrl.value = url
    if (audioPlayer.value) {
        audioPlayer.value.src = url
        audioPlayer.value.play()
    }
}

function pauseTrack() {
    currentAudioUrl.value = null
    if (audioPlayer.value) {
        audioPlayer.value.pause()
    }
}

onUnmounted(() => {
    if (audioPlayer.value) {
        audioPlayer.value.pause()
        audioPlayer.value.src = ''
    }
})
</script>

<template>
    <div class="min-h-screen">

        <div v-if="loading" class="flex items-center justify-center py-32 text-white/40 tracking-wider">
            Carregando...
        </div>

        <div v-else-if="getAlbum()">

            <!-- Hero do álbum -->
            <section class="border-b border-white/10">
                <div class="max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row gap-8 items-start">

                    <!-- Capa -->
                    <div class="w-48 h-48 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <img v-if="getAlbumImage()" :src="getAlbumImage()" :alt="getAlbum().name"
                            class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-white/20 text-5xl">♪
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <p class="text-white/40 text-sm uppercase tracking-widest mb-1">Álbum</p>
                        <h1 class="text-4xl font-bold uppercase tracking-widest text-white leading-tight">
                            {{ getAlbum().name }}
                        </h1>
                        <RouterLink :to="`/artist/${encodeURIComponent(getAlbum().artist)}`"
                            class="inline-block mt-2 text-red-500 font-semibold tracking-wider hover:text-red-400 transition-colors">
                            {{ getAlbum().artist }}
                        </RouterLink>

                        <div class="flex flex-wrap gap-2 mt-4">
                            <RouterLink v-for="tag in getAlbum().tags?.tag?.slice(0, 5)" :key="tag.name"
                                :to="`/tag/${encodeURIComponent(tag.name)}`"
                                class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wider uppercase text-white/50 hover:text-white hover:border-red-500 transition-all">
                                {{ tag.name }}
                            </RouterLink>
                        </div>
                        <p>{{ getAlbum().release_date }}</p>

                        <div class="flex items-center gap-6 mt-4 text-sm text-white/40 tracking-wider">
                            <span v-if="getAlbum().tracks?.track?.length">
                                {{ getAlbum().tracks.track.length }} faixas
                            </span>
                            <span v-if="getAlbum().listeners">
                                {{ Number(getAlbum().listeners).toLocaleString() }} ouvintes
                            </span>
                        </div>

                        <!-- Botão favorito -->
                        <button @click="toggleFavorite" :class="[
                            'mt-6 flex items-center justify-center gap-2 px-5 py-2 rounded-lg border font-semibold text-sm tracking-wider uppercase transition-all',
                            favorites.isFavoriteAlbum(getAlbum().name, getAlbum().artist)
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'bg-transparent border-white/20 text-white/60 hover:border-red-500 hover:text-red-500'
                        ]">

                            <Heart :size="16" :stroke-width="2.5"
                                :fill="favorites.isFavoriteAlbum(getAlbum().name, getAlbum().artist) ? 'currentColor' : 'none'"
                                class="transition-colors duration-200" />


                            <span>
                                {{ favorites.isFavoriteAlbum(getAlbum().name, getAlbum().artist) ? 'Favoritado' :
                                    'Favoritar' }}
                            </span>
                        </button>

                    </div>
                </div>
            </section>

            <!-- Tracklist -->
            <!-- Tracklist -->
            <section class="max-w-4xl mx-auto px-6 py-12">
                <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Tracklist</h2>

                <audio ref="audioPlayer" @ended="currentAudioUrl = null" class="hidden"></audio>

                <div class="flex flex-col gap-2">
                    <TrackItem v-for="(track, index) in getAlbum().tracks?.track" :key="track.name"
                        :track-name="track.name" :artist-name="getAlbum().artist" :index="index"
                        :active-preview-url="currentAudioUrl" @play="playTrack" @pause="pauseTrack" />
                </div>
            </section>

        </div>

        <div v-else class="flex items-center justify-center py-32 text-white/40 tracking-wider">
            Álbum não encontrado.
        </div>

    </div>
</template>