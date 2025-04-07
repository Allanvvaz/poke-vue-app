export default {
    pokemon: null,
    pokemonImage: "",
    currentId: 1,
    search: "",
    selectedType: "",
    pokemonTypes: [],
    filtroAtual: null,
    pokemonList: [],
    limit: 20,
    offset: 0,
    pokemonListByType: [],
    currentTypeIndex: 0,
    isFilteringByType: false,
    isLoading: false,
    typePagination: {
      limit: 20,
      offset: 0,
      total: 0,
      loading: false,
    }
  };
  