<template>
  <main v-if="showMain">
    <img src="../images/pokedex.png" alt="pokedex" class="pokedex" />
    <img :src="pokemonImage" v-if="pokemonImage" alt="pokemon" class="pokemon__image" />

    <h1 class="pokemon__data">
      <span class="pokemon__number">{{ pokemon?.id }}</span> -
      <span class="pokemon__name">{{ pokemon?.name }}</span>
    </h1>

    <form @submit.prevent="handleSearch" class="form">
    <input type="search" v-model="search" class="input__search" placeholder="Name or Number" required />
  </form>   
    <div class="buttons">
      <button class="button btn-prev" @click="prevPokemon">Prev &lt;</button>
      <button class="button btn-next" @click="nextPokemon">Next &gt;</button>
    </div>
  </main>

  <div class="form_type" v-if="!showMain">
    <select v-model="selectedType" @change="fetchPokemonByType" class="input__search">
      <option value="">Select a Type</option>
      <option v-for="type in pokemonTypes" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
  </div>

  <div class="filter-buttons" v-if="!showMain">
    <button class="button filter-btn" @click="filtrar('bebe')">Bebês</button>
    <button class="button filter-btn" @click="filtrar('mitico')">Míticos</button>
    <button class="button filter-btn" @click="filtrar('lendario')">Lendários</button>
    <button class="button filter-btn" @click="resetarFiltro">Todos</button>
  </div>

  <section class="infinite-list">
    <div class="pokemon-card" v-for="p in pokemonListFiltrada" :key="p.name">
      <img :src="p.image" :alt="p.name" />
      <p>#{{ p.id }} - {{ p.name }}</p>
      <div class="pokemon-types">
        <span v-for="type in p.types" :key="type" class="type-badge" :class="'type-' + type">
          {{ type }}
        </span>
      </div>
    </div>
    <div v-if="typePagination.loading" class="loading-indicator">
      Carregando mais Pokémons...
    </div>
    <div v-if="isFilteringByType && typePagination.offset >= typePagination.total && typePagination.total > 0" class="end-of-list">
      Todos os Pokémons deste tipo foram carregados!
    </div>
  </section>

  <button @click="toggleMainLocal" class="toggle-button">
    {{ showMain ? "Hide Pokédex" : "Show Pokédex" }}
  </button>

  <div class="details-button-group" v-if="showMain">
    <button class="button btn-details" @click="goToDetails">Details 🔍</button>
    <button class="button btn-species" @click="fetchSpeciesInfo">Species Info 📘</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "PokemonPokedex",
  computed: {
    ...mapState("pokemon", [
      "search",
      "pokemon",
      "pokemonImage",
      "currentId",
      "search",
      "selectedType",
      "pokemonTypes",
      "filtroAtual",
      "pokemonList",
      "limit",
      "offset",
      "pokemonListByType",
      "currentTypeIndex",
      "isFilteringByType",
      "isLoading",
      "typePagination"
    ]),
    ...mapGetters("pokemon", ["pokemonListFiltrada"]),
    showMain() {
      return this.$data.localShowMain;
    }
  },
  data() {
    return {
      localShowMain: false // Controle local para alternar a visibilidade principal
    };
  },
  mounted() {
    this.fetchPokemon(this.currentId);
    this.fetchPokemonTypes();
    this.fetchPokemonList();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions("pokemon", [
      "searchPokemon",
      "fetchPokemon",
      "fetchPokemonTypes",
      "fetchPokemonList",
      "fetchPokemonByType",
      "nextPokemon",
      "prevPokemon",
      "searchPokemon",
      "filtrar",
      "resetarFiltro"
    ]),
    handleSearch() {
  const query = this.search?.toString().trim();
  if (!query) return;

  const normalizedQuery = isNaN(query) ? query.toLowerCase() : query;

  this.searchPokemon(normalizedQuery);
}
,
    toggleMainLocal() {
      this.localShowMain = !this.localShowMain;
    },
    goToDetails() {
      this.$router.push(`/pokemon/${this.currentId}`);
    },
    fetchSpeciesInfo() {
      this.$router.push(`/pokemon-species/${this.currentId}`);
    },
    handleScroll() {
      if (this.isLoading || (this.filtroAtual && !this.isFilteringByType)) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= fullHeight - 200) {
        if (this.isFilteringByType) {
          if (this.typePagination.offset < this.typePagination.total) {
            this.fetchPokemonByType();
          }
        } else {
          this.fetchPokemonList();
        }
      }
    }
  }
};
</script>

