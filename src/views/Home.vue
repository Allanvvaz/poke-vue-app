
<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Pokédex</h1>
    <PokemonList />
  </div>
</template>

<script>
import PokemonList from '@/components/PokemonList.vue'

export default {
  name: 'HomeView',
  components: {
    PokemonList
  }
}
</script>
