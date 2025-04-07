export default {
    pokemonListFiltrada: (state) => {
      let filteredList = state.pokemonList;
  
      if (state.selectedType && state.isFilteringByType) {
        filteredList = filteredList.filter(pokemon =>
          pokemon.types.includes(state.selectedType)
        );
      }
  
      if (state.filtroAtual) {
        switch (state.filtroAtual) {
          case "bebe":
            filteredList = filteredList.filter(pokemon => pokemon.is_baby);
            break;
          case "mitico":
            filteredList = filteredList.filter(pokemon => pokemon.is_mythical);
            break;
          case "lendario":
            filteredList = filteredList.filter(pokemon => pokemon.is_legendary);
            break;
        }
      }
  
      return filteredList;
    }
  };
  