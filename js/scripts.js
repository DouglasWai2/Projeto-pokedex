async function getPokemon(){
const response = await fetch ("https://pokeapi.co/api/v2/pokemon-form/1/");
const pokemons = await response.json();
console.log(pokemons);
const pokemonName = pokemons.name
console.log(pokemonName)
}