<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLastfm } from '../composables/useLastfm'
import { useFavoritesStore } from '../stores/favorites'
import { lastfm } from '../services/lastfm'
import ArtistImage from '../components/common/ArtistImage.vue'
import TrackItem from '../components/common/TrackItem.vue'
import { Heart } from 'lucide-vue-next'


const route = useRoute()
const router = useRouter()
const favorites = useFavoritesStore()

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

const { data: artistData, loading: loadingArtist, execute: fetchArtist } = useLastfm(lastfm.getArtistInfo)
const { data: similarData, loading: loadingSimilar, execute: fetchSimilar } = useLastfm(lastfm.getSimilarArtists)
const { data: tracksData, loading: loadingTracks, execute: fetchTracks } = useLastfm(lastfm.getArtistTopTracks)
const { data: albumsData, loading: loadingAlbums, execute: fetchAlbums } = useLastfm(lastfm.getArtistTopAlbums)

function load(name: string) {
    fetchArtist(name)
    fetchSimilar(name)
    fetchTracks(name)
    fetchAlbums(name)
}

onMounted(() => load(route.params.name as string))
watch(() => route.params.name, (name) => { if (name) load(name as string) })

function getArtist() {
    return (artistData.value as any)?.artist
}

function stripHtml(html: string) {
    if (!html) return ''
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/Read more on Last.fm.*/i, '')
        .replace(/\s+/g, ' ')
        .trim()
}

function toggleFavorite() {
    const artist = getArtist()
    if (!artist) return
    favorites.toggleArtist({
        name: artist.name,
        image: '',
        url: artist.url,
    })
}
</script>

<template>
    <div class="min-h-screen">

        <div v-if="loadingArtist" class="flex items-center justify-center py-32 text-white/40 tracking-wider">
            Carregando...
        </div>

        <div v-else-if="getArtist()">
            <!-- Hero do artista -->
            <section class="relative border-b border-white/10">
                <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 items-start">

                    <!-- Imagem -->
                    <div class="w-40 h-40 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <ArtistImage :artist-name="getArtist().name" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h1 class="text-5xl font-bold uppercase tracking-widest text-white">
                                    {{ getArtist().name }}
                                </h1>
                                <div class="flex flex-wrap gap-2 mt-3">
                                    <RouterLink v-for="tag in getArtist().tags?.tag?.slice(0, 5)" :key="tag.name"
                                        :to="`/tag/${encodeURIComponent(tag.name)}`"
                                        class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-wider uppercase text-white/50 hover:text-white hover:border-red-500 transition-all">
                                        {{ tag.name }}
                                    </RouterLink>
                                </div>
                                <p class="text-white/40 text-sm mt-3 tracking-wider">
                                    {{ Number(getArtist().stats?.listeners).toLocaleString() }} ouvintes
                                </p>
                            </div>

                            <!-- Botão favorito -->
                            <button @click="toggleFavorite" :class="[
                                'flex items-center justify-center gap-2 px-5 py-2 rounded-lg border font-semibold text-sm tracking-wider uppercase transition-all',
                                favorites.isFavoriteArtist(getArtist().name)
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'bg-transparent border-white/20 text-white/60 hover:border-red-500 hover:text-red-500'
                            ]">
                                <!-- Ícone Lucide Heart -->
                                <Heart :size="16" :stroke-width="2.5"
                                    :fill="favorites.isFavoriteArtist(getArtist().name) ? 'currentColor' : 'none'"
                                    class="transition-colors duration-200" />

                                <!-- Texto Dinâmico -->
                                <span>
                                    {{ favorites.isFavoriteArtist(getArtist().name) ? 'Favoritado' : 'Favoritar' }}
                                </span>
                            </button>

                        </div>

                        <!-- Bio -->
                        <p v-if="getArtist().bio?.summary"
                            class="mt-5 text-white/60 text-sm leading-relaxed max-w-2xl line-clamp-4">
                            {{ stripHtml(getArtist().bio.summary) }}
                        </p>
                    </div>
                </div>
            </section>

            <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                <!-- Coluna principal -->
                <div class="lg:col-span-2 flex flex-col gap-12">

                    <!-- Top Tracks -->
                    <section>
                        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Top Tracks</h2>
                        <div v-if="loadingTracks" class="text-white/40 tracking-wider text-sm">Carregando...</div>
                        <div v-else class="flex flex-col gap-2">
                            

                            <!-- Tag de áudio HTML nativa que fará o som tocar -->
                            <audio ref="audioPlayer" @ended="currentAudioUrl = null" class="hidden"></audio>

                            <TrackItem v-for="(track, index) in (tracksData as any)?.toptracks?.track?.slice(0, 5)"
                                :key="track.name" :track-name="track.name" :artist-name="getArtist().name"
                                :index="index" :active-preview-url="currentAudioUrl" @play="playTrack"
                                @pause="pauseTrack" />
                        </div>
                    </section>

                    <!-- Álbuns -->
                    <section>
                        <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Álbuns</h2>
                        <div v-if="loadingAlbums" class="text-white/40 tracking-wider text-sm">Carregando...</div>
                        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            <RouterLink v-for="album in (albumsData as any)?.topalbums?.album" :key="album.name"
                                :to="`/album/${encodeURIComponent(getArtist().name)}/${encodeURIComponent(album.name)}`"
                                class="group flex flex-col gap-2">
                                <div
                                    class="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500 transition-colors">
                                    <img v-if="album.image?.find((i: any) => i.size === 'extralarge')?.['#text']"
                                        :src="album.image.find((i: any) => i.size === 'extralarge')['#text']"
                                        :alt="album.name"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div v-else
                                        class="w-full h-full flex items-center justify-center text-white/20 text-3xl">♪
                                    </div>
                                </div>
                                <p
                                    class="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                                    {{ album.name }}
                                </p>
                            </RouterLink>
                        </div>
                    </section>

                </div>

                <!-- Sidebar — Artistas Similares -->
                <div>
                    <h2 class="text-xl font-bold uppercase tracking-widest text-white mb-6">Similares</h2>
                    <div v-if="loadingSimilar" class="text-white/40 tracking-wider text-sm">Carregando...</div>
                    <div v-else class="flex flex-col gap-3">
                        <RouterLink v-for="similar in (similarData as any)?.similarartists?.artist?.slice(0, 10)"
                            :key="similar.name" :to="`/artist/${encodeURIComponent(similar.name)}`"
                            class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                            <div
                                class="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                <ArtistImage :artist-name="similar.name" />
                            </div>
                            <span
                                class="text-sm font-semibold text-white/60 group-hover:text-white transition-colors truncate">
                                {{ similar.name }}
                            </span>
                        </RouterLink>
                    </div>
                </div>

            </div>
        </div>

        <div v-else class="flex items-center justify-center py-32 text-white/40 tracking-wider">
            Artista não encontrado.
        </div>

    </div>
</template>