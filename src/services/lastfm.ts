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
    fetchLastfm({ method: 'artist.getinfo', artist ,lang:"pt"}),

  getSimilarArtists: (artist: string) =>
    fetchLastfm({ method: 'artist.getsimilar', artist, limit: '12',lang:"pt" }),

  getArtistTopTracks: (artist: string) =>
    fetchLastfm({ method: 'artist.gettoptracks', artist, limit: '10',lang:"pt" }),

  getArtistTopAlbums: (artist: string) =>
    fetchLastfm({ method: 'artist.gettopalbums', artist, limit: '8',lang:"pt" }),

  // Álbum
  getAlbumInfo: (artist: string, album: string) =>
    fetchLastfm({ method: 'album.getinfo', artist, album,lang:"pt" }),

  // Tag
  getTagInfo: (tag: string) =>
    fetchLastfm({ method: 'tag.getinfo', tag,lang:"pt" }),

  getTagTopArtists: (tag: string) =>
    fetchLastfm({ method: 'tag.gettopartists', tag, limit: '12',lang:"pt" }),

  getTagTopAlbums: (tag: string) =>
    fetchLastfm({ method: 'tag.gettopalbums', tag, limit: '12',lang:"pt" }),

  // Home
  getTopArtists: () =>
    fetchLastfm({ method: 'chart.gettopartists', limit: '12',lang:"pt" }),

  getTopTags: () =>
    fetchLastfm({ method: 'chart.gettoptags', limit: '12',lang:"pt" }),

  // Busca
  searchArtist: (artist: string) =>
    fetchLastfm({ method: 'artist.search', artist, limit: '8' }),
}