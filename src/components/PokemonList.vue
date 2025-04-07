<template>
  <main v-if="showMain">
    <img src="../images/pokedex.png" alt="pokedex" class="pokedex" />
    <img
      :src="pokemonImage"
      v-if="pokemonImage"
      alt="pokemon"
      class="pokemon__image"
    />

    <h1 class="pokemon__data">
      <span class="pokemon__number">{{ pokemon?.id }}</span> -
      <span class="pokemon__name">{{ pokemon?.name }}</span>
    </h1>

    <form @submit.prevent="handleSearch" class="form">
      <input
        type="search"
        v-model="search"
        class="input__search"
        placeholder="Name or Number"
        required
      />
    </form>
    <div class="buttons">
      <button class="button btn-prev" @click="prevPokemon">Prev &lt;</button>
      <button class="button btn-next" @click="nextPokemon">Next &gt;</button>
    </div>
  </main>

  <div class="form_type" v-if="!showMain">
    <select
      v-model="localSelectedType"
      @change="onTypeChange"
      class="input__search"
    >
      <option value="">Select a Type</option>
      <option v-for="type in pokemonTypes" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
  </div>

  <div class="filter-buttons" v-if="!showMain">
    <button class="button filter-btn" @click="filtrar('bebe')">Bebês</button>
    <button class="button filter-btn" @click="filtrar('mitico')">
      Míticos
    </button>
    <button class="button filter-btn" @click="filtrar('lendario')">
      Lendários
    </button>
    <button class="button filter-btn" @click="resetarFiltro">Todos</button>
    <button class="button filter-btn reset-all" @click="resetAllFilters">
      Reset All
    </button>
  </div>

  <section class="infinite-list">
    <div class="pokemon-card" v-for="p in pokemonListFiltrada" :key="p.name">
      <img :src="p.image" :alt="p.name" />
      <p>#{{ p.id }} - {{ p.name }}</p>
      <div class="pokemon-types">
        <span
          v-for="type in p.types"
          :key="type"
          class="type-badge"
          :class="'type-' + type"
        >
          {{ type }}
        </span>
      </div>
    </div>
    <div v-if="typePagination.loading" class="loading-indicator"></div>
    <div
      v-if="
        isFilteringByType &&
        typePagination.offset >= typePagination.total &&
        typePagination.total > 0
      "
      class="end-of-list"
    ></div>
  </section>

  <button @click="toggleMainLocal" class="toggle-button">
    {{ showMain ? "Hide Pokédex" : "Show Pokédex" }}
  </button>

  <div class="details-button-group" v-if="showMain">
    <button class="button btn-details" @click="goToDetails">Details 🔍</button>
    <button class="button btn-species" @click="fetchSpeciesInfo">
      Species Info 📘
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "PokemonPokedex",
  computed: {
    ...mapState("pokemon", [
      "selectedType",
      "pokemon",
      "pokemonImage",
      "currentId",
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
    search: {
      get() {
        return this.$store.state.pokemon.search;
      },
      set(value) {
        this.$store.commit("pokemon/SET_SEARCH", value);
      }
    },

    ...mapGetters("pokemon", ["pokemonListFiltrada"]),
    showMain() {
      return this.$data.localShowMain;
    }
  },
  data() {
    return {
      localShowMain: false,
      localSelectedType: ""
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
      let query = this.search;
      if (query === null || query === undefined || query === "") return;
      query = query.toString().trim();
      const formattedQuery = isNaN(query) ? query.toLowerCase() : query;
      this.searchPokemon(formattedQuery);
    },
    toggleMainLocal() {
      this.localShowMain = !this.localShowMain;
    },
    goToDetails() {
      this.$router.push(`/pokemon/${this.currentId}`);
    },
    fetchSpeciesInfo() {
      this.$router.push(`/pokemon-species/${this.currentId}`);
    },
    onTypeChange() {
      this.$store.commit("pokemon/SET_SELECTED_TYPE", this.localSelectedType);
      this.fetchPokemonByType();
    },
    resetAllFilters() {
      this.localSelectedType = "";
      this.$store.commit("pokemon/SET_SELECTED_TYPE", "");

      this.resetarFiltro();

      this.$store.commit("pokemon/SET_IS_FILTERING_BY_TYPE", false);
      this.fetchPokemonList();
    },
    handleScroll() {
      if (this.isLoading || (this.filtroAtual && !this.isFilteringByType))
        return;

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

<style scoped src="./styles/pokemonList.css"></style>
