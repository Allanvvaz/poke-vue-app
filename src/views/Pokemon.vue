/* eslint-disable vue/no-use-v-if-with-v-for */
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-multiple-template-root */
<template>
  <div class="container mt-4">
    <PokemonDetails />
  </div>
</template>

<script>
import PokemonDetails from '../components/PokemonDetails.vue'

export default {
  components: {
    PokemonDetails
  }
}
</script>
