
<template>
    <div v-if="pokemonData" class="card shadow-lg p-4">
      <h2 class="text-capitalize">{{ pokemonData.name }} <small class="text-muted">#{{ pokemonData.id }}</small></h2>
  
      <!-- Sprites -->
      <div class="row mb-4">
        <h5>Sprites:</h5>
        <div v-for="(sprite, key) in validSprites" :key="key" class="col-3 text-center">
          <img :src="sprite" class="img-fluid" :alt="key" />
          <small>{{ key }}</small>
        </div>
      </div>
  
      <!-- Movimentos -->
      <div class="mb-4">
        <h5>Movimentos de Ataque:</h5>
        <ul class="list-group list-group-flush">
          <li v-for="move in pokemonData.moves" :key="move.move.name" class="list-group-item text-capitalize">
            {{ move.move.name }}
          </li>
        </ul>
      </div>
  
      <!-- Jogos -->
      <div class="mb-4">
        <h5>Presente nos jogos:</h5>
        <span class="badge bg-primary m-1 text-uppercase" v-for="game in pokemonData.game_indices" :key="game.version.name">
          {{ game.version.name }}
        </span>
      </div>
  
      <!-- Evoluções -->
      <div v-if="evolutions.length" class="mb-3">
        <h5>Evoluções:</h5>
        <ul class="list-group list-group-flush">
          <li v-for="evo in evolutions" :key="evo" class="list-group-item text-capitalize">{{ evo }}</li>
        </ul>
      </div>
    </div>
  
    <div v-else>
      <p>Carregando...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  export default {
    setup() {
      const route = useRoute()
      const pokemonData = ref(null)
      const evolutions = ref([])
      const validSprites = ref({})
  
      const fetchPokemonDetails = async () => {
        const id = route.params.id
  
        // 1. Dados principais
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        pokemonData.value = data
  
        // 2. Sprites válidos
        validSprites.value = Object.entries(data.sprites)
          .filter(([key, value]) => typeof value === 'string' && value)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
  
        // 3. Espécie (para pegar evolução)
        const speciesRes = await axios.get(data.species.url)
        const evoChainUrl = speciesRes.data.evolution_chain.url
  
        // 4. Cadeia de evolução
        const evoRes = await axios.get(evoChainUrl)
        const chain = evoRes.data.chain
        extractEvolutions(chain)
      }
  
      const extractEvolutions = (chain) => {
        evolutions.value = []
        let current = chain
  
        while (current) {
          evolutions.value.push(current.species.name)
          current = current.evolves_to[0]
        }
      }
  
      onMounted(fetchPokemonDetails)
  
      return {
        pokemonData,
        evolutions,
        validSprites
      }
    }
  }
  </script>
  