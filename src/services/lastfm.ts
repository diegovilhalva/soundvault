const API_KEY = import.meta.env.VITE_LASTFM_API_KEY
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

async function fetchLastfm(params: Record<string, string>) {
  const url = new URL(BASE_URL)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('format', 'json')

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.status}`)
  }

  return response.json()
}

export const lastfm = {
  // Artista
  getArtistInfo: (artist: string) =>
    fetchLastfm({ method: 'artist.getinfo', artist }),

  getSimilarArtists: (artist: string) =>
    fetchLastfm({ method: 'artist.getsimilar', artist, limit: '12' }),

  getArtistTopTracks: (artist: string) =>
    fetchLastfm({ method: 'artist.gettoptracks', artist, limit: '10' }),

  getArtistTopAlbums: (artist: string) =>
    fetchLastfm({ method: 'artist.gettopalbums', artist, limit: '8' }),

  // Álbum
  getAlbumInfo: (artist: string, album: string) =>
    fetchLastfm({ method: 'album.getinfo', artist, album }),

  // Tag
  getTagInfo: (tag: string) =>
    fetchLastfm({ method: 'tag.getinfo', tag }),

  getTagTopArtists: (tag: string) =>
    fetchLastfm({ method: 'tag.gettopartists', tag, limit: '12' }),

  getTagTopAlbums: (tag: string) =>
    fetchLastfm({ method: 'tag.gettopalbums', tag, limit: '12' }),

  // Home
  getTopArtists: () =>
    fetchLastfm({ method: 'chart.gettopartists', limit: '12' }),

  getTopTags: () =>
    fetchLastfm({ method: 'chart.gettoptags', limit: '12' }),

  // Busca
  searchArtist: (artist: string) =>
    fetchLastfm({ method: 'artist.search', artist, limit: '8' }),
}