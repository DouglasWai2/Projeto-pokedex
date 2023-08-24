import pokemonDB from "../pokemonsObjAll.json" assert { type: "json" };
let limitCards = 12
let j = 0 
let searchStatus = false
let pokemonsOnScreen = []
let filterStatus = false
let currentStatus = ''
const uniqueIds = [];
let pokemon = pokemonDB.filter(element => {
  const isDuplicate = uniqueIds.includes(element.id);

  if (!isDuplicate) {
    uniqueIds.push(element.id);

    return true;
  }

  return false;
});

console.log(pokemon)

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
        console.log(error)
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
            if (matches.length && currentStatus === ''){
                pokemonsOnScreen = []
                createPokemons(matches, 0, matches.length, searchStatus)
                const button = document.querySelector('#load-more-button')
                button.remove()              
            }else if (matches.length && currentStatus.length){
                pokemonsOnScreen = []
                if(currentStatus === 'a-z' || currentStatus === 'z-a'){
                    if(currentStatus === 'a-z'){
                        matches.sort(byNameAlpha)   
                    }else{
                        matches.sort(byNameAlpha).reverse()    
                    }           
                }else if(currentStatus === 'Max' || currentStatus === 'Min'){
                    if(currentStatus === 'Max'){
                        matches.sort(byIdOrder).reverse()
                    }else{
                        matches.sort(byIdOrder)  
                    }           
                }
                filterStatus = false
                createPokemons(matches, 0, matches.length, searchStatus)
                const button = document.querySelector('#load-more-button')
                button.remove()             
            }else {
                document.querySelector('.pokemons-background').innerHTML = '<p>ERROR! Pokemon não existe.</p>'
            }
            
    }else {
        location.reload()
    }
}


// Search button event listener
document.querySelector('#search-button').addEventListener('click', () => {searchPokemon()})
document.querySelector('#search-bar').addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        searchPokemon()
    }
})


// Filter event listener
document.querySelector('#list-filter').addEventListener('change', () => {
    const filter = document.querySelector('#list-filter').value;
    limitCards = 12;
    filterStatus = true
    currentStatus = filter;
    console.log(currentStatus);
    if(filter === 'Max' || filter === 'Min'){      
        if(!searchStatus){
            if(filter === 'Max'){
                pokemon.sort(byIdOrder).reverse();
            }else{
                pokemon.sort(byIdOrder);
            }
            createPokemons(pokemon, 0 , 12);
        }else{
            if(filter === 'Max'){
                pokemonsOnScreen.sort(byIdOrder).reverse();
            }else{
                pokemonsOnScreen.sort(byIdOrder);
            }
            createPokemons(pokemonsOnScreen, 0, pokemonsOnScreen.length, true)
        }
    }else if (filter === 'a-z' || filter === 'z-a'){
        if(!searchStatus){
            if(filter === 'a-z'){
                pokemon.sort(byNameAlpha)
            }else{
                pokemon.sort(byNameAlpha).reverse()
            }
            createPokemons(pokemon, 0, 12)
        }else{
            if(filter === 'a-z'){
                pokemonsOnScreen.sort(byNameAlpha)
            }else{
                pokemonsOnScreen.sort(byNameAlpha).reverse()
            }
            createPokemons(pokemonsOnScreen, 0, pokemonsOnScreen.length)
        }
    }         
})


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



// Sort function
const sortByProp = function(prop){
    return function(a,b){
      if(typeof a[prop] === 'number')
        return a[prop]-b[prop];
  
      return a[prop].localeCompare(b[prop]); 
    } 
}

const byName = sortByProp('name')
const byId = sortByProp('id')

const byNameAlpha = function(a,b) {
    return byName (a, b)
}

const byIdOrder = function (a,b) {
    return byId (a,b)
}

