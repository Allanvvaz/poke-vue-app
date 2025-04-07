<template>
  <div class="pokedex-home">
    <PokemonList />
  </div>
</template>

<script>
import PokemonList from '../components/PokemonList.vue'

export default {
  name: 'HomeView',
  components: {
    PokemonList
  }
}
</script>

<style scoped>
.pokedex-home {
  background: radial-gradient(circle at top, #f44336, #b71c1c);
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
}

.pokedex-title {
  color: #ffe600;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px #000;
  letter-spacing: 2px;
  font-weight: bold;
}
</style>
