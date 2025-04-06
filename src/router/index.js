import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PokemonPage from '../views/PokemonPage.vue'
import PokemonSpecies from '../components/PokemonSpecies.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/pokemon/:id',
    name: 'PokemonPage',
    component: PokemonPage
  },
  {
    path: '/pokemon-species/:id',
    name: 'PokemonSpecies',
    component: PokemonSpecies
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
