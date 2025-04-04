

<template>
    <div class="col-md-3 mb-4">
      <div class="card text-center shadow-sm h-100" @click="goToDetails">
        <img :src="pokemonImageUrl" class="card-img-top p-4" alt="pokemon" />
        <div class="card-body">
          <h5 class="card-title text-capitalize">{{ name }}</h5>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'
  
  export default {
    props: ['name', 'url'],
    setup(props) {
      const router = useRouter()
  
      const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        props.url.split('/')[6]
      }.png`
  
      const goToDetails = () => {
        const id = props.url.split('/')[6]
        router.push(`/pokemon/${id}`)
      }
  
      return {
        pokemonImageUrl,
        goToDetails
      }
    }
  }
  </script>
  