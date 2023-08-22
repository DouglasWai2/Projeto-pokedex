let i = 1
let limitPokemons = 1000
let limitCards = 12
let pokemonName = []  
let pokemonTypes = []  
let pokemonId = []
let pokemon = [] 
let j = 0 

async function getPokemon(num){     
        for(i ; i < num ; i++){     
            // Get pokemons from api 
                const response = await fetch (`https://pokeapi.co/api/v2/pokemon-form/${i}/`);
                const pokemons = await response.json();
                pokemonName.push(pokemons.name.charAt(0).toUpperCase() + pokemons.name.slice(1));
                pokemonTypes.push(getTypes(pokemons.types))
                pokemonId.push(i)                
                if (i === 12) {
                    createPokemons()
                }
        }
}


function createCards(arr){     
    var cards = ""
    for ( j ; j < limitCards; j++){
        // Create new cards and add pokemons
        cards += `<div id="pokemon-${arr.id[j]}" class="pokemon-card animate__${randomAnimate()}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arr.id[j]}.png" class="pokemon-image" alt="${arr.name[j]}">
        <p class="pokemon-id">N° ${String(arr.id[j]).padStart(4,'0')}</p>
        <p class="pokemon-name">${arr.name[j]}</p>
        <div class="pokemon-type-container">${createTypes(arr.type[j])}</div>
        </div>`         
    }
    limitCards += 12
    return cards
}

getPokemon(limitPokemons)

function getTypes(pokemonTypes){
    let types = []
    pokemonTypes.forEach((type) =>
    types.push(type.type.name)
    )
    return types
}

function createTypes(types){
    let pokemonType = ""
    types.forEach((type) => {
        pokemonType += `<span class="pokemon-type color-${type}">${type}</span>`
    })
    return pokemonType
}

function removeAnimation(){    
    let elements = document.querySelectorAll('[class^="pokemon-card animate"]')
    console.log(elements)
    elements.forEach((element) => {
            element.classList.remove(element.classList[1]);
    });
}


function randomAnimate(){
    let animateArr = ['backInLeft', 'backInDown', 'backInRight', 'backInUp']
    let id = Math.floor(Math.random() * animateArr.length)
    return animateArr[id]
}

function createPokemons(){
    try {
    pokemon = {
        name: pokemonName,
        type: pokemonTypes,
        id: pokemonId
    }
    console.log(pokemon)
    let cards = createCards(pokemon)
    document.querySelector('.pokemons-background').innerHTML += cards
    }
 catch (error) {
    document.querySelector('.pokemons-background').innerHTML = '<p>Deu erro caraio</p>'
} finally{
    setTimeout(() => {
        removeAnimation() 
    }, 301);     
}

}


addEventListener("scrollend", (event) => {})