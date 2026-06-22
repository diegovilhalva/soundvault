import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Artist {
  name: string
  image: string
  url: string
}

interface Album {
  name: string
  artist: string
  image: string
  url: string
}

export const useFavoritesStore = defineStore('favorites', () => {
  const artists = ref<Artist[]>([])
  const albums = ref<Album[]>([])

  // Artists
  const isFavoriteArtist = computed(() => (name: string) =>
    artists.value.some(a => a.name === name)
  )

  function toggleArtist(artist: Artist) {
    const index = artists.value.findIndex(a => a.name === artist.name)
    if (index === -1) {
      artists.value.push(artist)
    } else {
      artists.value.splice(index, 1)
    }
  }

  // Albums
  const isFavoriteAlbum = computed(() => (name: string, artist: string) =>
    albums.value.some(a => a.name === name && a.artist === artist)
  )

  function toggleAlbum(album: Album) {
    const index = albums.value.findIndex(
      a => a.name === album.name && a.artist === album.artist
    )
    if (index === -1) {
      albums.value.push(album)
    } else {
      albums.value.splice(index, 1)
    }
  }

  return { artists, albums, isFavoriteArtist, toggleArtist, isFavoriteAlbum, toggleAlbum }
}, {
  persist: true
})