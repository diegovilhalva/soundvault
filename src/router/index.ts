import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ArtistPage from '../pages/ArtistPage.vue'
import AlbumPage from '../pages/AlbumPage.vue'
import TagPage from '../pages/TagPage.vue'
import FavoritesPage from '../pages/FavoritesPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/artist/:name', component: ArtistPage },
    { path: '/album/:artist/:album', component: AlbumPage },
    { path: '/tag/:name', component: TagPage },
    { path: '/favorites', component: FavoritesPage },
  ],
})

export default router