<style scoped>
main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.pokedex {
  width: 320px;
  max-width: 100%;
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.pokemon__image {
  position: fixed;
  top: 210px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  z-index: 10;
}

.pokemon__data {
  position: fixed;
  top: 315px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  text-align: center;
  width: 100%;
}

.form {
  position: fixed;
  top: 360px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  text-align: center;
}

.input__search {
  width: 200px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
}

.form_type {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 400px;
  left: 0;
  right: 0;
}

.buttons {
  display: flex;
  gap: 10px;
  position: fixed;
  top: 455px;
  left: 50%;
  transform: translateX(-50%);
}

.button {
  background-color: #444;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  border: 2px solid #000;
  cursor: pointer;
  box-shadow: -2px 3px 0 #222, -4px 6px 0 #000;
}

.details-button {
  position: fixed;
  top: 550px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button.btn-details {
  background-color: #3b4cca;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button.btn-details:hover {
  background-color: #2a3699;
  transform: scale(1.05);
}

.infinite-list {
  margin-top: 700px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  background-color: #f7f7f7;
  border-radius: 8px;
}

.pokemon-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  width: 120px;
}

.pokemon-types {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 5px;
}

.type-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
  text-transform: capitalize;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

.type-normal {
  background-color: #A8A878;
}

.type-fire {
  background-color: #F08030;
}

.type-water {
  background-color: #6890F0;
}

.type-electric {
  background-color: #F8D030;
}

.type-grass {
  background-color: #78C850;
}

.type-ice {
  background-color: #98D8D8;
}

.type-fighting {
  background-color: #C03028;
}

.type-poison {
  background-color: #A040A0;
}

.type-ground {
  background-color: #E0C068;
}

.type-flying {
  background-color: #A890F0;
}

.type-psychic {
  background-color: #F85888;
}

.type-bug {
  background-color: #A8B820;
}

.type-rock {
  background-color: #B8A038;
}

.type-ghost {
  background-color: #705898;
}

.type-dragon {
  background-color: #7038F8;
}

.type-dark {
  background-color: #705848;
}

.type-steel {
  background-color: #B8B8D0;
}

.type-fairy {
  background-color: #EE99AC;
}

.pokemon-card img {
  width: 80px;
}

.toggle-button {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #ffcb05;
  color: #3b4cca;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.button.btn-species {
  background-color: #ff7043;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-left: 10px;
}

.button.btn-species:hover {
  background-color: #e64a19;
  transform: scale(1.05);
}

.details-button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  top: 550px;
  left: 50%;
  transform: translateX(-50%);
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  position: absolute;
  top: 600px;
  left: 0;
  right: 0;
  flex-wrap: wrap;
  padding: 20px 0;
  z-index: 0;
}

.button.filter-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.button.filter-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: all 0.5s ease;
}

.button.filter-btn:hover::before {
  left: 100%;
}

.button.filter-btn:nth-child(1) {
  background-color: #444;
  color: white;
}

.button.filter-btn:nth-child(1):hover {
  background-color: #444;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(255, 209, 102, 0.3);
}

.button.filter-btn:nth-child(2) {
  background-color: #444;
  color: white;
}

.button.filter-btn:nth-child(2):hover {
  background-color: #444;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(167, 139, 250, 0.3);
}

.button.filter-btn:nth-child(3) {
  background-color: #444;
  color: white;
}

.button.filter-btn:nth-child(3):hover {
  background-color: #444;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(248, 113, 113, 0.3);
}

.button.filter-btn:nth-child(4) {
  background-color: #444;
  color: white;
}

.button.filter-btn:nth-child(4):hover {
  background-color: #444;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(79, 209, 197, 0.3);
}

.button.filter-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-indicator {
  width: 100%;
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}
.end-of-list {
  width: 100%;
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
  border-top: 1px solid #eee;
  margin-top: 10px;
}
</style>
