<template>
  <main v-if="showMain">
    <img src="../images/pokedex.png" alt="pokedex" class="pokedex" />
    <img :src="pokemonImage" v-if="pokemonImage" alt="pokemon" class="pokemon__image" />

    <h1 class="pokemon__data">
      <span class="pokemon__number">{{ pokemon?.id }}</span> -
      <span class="pokemon__name">{{ pokemon?.name }}</span>
    </h1>

    <form @submit.prevent="searchPokemon" class="form">
      <input type="search" v-model="search" class="input__search" placeholder="Name or Number" required />
    </form>

    <div class="form_type">
      <select v-model="selectedType" @change="fetchPokemonByType" class="input__search">
        <option value="">Select a Type</option>
        <option v-for="type in pokemonTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="buttons">
      <button class="button btn-prev" @click="prevPokemon">Prev &lt;</button>
      <button class="button btn-next" @click="nextPokemon">Next &gt;</button>
    </div>
  </main>
  <div class="filter-buttons" v-if="!showMain">
    <button class="button filter-btn" @click="filtrar('bebe')">Bebês</button>
    <button class="button filter-btn" @click="filtrar('mitico')">
      Míticos
    </button>
    <button class="button filter-btn" @click="filtrar('lendario')">
      Lendários
    </button>
    <button class="button filter-btn" @click="resetarFiltro">Todos</button>
  </div>
  <section class="infinite-list">
    <div class="pokemon-card" v-for="pokemon in pokemonListFiltrada" :key="pokemon.name">
      <img :src="pokemon.image" :alt="pokemon.name" />
      <p>#{{ pokemon.id }} - {{ pokemon.name }}</p>
    </div>
  </section>

  <button @click="showMain = !showMain" class="toggle-button">
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
export default {
  name: "PokemonPokedex",
  data() {
    return {
      search: "",
      currentId: 1,
      pokemon: null,
      pokemonImage: "",
      pokemonTypes: [],
      selectedType: "",
      pokemonListByType: [],
      currentTypeIndex: 0,
      pokemonList: [],
      showMain: true,
      filtroAtual: null,

      limit: 20,
      offset: 0,
      isLoading: false
    };
  },
  computed: {
    pokemonListFiltrada() {
      if (!this.filtroAtual) return this.pokemonList;

      switch (this.filtroAtual) {
        case "bebe":
          return this.pokemonList.filter((p) => p.is_baby);
        case "mitico":
          return this.pokemonList.filter((p) => p.is_mythical);
        case "lendario":
          return this.pokemonList.filter((p) => p.is_legendary);
        default:
          return this.pokemonList;
      }
    }
  },
  methods: {
    filtrar(tipo) {
      this.filtroAtual = tipo;
      this.offset = 0;
      this.pokemonList = [];
      this.fetchPokemonList();

    },
    resetarFiltro() {
      this.filtroAtual = null;
      this.offset = 0;
      this.pokemonList = [];
      this.fetchPokemonList();
    },
    async fetchPokemon(pokemon) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    },

    async fetchSpeciesInfo() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${this.currentId}`
        );
        const data = await response.json();

        const especie = {
          id: data.id,
          nome: data.name,
          ordem: data.order,
          taxa_de_genero: data.gender_rate,
          taxa_de_captura: data.capture_rate,
          base_felicidade: data.base_happiness,
          e_bebe: data.is_baby,
          e_lendario: data.is_legendary,
          e_mitico: data.is_mythical
        };

        alert(`
📘 Species Info:
- Nome: ${especie.nome}
- Ordem: ${especie.ordem}
- Taxa de Gênero: ${especie.taxa_de_genero}
- Taxa de Captura: ${especie.taxa_de_captura}
- Felicidade Base: ${especie.base_felicidade}
- É Bebê? ${especie.e_bebe ? "Sim" : "Não"}
- É Lendário? ${especie.e_lendario ? "Sim" : "Não"}
- É Mítico? ${especie.e_mitico ? "Sim" : "Não"}
    `);
      } catch (error) {
        console.error("Erro ao buscar dados da species:", error);
        alert("Erro ao buscar informações da espécie.");
      }
    },

    async fetchPokemonList() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        let response;
        if (this.filtroAtual) {
          response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0`);
        } else {
          response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`
          );
        }

        const data = await response.json();

        const detailedPokemon = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            const pokeData = await res.json();

            const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}`);
            const speciesData = await speciesRes.json();

            return {
              name: pokeData.name,
              id: pokeData.id,
              image: pokeData.sprites.front_default,
              is_baby: speciesData.is_baby,
              is_mythical: speciesData.is_mythical,
              is_legendary: speciesData.is_legendary
            };
          })
        );

        if (this.filtroAtual) {
          this.pokemonList = this.aplicarFiltro(detailedPokemon);
        } else {
          this.pokemonList.push(...detailedPokemon);
          this.offset += this.limit;
        }
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
      } finally {
        this.isLoading = false;
      }
    },

    aplicarFiltro(lista) {
      switch (this.filtroAtual) {
        case "bebe":
          return lista.filter((p) => p.is_baby);
        case "mitico":
          return lista.filter((p) => p.is_mythical);
        case "lendario":
          return lista.filter((p) => p.is_legendary);
        default:
          return lista;
      }
    },

    async fetchPokemonTypes() {
      const response = await fetch(`https://pokeapi.co/api/v2/type/`);
      const data = await response.json();
      this.pokemonTypes = data.results.map((type) => type.name);
    },
    async fetchPokemonByType() {
      this.pokemonList = [];

      if (!this.selectedType) {
        this.pokemonList = [];
        this.offset = 0;
        this.fetchPokemonList();
        this.renderPokemon(this.currentId);
        return;
      }

      const response = await fetch(
        `https://pokeapi.co/api/v2/type/${this.selectedType}`
      );
      const data = await response.json();

      const pokemonNames = data.pokemon.map((p) => p.pokemon.name);
      const detailedList = await Promise.all(
        pokemonNames.map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const pokeData = await res.json();
          return {
            name: pokeData.name,
            id: pokeData.id,
            image: pokeData.sprites.front_default
          };
        })
      );

      this.pokemonList = detailedList;
      this.pokemonListByType = detailedList.map((p) => p.name);
      this.currentTypeIndex = 0;

      if (detailedList.length > 0) {
        this.renderPokemon(detailedList[0].name);
      }
    },
    goToDetails() {
      this.$router.push(`/pokemon/${this.currentId}`);
    },
    async renderPokemon(pokemon) {
      this.pokemon = null;
      this.pokemonImage = "";
      this.pokemon = await this.fetchPokemon(pokemon);
      if (this.pokemon) {
        this.pokemonImage =
          this.pokemon.sprites.versions?.["generation-v"]?.["black-white"]
            ?.animated?.front_default || this.pokemon.sprites.front_default;

        this.currentId = this.pokemon.id;
        this.search = "";
      }
    },
    searchPokemon() {
      this.selectedType = "";
      this.isFilteringByType = false;
      this.pokemonListByType = [];
      this.currentTypeIndex = 0;
      this.renderPokemon(this.search.toLowerCase());
    },

    prevPokemon() {
      if (this.selectedType && this.pokemonListByType.length > 0) {
        if (this.currentTypeIndex > 0) {
          this.currentTypeIndex--;
          this.renderPokemon(this.pokemonListByType[this.currentTypeIndex]);
        }
      } else if (this.currentId > 1) {
        this.currentId--;
        this.renderPokemon(this.currentId);
      }
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleScroll);
    },


    nextPokemon() {
      if (this.selectedType && this.pokemonListByType.length > 0) {
        if (this.currentTypeIndex < this.pokemonListByType.length - 1) {
          this.currentTypeIndex++;
          this.renderPokemon(this.pokemonListByType[this.currentTypeIndex]);
        }
      } else {
        this.currentId++;
        this.renderPokemon(this.currentId);
      }
    },
    handleScroll() {
      if (this.isLoading || this.filtroAtual) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= fullHeight - 200) {
        this.fetchPokemonList();
      }
    }
  },
  mounted() {
    this.renderPokemon(this.currentId);
    this.fetchPokemonTypes();
    window.addEventListener("scroll", this.handleScroll);
    this.fetchPokemonList();
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
  margin-top: 10px;
  position: fixed;
  top: 400px;
  left: 50%;
  transform: translateX(-50%);
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
</style>
