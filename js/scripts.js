import pokemon from "../pokemonsObj.json" assert { type: "json" };
let limitCards = 12
let j = 0 
let searchStatus = false
let reversedStatus = false
let pokemonsOnScreen = []
let filterStatus = false
createPokemons()

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
        document.querySelector('.pokemons-background').innerHTML = '<p>ERROR! Unable to load pokemons.</p>'
} finally{
        setTimeout(() => {
            removeAnimation() 
    }, 301);     
}
}

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
        if(!filterStatus){    
        pokemonsOnScreen.push(arr[y])
        }        
    }
    j = limitCards
    limitCards += 12   
    return cards
}


// Load more event listener
document.querySelector('#load-more-button').addEventListener("click", ()=> {
    createPokemons()
    const button = document.querySelector('#load-more-button')
    button.remove()
})   

// Load more on scroll
window.onscroll = function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if(!document.querySelector('#load-more-button') && !searchStatus){
            createPokemons()
        }
    }
}


function pokemonSearch(search){
    const searchObject = pokemon.filter((pokemon) => {       
        switch (containsOnlyNumbers(search)){
            case true:
                return pokemon.id == search
            case false:
                return pokemon.name.toUpperCase().includes(search.toUpperCase())
        }
    });
    return searchObject
}

function searchPokemon(){ 
    const search = document.querySelector('#search-bar').value
    if(search.trim().length){  
        const matches = pokemonSearch(search)
        searchStatus = true
            if (matches.length && !reversedStatus){
                pokemonsOnScreen = []
                filterStatus = false
                createPokemons(matches, 0, matches.length, searchStatus)
                const button = document.querySelector('#load-more-button')
                button.remove()              
            } else if (matches.length && reversedStatus){
                pokemonsOnScreen = []
                filterStatus = false
                // createPokemons(matches, 0, matches.length, searchStatus)
                matches.reverse()
                createPokemons(matches, 0, matches.length, searchStatus)
                const button = document.querySelector('#load-more-button')
                button.remove()                     
            }else {
            document.querySelector('.pokemons-background').innerHTML = '<p>ERROR! Pokemon não existe.</p>'
            }
            return
    }     
}


// Search button event listener
document.querySelector('#search-button').addEventListener('click', () => {searchPokemon()})
document.querySelector('#search-bar').addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        searchPokemon()
    }
})


// Select option event listener
document.querySelector('.filter-list').addEventListener('change', () => {
    const filter = document.querySelector('.filter-list').value
    limitCards = 12
    filterStatus = true
    console.log(filter)
    if(filter === 'Max'){
        if(!searchStatus){
            pokemon.sort(function(a , b){
                if(a.id > b.id) return -1;
                if(a.id < b.id) return 1;
                return 0;
            });
            createPokemons(pokemon, 0 , 12)
        }else{
            pokemonsOnScreen.reverse()
            createPokemons(pokemonsOnScreen, 0, pokemonsOnScreen.length, true)
        }
        reversedStatus = true
    }
    else if (filter === 'Min'){
        if(reversedStatus && !searchStatus){
            pokemon.sort(function(a , b){
                if(a.id > b.id) return 1;
                if(a.id < b.id) return -1;
                return 0;
            });
            createPokemons(pokemon, 0, 12)
        }else if (reversedStatus, searchStatus){
            pokemonsOnScreen.sort(function(a , b){
                if(a.id > b.id) return 1;
                if(a.id < b.id) return -1;
                return 0;
            })
            createPokemons(pokemonsOnScreen, 0, pokemonsOnScreen.length, true)           
        }
    reversedStatus = false  
    }
    // else if (filter === "a-z"){
    //     if(!searchStatus){
    //         pokemon.sort(function(a, b) {
    //             var textA = a.name.toUpperCase();
    //             var textB = b.name.toUpperCase();
    //             return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    //         });
    //         createPokemons(pokemon, 0, 12)
    //         reversedStatus = true
    //     }
    // }
    // else if (filter === 'z-a'){
    //     if(!searchStatus){
    //         pokemon.sort(function(a, b) {
    //             var textA = a.name.toUpperCase();
    //             var textB = b.name.toUpperCase();
    //             return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
    //         });
    //         createPokemons(pokemon, 0, 12)
    //         reversedStatus = true
    //     }
    // }
    else if (filter === 'a-z' || filter === 'z-a'){
        if(!searchStatus){
            pokemon.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                if(filter === 'a-z'){
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                }else{
                    return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
                }
            });
            createPokemons(pokemon, 0, 12)
            reversedStatus = true
        }
    }         
    }
)

// function revertList(arr){
//     let reversedList = arr.reverse()
//     return reversedList
// }

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
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
            element.classList.add('bounce')
    });
}


function randomAnimate(){
    let animateArr = ['backInLeft', 'backInDown', 'backInRight', 'backInUp']
    let id = Math.floor(Math.random() * animateArr.length)
    return animateArr[id]
}


const sortByProp = function(prop){
    return function(a,b){
      if(typeof a[prop] === 'number')
        return a[prop]-b[prop];
  
      return a[prop].localeCompare(b[prop]); 
    } 
  }