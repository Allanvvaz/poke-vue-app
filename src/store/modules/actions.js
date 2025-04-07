export default {
  async fetchPokemon({ commit }, pokemon) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      );
      if (response.ok) {
        const data = await response.json();
        commit("SET_POKEMON", data);
        const image =
          data.sprites.versions?.["generation-v"]?.["black-white"]?.animated
            ?.front_default || data.sprites.front_default;
        commit("SET_POKEMON_IMAGE", image);
        commit("SET_CURRENT_ID", data.id);
        commit("SET_SEARCH", "");
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      return null;
    }
  },

  async fetchPokemonTypes({ commit }) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/`);
      const data = await response.json();
      commit(
        "SET_POKEMON_TYPES",
        data.results.map((type) => type.name)
      );
    } catch (error) {
      console.error("Error fetching Pokémon types:", error);
    }
  },

  async fetchPokemonList({ commit, state }) {
    if (state.isLoading) return;
    commit("SET_IS_LOADING", true);

    try {
      let url;
      if (state.filtroAtual) {
        url = `https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0`;
      } else {
        url = `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.offset}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          const pokeData = await res.json();
          const speciesRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}`
          );
          const speciesData = await speciesRes.json();
          return {
            name: pokeData.name,
            id: pokeData.id,
            image: pokeData.sprites.front_default,
            is_baby: speciesData.is_baby,
            is_mythical: speciesData.is_mythical,
            is_legendary: speciesData.is_legendary,
            types: pokeData.types.map((t) => t.type.name)
          };
        })
      );

      if (state.filtroAtual) {
        let filtered;
        switch (state.filtroAtual) {
          case "bebe":
            filtered = detailedPokemon.filter((p) => p.is_baby);
            break;
          case "mitico":
            filtered = detailedPokemon.filter((p) => p.is_mythical);
            break;
          case "lendario":
            filtered = detailedPokemon.filter((p) => p.is_legendary);
            break;
          default:
            filtered = detailedPokemon;
        }
        commit("SET_POKEMON_LIST", filtered);
      } else {
        commit("ADD_TO_POKEMON_LIST", detailedPokemon);
        commit("INCREMENT_OFFSET");
      }
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
    } finally {
      commit("SET_IS_LOADING", false);
    }
  },

  async fetchPokemonByType({ commit, state, dispatch }) {
    if (!state.selectedType) {
      commit("SET_IS_FILTERING_BY_TYPE", false);
      commit("SET_POKEMON_LIST", []);
      commit("RESET_TYPE_PAGINATION");
      return;
    }
    if (
      state.typePagination.loading ||
      (state.typePagination.offset >= state.typePagination.total &&
        state.typePagination.total > 0)
    ) {
      return;
    }

    commit("SET_IS_FILTERING_BY_TYPE", true);
    commit("UPDATE_TYPE_PAGINATION", { key: "loading", value: true });

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/type/${state.selectedType}`
      );
      const data = await response.json();
      commit("UPDATE_TYPE_PAGINATION", {
        key: "total",
        value: data.pokemon.length
      });
      const paginatedPokemons = data.pokemon.slice(
        state.typePagination.offset,
        state.typePagination.offset + state.typePagination.limit
      );
      const detailedList = await Promise.all(
        paginatedPokemons.map(async (p) => {
          const pokemonId = p.pokemon.url.split("/").slice(-2, -1)[0];
          const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
          );
          const pokeData = await res.json();
          const speciesRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
          );
          const speciesData = await speciesRes.json();
          return {
            name: pokeData.name,
            id: pokeData.id,
            image: pokeData.sprites.front_default,
            types: pokeData.types.map((t) => t.type.name),
            is_baby: speciesData.is_baby,
            is_mythical: speciesData.is_mythical,
            is_legendary: speciesData.is_legendary
          };
        })
      );

      if (state.typePagination.offset === 0) {
        commit("SET_POKEMON_LIST", detailedList);
      } else {
        commit("ADD_TO_POKEMON_LIST", detailedList);
      }

      commit(
        "SET_POKEMON_LIST_BY_TYPE",
        state.pokemonList.map((p) => p.id)
      );
      commit("SET_CURRENT_TYPE_INDEX", 0);

      if (detailedList.length > 0 && state.typePagination.offset === 0) {
        await dispatch("fetchPokemon", detailedList[0].id);
      }

      commit("UPDATE_TYPE_PAGINATION", {
        key: "offset",
        value: state.typePagination.offset + state.typePagination.limit
      });
    } catch (error) {
      console.error("Error fetching Pokémon by type:", error);
    } finally {
      commit("UPDATE_TYPE_PAGINATION", { key: "loading", value: false });
    }
  },

  nextPokemon({ commit, state, dispatch, getters }) {
    if (state.selectedType && state.isFilteringByType) {
      if (
        state.currentTypeIndex === getters.pokemonListFiltrada.length - 1 &&
        state.typePagination.offset < state.typePagination.total
      ) {
        return dispatch("fetchPokemonByType").then(() => {
          if (state.currentTypeIndex < getters.pokemonListFiltrada.length - 1) {
            commit("SET_CURRENT_TYPE_INDEX", state.currentTypeIndex + 1);
            dispatch(
              "fetchPokemon",
              getters.pokemonListFiltrada[state.currentTypeIndex].id
            );
          }
        });
      } else if (
        state.currentTypeIndex <
        getters.pokemonListFiltrada.length - 1
      ) {
        commit("SET_CURRENT_TYPE_INDEX", state.currentTypeIndex + 1);
        dispatch(
          "fetchPokemon",
          getters.pokemonListFiltrada[state.currentTypeIndex].id
        );
      }
    } else {
      commit("SET_CURRENT_ID", state.currentId + 1);
      dispatch("fetchPokemon", state.currentId);
    }
  },

  prevPokemon({ commit, state, dispatch, getters }) {
    if (state.selectedType && state.isFilteringByType) {
      if (state.currentTypeIndex > 0) {
        commit("SET_CURRENT_TYPE_INDEX", state.currentTypeIndex - 1);
        dispatch(
          "fetchPokemon",
          getters.pokemonListFiltrada[state.currentTypeIndex].id
        );
      }
    } else if (state.currentId > 1) {
      commit("SET_CURRENT_ID", state.currentId - 1);
      dispatch("fetchPokemon", state.currentId);
    }
  },

  async searchPokemon({ commit, dispatch }, searchTerm) {
    if (!searchTerm) {
      console.error("searchTerm inválido:", searchTerm);
      return;
    }

    commit("SET_SELECTED_TYPE", "");
    commit("SET_IS_FILTERING_BY_TYPE", false);
    commit("SET_POKEMON_LIST_BY_TYPE", []);
    commit("SET_CURRENT_TYPE_INDEX", 0);

    dispatch("fetchPokemon", searchTerm);
  },

  filtrar({ commit, dispatch }, tipo) {
    commit("SET_FILTRO_ATUAL", tipo);
    commit("SET_OFFSET", 0);
    commit("SET_POKEMON_LIST", []);
    dispatch("fetchPokemonList");
  },

  resetarFiltro({ commit, dispatch }) {
    commit("SET_FILTRO_ATUAL", null);
    commit("SET_OFFSET", 0);
    commit("SET_POKEMON_LIST", []);
    dispatch("fetchPokemonList");
  },

  toggleMainView({ commit, state }) {
    commit("SET_SHOW_MAIN", !state.showMain);
  }
};
