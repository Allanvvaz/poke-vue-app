<template>
  <div class="pokedex-container">
    <div class="pokedex-screen shadow">
      <div v-if="pokemon">
        <h2 class="pokemon-title">
          {{ pokemon.name }} <small>#{{ pokemon.id }}</small>
        </h2>

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
          <li v-for="move in pokemon.moves" :key="move.move.name">
            {{ move.move.name }}
          </li>
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

        <button @click="goBack" class="back-button">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PokemonPage",
  data() {
    return {
      pokemon: null,
      evolutions: []
    };
  },
  computed: {
    spriteUrls() {
      if (!this.pokemon) return [];
      const id = this.pokemon.id;
      const base =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

      return [
        `${base}${id}.png`,
        `${base}back/${id}.png`,
        `${base}shiny/${id}.png`,
        `${base}back/shiny/${id}.png`
      ];
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    const { id } = this.$route.params;
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    this.pokemon = res.data;

    const speciesRes = await axios.get(this.pokemon.species.url);
    const evoUrl = speciesRes.data.evolution_chain.url;
    const evoRes = await axios.get(evoUrl);

    const evoNames = [];
    let evo = evoRes.data.chain;
    do {
      evoNames.push(evo.species.name);
      evo = evo.evolves_to[0];
    } while (evo);

    this.evolutions = evoNames;
  }
};
</script>

<style scoped src="./styles/PokemonPage.css">

</style>
