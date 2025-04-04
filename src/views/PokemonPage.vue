<template>
    <div v-if="pokemon">
      <h2 class="text-capitalize">{{ pokemon.name }} (ID: {{ pokemon.id }})</h2>
      <img :src="pokemon.sprites.front_default" alt="sprite" />
  
      <h4 class="mt-4">Sprites</h4>
      <div v-for="(sprite, index) in validSprites" :key="index">
  <img :src="sprite" :alt="'sprite-' + index" />
</div>

  
      <h4 class="mt-4">Movimentos de Ataque</h4>
      <ul>
        <li v-for="move in pokemon.moves" :key="move.move.name">
          {{ move.move.name }}
        </li>
      </ul>
  
      <h4 class="mt-4">Jogos</h4>
      <ul>
        <li v-for="game in pokemon.game_indices" :key="game.version.name">
          {{ game.version.name }}
        </li>
      </ul>
  
      <div v-if="evolutions.length">
        <h4 class="mt-4">Evoluções</h4>
        <ul>
          <li v-for="evo in evolutions" :key="evo">{{ evo }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'PokemonPage',
    data() {
      return {
        pokemon: null,
        evolutions: []
      }
    },
    computed: {
  validSprites() {
    const sprites = this.pokemon?.sprites || {}
    return Object.entries(sprites)
      .filter(([, val]) => typeof val === 'string' && val.includes('http'))
      .map(([, val]) => val)
  }
},

    async mounted() {
      const { id } = this.$route.params
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      this.pokemon = res.data
  
      const speciesRes = await axios.get(this.pokemon.species.url)
      const evoUrl = speciesRes.data.evolution_chain.url
      const evoRes = await axios.get(evoUrl)
  
      const evoNames = []
      let evo = evoRes.data.chain
      do {
        evoNames.push(evo.species.name)
        evo = evo.evolves_to[0]
      } while (evo)
  
      this.evolutions = evoNames
    }
  }
  </script>
  