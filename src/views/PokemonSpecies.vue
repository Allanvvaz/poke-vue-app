<template>
  <div class="species-container">
    <h1>Species Information</h1>
    <div v-if="species">
      <h2>
        {{ species.name }} <small>#{{ species.id }}</small>
      </h2>

      <div class="info-section">
        <h3>Basic Information</h3>
        <p><strong>Order:</strong> {{ species.order }}</p>
        <p><strong>Gender Rate:</strong> {{ genderRateText }}</p>
        <p><strong>Capture Rate:</strong> {{ species.capture_rate }}</p>
        <p><strong>Base Happiness:</strong> {{ species.base_happiness }}</p>
      </div>

      <div class="info-section">
        <h3>Classification</h3>
        <p>
          {{
            species.genera.find((g) => g.language.name === "en")?.genus ||
            "Unknown"
          }}
        </p>
      </div>

      <div class="info-section">
        <h3>Flags</h3>
        <p><strong>Is Baby:</strong> {{ species.is_baby ? "Yes" : "No" }}</p>
        <p>
          <strong>Is Legendary:</strong>
          {{ species.is_legendary ? "Yes" : "No" }}
        </p>
        <p>
          <strong>Is Mythical:</strong> {{ species.is_mythical ? "Yes" : "No" }}
        </p>
      </div>

      <button @click="$router.go(-1)" class="back-button">Voltar</button>
    </div>
    <div v-else>Loading species information...</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PokemonSpecies",
  data() {
    return {
      species: null
    };
  },
  computed: {
    genderRateText() {
      if (!this.species) return "Unknown";
      const rate = this.species.gender_rate;
      if (rate === -1) return "Genderless";
      const femalePercentage = (rate / 8) * 100;
      const malePercentage = 100 - femalePercentage;
      return `${malePercentage}% Male, ${femalePercentage}% Female`;
    }
  },
  async mounted() {
    const { id } = this.$route.params;
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
      );
      this.species = response.data;
    } catch (error) {
      console.error("Error fetching species data:", error);
    }
  }
};
</script>

<style scoped src="./styles/PokemonSpecies.css">

</style>
