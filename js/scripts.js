import pokemon from "../pokemonsObj.json" assert { type: "json" };
let limitCards = 12
let j = 0 
let searchStatus = false
let pokemonsOnScreen = []


createPokemons()

function createCards(arr, y, limit){     
    var cards = ""
    for (y ; y < limit; y++){
        // Create new cards and add pokemons
        cards += `<div id="pokemon-${arr[y].id}" class="pokemon-card animate__${randomAnimate()}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arr[y].id}.png" class="pokemon-image" alt="${arr[y].name}">
        <p class="pokemon-id">N° ${String(arr[y].id).padStart(4,'0')}</p>
        <p class="pokemon-name">${arr[y].name}</p>
        <div class="pokemon-type-container">${createTypes(arr[y].type)}</div>
        </div>`
        
        pokemonsOnScreen.push(arr[y])
        console.log(pokemonsOnScreen)
    }
    j = limitCards
    limitCards += 12   
    return cards
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
    elements.forEach((element) => {
            element.classList.remove(element.classList[1]);
    });
}


function randomAnimate(){
    let animateArr = ['backInLeft', 'backInDown', 'backInRight', 'backInUp']
    let id = Math.floor(Math.random() * animateArr.length)
    return animateArr[id]
}

function createPokemons(pokemons = pokemon, k = j, limit = limitCards, search = false){
    try {
        let cards = createCards(pokemons, k, limit)
        if(search || k < 12){
            document.querySelector('.pokemons-background').innerHTML = cards
        }else{
            document.querySelector('.pokemons-background').innerHTML += cards
        }
    }
    catch (error) {
        document.querySelector('.pokemons-background').innerHTML = '<p>ERROR! Unable to load pokemons./p>'
} finally{
        setTimeout(() => {
            removeAnimation() 
    }, 301);     
}
}

function buttonClick() {
    document.querySelector('#load-more-button').addEventListener("click", ()=> {
        createPokemons()
        const button = document.querySelector('#load-more-button')
        button.remove()
    })   
}
buttonClick()

window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if(!document.querySelector('#load-more-button') && !searchStatus){
            createPokemons()
        }
    }
}


function regexSearch(search){
    const searchObject = pokemon.filter((pokemon) => {
        switch (containsOnlyNumbers(search)){
            case true:
                return pokemon.id == search
            case false:
                return pokemon.name.toUpperCase().includes(search.toUpperCase())
        }
    });
    console.log(searchObject)
    return searchObject
}

function searchPokemon(){ 
    const search = document.querySelector('#search-bar').value
    if(search.trim().length){  
        const matches = regexSearch(search)
        searchStatus = true
        console.log(matches.length)
            if (matches.length){
                pokemonsOnScreen = []
                createPokemons(matches, 0, matches.length, searchStatus)
                const button = document.querySelector('#load-more-button')
                button.remove()              
            } else{
                document.querySelector('.pokemons-background').innerHTML = '<p>ERROR! Pokemon não existe.</p>'
            }
    }
    return
}     


document.querySelector('#search-button').addEventListener('click', () => {searchPokemon()})
document.querySelector('#search-bar').addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        searchPokemon()
    }
})

document.querySelector('.filter-list').addEventListener('change', () => {
    const filter = document.querySelector('.filter-list').value
    if(filter === 'Max'){
        if(!searchStatus){
        revertList(pokemon)
        }else{
        revertList(pokemonsOnScreen)
        }
    }
    }
)

function revertList(arr){
    if(!searchStatus){
    createPokemons(arr.reverse(), 0, 12,)
    } else{
        createPokemons(arr.reverse(), 0, arr.length, true)
    }
}

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}
