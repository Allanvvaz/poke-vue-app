
<template>
    <div class="mb-3">
      <input v-model="name" @input="emitFilter" class="form-control mb-2" placeholder="Filtrar por nome" />
      <input v-model="id" @input="emitFilter" class="form-control mb-2" placeholder="Filtrar por ID" />
      <input v-model="type" @input="emitFilter" class="form-control mb-2" placeholder="Filtrar por tipo" />
      <input v-model="species" @input="emitFilter" class="form-control mb-2" placeholder="Filtrar por espécie" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'PokemonFilters',
    emits: ['filter'],
    data() {
      return {
        name: '',
        id: '',
        type: '',
        species: ''
      }
    },
    methods: {
      emitFilter() {
        this.$emit('filter', {
          name: this.name.toLowerCase(),
          id: this.id,
          type: this.type.toLowerCase(),
          species: this.species.toLowerCase()
        })
      }
    }
  }
  </script>
  