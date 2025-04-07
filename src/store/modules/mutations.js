export default {
    SET_POKEMON(state, pokemon) {
      state.pokemon = pokemon;
    },
    SET_POKEMON_IMAGE(state, image) {
      state.pokemonImage = image;
    },
    SET_CURRENT_ID(state, id) {
      state.currentId = id;
    },
    SET_SEARCH(state, value) {
      state.search = value;
    },
    SET_SELECTED_TYPE(state, type) {
      state.selectedType = type;
    },
    SET_POKEMON_TYPES(state, types) {
      state.pokemonTypes = types;
    },
    SET_FILTRO_ATUAL(state, filtro) {
      state.filtroAtual = filtro;
    },
    SET_POKEMON_LIST(state, list) {
      state.pokemonList = list;
    },
    ADD_TO_POKEMON_LIST(state, newPokemons) {
      state.pokemonList.push(...newPokemons);
    },
    SET_POKEMON_LIST_BY_TYPE(state, list) {
      state.pokemonListByType = list;
    },
    SET_CURRENT_TYPE_INDEX(state, index) {
      state.currentTypeIndex = index;
    },
    SET_IS_FILTERING_BY_TYPE(state, value) {
      state.isFilteringByType = value;
    },
    SET_IS_LOADING(state, value) {
      state.isLoading = value;
    },
    UPDATE_TYPE_PAGINATION(state, { key, value }) {
      state.typePagination[key] = value;
    },
    INCREMENT_OFFSET(state) {
      state.offset += state.limit;
    },
    SET_OFFSET(state, value) {
      state.offset = value;
    },
    RESET_TYPE_PAGINATION(state) {
      state.typePagination.offset = 0;
    }
  };
  