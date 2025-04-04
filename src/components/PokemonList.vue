
<template>
    <div>
      <PokemonFilters @filter="applyFilters" />
      <div class="row">
        <div
          v-for="pokemon in filteredPokemons"
          :key="pokemon.name"
          class="col-md-3 mb-3"
        >
          <div class="card">
            <div class="card-body text-center">
              <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
              <router-link :to="`/pokemon/${pokemon.name}`" class="btn btn-primary">
                Detalhes
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <button v-if="nextUrl" @click="loadMore" class="btn btn-secondary w-100 mt-4">Carregar mais</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import PokemonFilters from './PokemonFilters.vue'
  
  export default {
    name: 'PokemonList',
    components: { PokemonFilters },
    data() {
      return {
        pokemons: [],
        nextUrl: 'https://pokeapi.co/api/v2/pokemon?limit=20',
        filters: {}
      }
    },
    computed: {
      filteredPokemons() {
        return this.pokemons.filter(pokemon => {
          const nameMatch = this.filters.name
            ? pokemon.name.includes(this.filters.name)
            : true
          const idMatch = this.filters.id
            ? pokemon.url.split('/')[6] === this.filters.id
            : true
          return nameMatch && idMatch
        })
      }
    },
    methods: {
      async loadMore() {
        if (!this.nextUrl) return
        const res = await axios.get(this.nextUrl)
        this.nextUrl = res.data.next
        this.pokemons.push(...res.data.results)
      },
      applyFilters(filters) {
        this.filters = filters
      }
    },
    mounted() {
      this.loadMore()
    }
  }
  </script>
  