document.querySelector('.advanced-search-bar').addEventListener('click', () => {
    const advancedSearchButton = document.querySelector('#advanced-search-text')
    const filterBarContainer = document.querySelector('.advanced-search-container')
    filterBarContainer.classList.remove('contract')
    filterBarContainer.classList.remove('desappear')
    const advancedSearch = document.querySelector('.advanced-search p').innerHTML
    if(advancedSearch === 'Mostrar busca avançada'){
    var filterBar = `<div class="advanced-search-options container appear">
    <div class="advanced-search-left">
        <table class="advanced-search-table container">
            <thead class="advanced-search-title">
                <div>
                    <tr id="table-header">
                        <th id="title-1" colspan="2">Tipo e Fraqueza</th>
                        <th id="title-2" colspan="2">T = Tipo F = Fraqueza</th>
                    </tr>
                </div>
            </thead>
            <tbody>

                <tr class="advanced-search-row">
                    <td class="color-bug" id="pokemon-type-filter">
                        <span id="">Bug</span>
                    </td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="bug" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="bug" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-dark" id="pokemon-type-filter"><span id="">Dark</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="dark" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="dark" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>

                </tr>
                <tr class="advanced-search-row">
                    <td class="color-dragon" id="pokemon-type-filter"><span id="">Dragon</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="dragon" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="dragon" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-electric" id="pokemon-type-filter"><span id="">Electric</span>
                    </td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="electric" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="electric" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-fairy" id="pokemon-type-filter"><span id="">Fairy</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="fairy" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="fairy" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-fighting" id="pokemon-type-filter"><span id="">Fighting</span>
                    </td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="fighting" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="fighting" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-fire" id="pokemon-type-filter"><span id="">Fire</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="fire" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="fire" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-flying" id="pokemon-type-filter"><span id="">flying</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="flying" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="flying" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-ghost" id="pokemon-type-filter"><span id="">ghost</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="ghost" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="ghost" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-grass" id="pokemon-type-filter"><span id="">grass</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="grass" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="grass" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-ground" id="pokemon-type-filter"><span id="">ground</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="ground" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="ground" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-ice" id="pokemon-type-filter"><span id="">ice</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="ice" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="ice" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-normal" id="pokemon-type-filter"><span id="">normal</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="normal" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="normal" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-poison" id="pokemon-type-filter"><span id="">poison</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="poison" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="poison" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-psychic" id="pokemon-type-filter"><span id="">psychic</span>
                    </td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="psychic" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="psychic" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-rock" id="pokemon-type-filter"><span id="">rock</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="rock" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="rock" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-steel" id="pokemon-type-filter"><span id="">steel</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="steel" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="steel" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                    <td class="color-water" id="pokemon-type-filter"><span id="">water</span></td>
                    <td id="advanced-search-checkbox">
                        <label class="input-container">
                            <input id="type" value="water" class="checkbox-round" type="checkbox">
                            <input id="weakness" value="water" class="checkbox-round" type="checkbox">
                                                        <span class="checkmark type">T</span>
                            <span class="checkmark-weakness">F</span>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="advanced-search-right">
        <div class="by-ability">
            <p class="advanced-search-label">Habilidade</p>
            <label class="filter-list-icon bigger" for="filter-list">
                <img src="./assets/icons8-pokeball-50.png" alt="pikachu-icon">
                <select class="filter-list ability" name="ability"></select></label>
        </div>
        <p class="advanced-search-label">Altura</p>
        <div class="by-height">           
            <div class="checkbox-image-container">
                <img src="../assets/033.png" alt="low-height">         
                <input name="test" class="checkbox-characteristics" type="checkbox" value="short">
            </div>
            <div class="checkbox-image-container">
            <img src="../assets/148.png" alt="medium-height">
            <input class="checkbox-characteristics" type="checkbox" value="medium height">
            </div>
            <div class="checkbox-image-container">
            <img src="../assets/384.png" alt="tall-height">
            <input class="checkbox-characteristics" type="checkbox" value="tall">
            </div>
        </div>
        <p class="advanced-search-label">Peso</p>
        <div class="by-weight">       
            <div class="checkbox-image-container">
            <img class="circles circle-1" src="../assets/9023402_circles_three_fill_icon.png" alt="low-weight">
            <input class="checkbox-characteristics" type="checkbox" value="light">
            </div>
            <div class="checkbox-image-container">
            <img class="circles circle-2" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <img class="circles circle-3" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <img class="circles circle-4" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <input class="checkbox-characteristics" type="checkbox" value="medium weight">
            </div>
            <div class="checkbox-image-container">
            <img class="circles circle-5" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-6" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-7" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-8" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-9" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <input class="checkbox-characteristics" type="checkbox" valuie="">
            </div>
        </div>
    </div>
</div>
<div class="advanced-search-footer container">
    <div class="interval">
        <p>Intervalo de números</p>
        <input class="interval-input" type="number" placeholder="1">
        <span>-</span>
        <input class="interval-input" type="number" placeholder="1010">
    </div>
    <div class="filter-buttons">
        <button class="dark" id="reset">Redefinir</button>
        <button class="dark" id="apply"><span><img src="../assets/input-search-bg.png">Pesquisar</span></button>
    </div>
</div>`
filterBarContainer.innerHTML += filterBar
filterBarContainer.classList.add('expand')
advancedSearchButton.innerText = 'Esconder busca avançada'
    }
    else if(advancedSearchButton.innerText === 'Esconder busca avançada'){
        console.log('teste')
        document.querySelector('.advanced-search-options').classList.remove('appear')
        document.querySelector('.advanced-search-container').classList.add('desappear')
        filterBarContainer.classList.add('contract')
        setTimeout(() => { filterBarContainer.classList.remove(filterBarContainer.classList[1]) 
            filterBarContainer.innerHTML = '' 
            advancedSearchButton.innerText = 'Mostrar busca avançada' }, 350);
        
    }
})

