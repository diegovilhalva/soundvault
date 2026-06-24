# SoundVault

App de descoberta musical construído com Vue 3 e TypeScript. Pesquise artistas, explore álbuns, navegue por gêneros e salve seus favoritos.

**[Demo ao vivo](https://soundvault-ten.vercel.app)**

![Vue 3](https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## Funcionalidades

- **Busca de artistas** — encontre qualquer artista e explore seu perfil, top tracks, discografia e artistas similares
- **Páginas de álbum** — tracklist completa com duração e tags de gênero
- **Exploração por gênero** — navegue pelos top artistas e álbuns de cada tag
- **Prévia de áudio** — 30 segundos de prévia das músicas via iTunes API
- **Favoritos** — salve artistas e álbuns localmente com persistência via Pinia
- **Responsivo** — totalmente adaptado para mobile e desktop

## Stack

- **Vue 3** com Composition API e `<script setup>`
- **TypeScript**
- **Vite**
- **Pinia** com `pinia-plugin-persistedstate` para favoritos persistentes
- **Vue Router**
- **Tailwind CSS v4**
- **Lucide Vue Next** para ícones

## APIs utilizadas

- [Last.fm API](https://www.last.fm/api) — informações de artistas, similares, top tracks, álbuns e tags
- [iTunes Search API](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/) — prévias de áudio de 30 segundos
- [Wikipedia REST API](https://www.mediawiki.org/wiki/API:Main_page) — imagens dos artistas

## Estrutura do projeto

```
src/
├── components/
│   └── common/         # AppHeader, AppFooter, ArtistImage, SkeletonCard, TrackItem
├── composables/
│   └── useLastfm.ts    # Composable genérico para gerenciar loading/error/data
├── pages/              # HomePage, ArtistPage, AlbumPage, TagPage, FavoritesPage
├── router/
├── services/
│   └── lastfm.ts       # Todas as chamadas à API do Last.fm centralizadas
└── stores/
    └── favorites.ts    # Pinia store para artistas e álbuns favoritos
```

## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/diegovilhalva/soundvault.git
cd soundvault

# Instale as dependências
npm install

# Crie o arquivo .env
cp .env.example .env
# Adicione sua chave da API do Last.fm em VITE_LASTFM_API_KEY

# Rode em desenvolvimento
npm run dev
```

## Variáveis de ambiente

```
VITE_LASTFM_API_KEY=sua_chave_aqui
```

Obtenha uma chave gratuita em [last.fm/api](https://www.last.fm/api/account/create).