<template>
    <div class="pokedex-container">
      <div class="pokedex-screen shadow">
        <div v-if="pokemon">
          <h2 class="pokemon-title">{{ pokemon.name }} <small>#{{ pokemon.id }}</small></h2>
  
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
            alt="sprite"
            class="main-sprite"
          />
  
          <h4 class="section-title">Sprites</h4>
          <div class="sprite-grid">
            <img
              v-for="(sprite, i) in spriteUrls"
              :key="i"
              :src="sprite"
              class="sprite"
            />
          </div>
  
          <h4 class="section-title">Ataques</h4>
          <ul class="list">
            <li v-for="move in pokemon.moves" :key="move.move.name">{{ move.move.name }}</li>
          </ul>
  
          <h4 class="section-title">Jogos</h4>
          <div class="badge-grid">
            <span
              v-for="game in pokemon.game_indices"
              :key="game.version.name"
              class="badge"
            >
              {{ game.version.name }}
            </span>
          </div>
  
          <div v-if="evolutions.length">
            <h4 class="section-title">Evoluções</h4>
            <ul class="list">
              <li v-for="evo in evolutions" :key="evo">{{ evo }}</li>
            </ul>
          </div>
        </div>
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
      spriteUrls() {
        if (!this.pokemon) return []
        const id = this.pokemon.id
        const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'
  
        return [
          `${base}${id}.png`,
          `${base}back/${id}.png`,
          `${base}shiny/${id}.png`,
          `${base}back/shiny/${id}.png`,
         
        ]
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
  
  <style scoped>
  .pokedex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    min-height: 100vh;
    background: radial-gradient(circle, #f44336 0%, #b71c1c 100%);
    font-family: 'Arial', sans-serif;
    color: #fff;
  }
  
  .pokedex-screen {
    background: #f5f5f5;
    border: 8px solid #212121;
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 600px;
    background: linear-gradient(to bottom, #ffffff, #f0f0f0);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    color: #212121;
  }
  
  .pokemon-title {
    text-transform: capitalize;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #d32f2f;
  }
  
  .main-sprite {
    display: block;
    margin: 0 auto 2rem;
    width: 150px;
    height: auto;
    image-rendering: pixelated;
  }
  
  .section-title {
    font-size: 1.4rem;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    border-bottom: 2px solid #d32f2f;
    display: inline-block;
    color: #d32f2f;
  }
  
  .sprite-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .sprite {
    width: 64px;
    height: 64px;
    object-fit: contain;
    image-rendering: pixelated;
    background: #eeeeee;
    border-radius: 8px;
    padding: 4px;
    border: 1px solid #ccc;
  }
  
.list li {
  background-color: #fff;
  color: #212121;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: center;
  text-transform: capitalize;
  transition: transform 0.2s ease;
}

.list li:hover {
  transform: scale(1.05);
  background-color: #fce4ec;
}

.section-title {
  font-size: 1.4rem;
  margin-top: 2rem;
  margin-bottom: 0.8rem;
  border-bottom: 2px solid #d32f2f;
  display: inline-block;
  color: #d32f2f;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 0.5rem;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
}

  .badge-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 1rem;
  }
  
  .badge {
    background-color: #d32f2f;
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  </style>
  