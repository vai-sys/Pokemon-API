const BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonAPI = {
  async getAllPokemon(limit = 151) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    return response.json();
  },

  async getPokemonDetails(nameOrId) {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    return response.json();
  },

  async getPokemonSpecies(nameOrId) {
    const response = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
    return response.json();
  },

  async getPokemonByType(typeId) {
    const response = await fetch(`${BASE_URL}/type/${typeId}`);
    return response.json();
  }
};