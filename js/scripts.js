import pokemonDB from "../pokemonsObjAll.json" assert { type: "json" };
let limitCards = 12;
let j = 0;
let searchStatus = false;
let filters = {
    type: [],
    weakness: [],
    height: [],
    weight: [],
    minValue: 0,
    maxValue: 0,
    search: searchStr,
    ability: ''
}
let matches;

const uniqueIds = [];
let pokemon = pokemonDB.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate && element.weight < 1000) {
        uniqueIds.push(element.id);

        return true;
    }

    return false;
});

createPokemons();
function createPokemons(
    pokemons = pokemon,
    k = j,
    limit = limitCards,
    search = false
) {
    try {
        let cards = createCards(pokemons, k, limit);
        if (search || k < 12) {
            document.querySelector(".pokemons-background").innerHTML = cards;
        } else {
            document.querySelector(".pokemons-background").innerHTML += cards;
        }
    } catch (error) {
        document.querySelector(".pokemons-background").innerHTML =
            "<p>ERROR! Unable to load pokemons.</p>";
        console.log(error);
    } finally {
        setTimeout(() => {
            removeAnimation();
        }, 301);
    }
}

function createCards(arr, y, limit) {
    var cards = "";
    for (y; y < limit; y++) {
        // Create new cards and add pokemons
        if (y >= arr.length) {
            j = arr.length
            limitCards += 12;
            return cards;
        }
        cards += `<div id="pokemon-${arr[y].id
            }" class="pokemon-card animate__${randomAnimate()}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${arr[y].id
            }.png" class="pokemon-image" alt="${arr[y].name}">
        <p class="pokemon-id">N° ${String(arr[y].id).padStart(4, "0")}</p>
        <p class="pokemon-name">${arr[y].name}</p>
        <div class="pokemon-type-container">${createTypes(arr[y].type)}</div>
        </div>`;
    }
    j = limitCards;
    limitCards += 12;
    return cards;
}

// Sort function
const sortByProp = function (prop) {
    return function (a, b) {
        if (typeof a[prop] === "number") return a[prop] - b[prop];

        return a[prop].localeCompare(b[prop]);
    };
};

const byName = sortByProp("name");
const byId = sortByProp("id");

const byNameAlpha = function (a, b) {
    return byName(a, b);
};

const byIdOrder = function (a, b) {
    return byId(a, b);
};


// Load more button event listener
const button = document.querySelector('#load-more-button');
button.onclick = function () {
    createPokemons()
    button.remove()
}


// Load more on scroll
window.onscroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!document.querySelector("#load-more-button")) {
            createPokemons();
        }
    }
};

var searchStr = '';
const searchBar = document.querySelector("#search-bar");
// Search bar event listener
searchBar.addEventListener("input", () => {
    searchStr = searchBar.value
    filters.search = searchStr

});

// Search button event listener
document.querySelector("#search-button").addEventListener("click", () => {
    advancedSearchPokemon();
});
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        advancedSearchPokemon();
    }
});

// Filter event listener
document.querySelector("#list-filter").addEventListener("change", () => {
    sortPokemonsBy()
});

// Surprise-me button event listener
document.querySelector('#randomize-button').addEventListener('click', ()=> {
    j = 0
    limitCards = 12
    searchStatus = false
    const randomPokemons = randomizePokemons(pokemon)
    createPokemons(randomPokemons)
    // Load more button event listener
    button.onclick = function () {
        createPokemons(randomPokemons)
        button.remove()
    }
    // Load more on scroll
    window.onscroll = function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if (!document.querySelector("#load-more-button")) {
                createPokemons(randomPokemons);
            }
        }
    };
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

function createTypes(types) {
    let pokemonType = "";
    types.forEach((type) => {
        pokemonType += `<span class="pokemon-type color-${type}">${type}</span>`;
    });
    return pokemonType;
}

function removeAnimation() {
    let elements = document.querySelectorAll('[class^="pokemon-card animate"]');
    elements.forEach((element) => {
        element.classList.remove(element.classList[1]);
        element.classList.add("bounce");
    });
}

function randomAnimate() {
    let animateArr = ["backInLeft", "backInDown", "backInRight", "backInUp"];
    let id = Math.floor(Math.random() * animateArr.length);
    return animateArr[id];
}

function filterPokemons(pokemons, filters) {
    return pokemons.filter(pokemon => {
        if (filters.type && !filters.type.every(type => pokemon.type.includes(type))) {
            return false;
        }

        if (filters.weakness && !filters.weakness.every(weakness => pokemon.weakness.includes(weakness))) {
            return false;
        }

        if (filters.height.length > 0) {
            const heightRanges = {
                "short": pokemon.height <= 1.1,
                "medium": pokemon.height > 1.1 && pokemon.height <= 2.1,
                "tall": pokemon.height > 2.1
            };
            const hasSelectedHeight = filters.height.some(selectedHeight =>
                heightRanges[selectedHeight]
            );
            if (!hasSelectedHeight) {
                return false;
            }
        }

        if (filters.weight.length > 0) {
            const weightRanges = {
                "light": pokemon.weight <= 40,
                "medium": pokemon.weight > 40 && pokemon.weight <= 219,
                "heavy": pokemon.weight > 219
            };
            const hasSelectedWeight = filters.weight.some(selectedWeight =>
                weightRanges[selectedWeight]
            );
            if (!hasSelectedWeight) {
                return false;
            }
        }

        if (filters.minValue > 0 && pokemon.id < filters.minValue) {
            return false

        }

        if (filters.maxValue > 0 && pokemon.id > filters.maxValue) {
            return false

        }

        if ((containsOnlyNumbers(filters.search)) && pokemon.id == filters.search ) {
            return true
        }

        if (filters.search && !pokemon.name.toUpperCase().includes(filters.search.toUpperCase())) {
            return false
        }

        if (filters.ability !== '' && !pokemon.abilities.includes(filters.ability)) {
            return false
        }

        if(filters.ability !== '' && !pokemonDB.filter(pokemond => pokemond.abilities.includes(filters.ability))){
            return false
        }

        return true;
    })
}


document.querySelector(".advanced-search-drag").addEventListener("click", () => {
    // Add new animations and remove old ones
    document.querySelector(".advanced-search-bar").classList.add('drag')
    document.querySelector(".span-border").classList.add('drag')
    const animations = document
        .querySelector(".advanced-search-container");
    const filterValues = document.querySelectorAll(".filter-values");
    const advancedSearchButton = document.querySelector("#advanced-search-text");
    const filterBarContainer = document.querySelector(
        ".advanced-search-container"
    );
    if (filterValues) {
        filterValues.forEach(element => element.remove())
    }
    animations.classList.remove('none')
    filterBarContainer.classList.remove("contract");
    filterBarContainer.classList.remove("desappear");
    filterBarContainer.classList.add('expand')
    // Advanced search tab
    if (!document.querySelector('.advanced-search-options')) {
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
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="bug" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                        </label>
                        <label class="label-container">
                            <input id="weakness" value="bug" class="checkbox-round" type="checkbox">       
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-dark" id="pokemon-type-filter"><span id="">Dark</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="dark" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="dark" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>

                </tr>
                <tr class="advanced-search-row">
                    <td class="color-dragon" id="pokemon-type-filter"><span id="">Dragon</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="dragon" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="dragon" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-electric" id="pokemon-type-filter"><span id="">Electric</span>
                    </td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="electric" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="electric" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-fairy" id="pokemon-type-filter"><span id="">Fairy</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="fairy" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="fairy" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-fighting" id="pokemon-type-filter"><span id="">Fighting</span>
                    </td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="fighting" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="fighting" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-fire" id="pokemon-type-filter"><span id="">Fire</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="fire" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="fire" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-flying" id="pokemon-type-filter"><span id="">flying</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="flying" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="flying" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-ghost" id="pokemon-type-filter"><span id="">ghost</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="ghost" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="ghost" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-grass" id="pokemon-type-filter"><span id="">grass</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="grass" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="grass" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-ground" id="pokemon-type-filter"><span id="">ground</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="ground" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="ground" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-ice" id="pokemon-type-filter"><span id="">ice</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="ice" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="ice" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-normal" id="pokemon-type-filter"><span id="">normal</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="normal" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="normal" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-poison" id="pokemon-type-filter"><span id="">poison</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="poison" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="poison" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-psychic" id="pokemon-type-filter"><span id="">psychic</span>
                    </td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="psychic" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="psychic" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-rock" id="pokemon-type-filter"><span id="">rock</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="rock" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="rock" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                </tr>
                <tr class="advanced-search-row">
                    <td class="color-steel" id="pokemon-type-filter"><span id="">steel</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="steel" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="steel" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
                    </td>
                    <td class="color-water" id="pokemon-type-filter"><span id="">water</span></td>
                    <td id="advanced-search-checkbox">
                    <div class="input-container">
                        <label class="label-container">
                            <input id="type" value="water" class="checkbox-round" type="checkbox">
                            <span class="checkmark type">T</span>
                            </label>
                            <label class="label-container">
                            <input id="weakness" value="water" class="checkbox-round" type="checkbox">
                            <span class="checkmark weakness">F</span>
                        </label>
                        </div>
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
                <select id="ability-filter" class="filter-list ability" name="ability"><option value="" id="first-option">Todas</option></select></label>
        </div>
        <p class="advanced-search-label">Altura</p>
        <div class="by-height">           
            <div class="checkbox-image-container">
                 <img src="../assets/033.png" alt="low-height">       
                <input class="checkbox-characteristics short height" id="height" type="checkbox" value="short">
            </div>
            <div class="checkbox-image-container">
            <img src="../assets/148.png" alt="medium-height">
            <input class="checkbox-characteristics medium-height" id="height" type="checkbox" value="medium">
            </div>
            <div class="checkbox-image-container">
            <img src="../assets/384.png" alt="tall-height">
            <input class="checkbox-characteristics tall height" id="height" type="checkbox" value="tall">
            </div>
        </div>
        <p class="advanced-search-label">Peso</p>
        <div class="by-weight">       
            <div class="checkbox-image-container">
            <img class="circles circle-1" src="../assets/9023402_circles_three_fill_icon.png" alt="low-weight">
            <input class="checkbox-characteristics light weight" id="weight" type="checkbox" value="light">
            </div>
            <div class="checkbox-image-container">
            <img class="circles circle-2" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <img class="circles circle-3" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <img class="circles circle-4" src="../assets/9023402_circles_three_fill_icon.png" alt="medium-weight">
            <input class="checkbox-characteristics medium-weight" id="weight" type="checkbox" value="medium">
            </div>
            <div class="checkbox-image-container">
            <img class="circles circle-5" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-6" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-7" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-8" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <img class="circles circle-9" src="../assets/9023402_circles_three_fill_icon.png" alt="heavy-weight">
            <input class="checkbox-characteristics heavy weight" id="weight" type="checkbox" value="heavy">
            </div>
        </div>
    </div>
</div>
<div class="advanced-search-footer container">
    <div class="interval">
        <p>Intervalo de números</p>
        <input id="interval-values" class="interval-input minValue" type="number" placeholder="1">
        <span>-</span>
        <input id="interval-values" class="interval-input maxValue" type="number" placeholder="1010">
    </div>
    <div class="filter-buttons">
        <button class="dark" id="reset">Redefinir</button>
        <button class="dark" id="apply"><span><img src="../assets/input-search-bg.png">Pesquisar</span></button>
    </div>
</div>`;
        filterBarContainer.innerHTML += filterBar;
        // Populate filter list
        const abilityFilter = document.querySelector('#ability-filter')
        function placeOptions() {
            const abilityOptions = getOptions()
            abilityOptions.forEach((option) => {
                var opt = document.createElement('option');
                opt.value = option
                opt.innerHTML = option
                opt.classList.add('ability-options')
                abilityFilter.appendChild(opt)
            })
        }
        abilityFilter.addEventListener('click', () => {
            if (!document.querySelector('.ability-options')) {
                placeOptions()
            }
        })
        abilityFilter.addEventListener('change', () => {
            filters.ability = abilityFilter.value
        })

        // Get values from advanced filter
        const table = document.querySelector(".advanced-search-options");
        const minValueBar = document.querySelector('.minValue')
        minValueBar.addEventListener('input', function () {
            filters.minValue = parseInt(this.value)
        })
        const maxValueBar = document.querySelector('.maxValue')
        maxValueBar.addEventListener('input', function () {
            filters.maxValue = parseInt(this.value)
        })
        table.addEventListener("change", (event) => {
            if (event.target.type === "checkbox") {
                const typeChecked = document.querySelectorAll('input[id="type"]:checked');
                const weaknessChecked = document.querySelectorAll(
                    'input[id="weakness"]:checked'
                );
                const heightChecked = document.querySelectorAll(
                    'input[id="height"]:checked'
                );
                const weightChecked = document.querySelectorAll(
                    'input[id="weight"]:checked'
                );
                filters.type = Array.from(typeChecked).map((x) => x.value);
                filters.weakness = Array.from(weaknessChecked).map((x) =>
                    capitalizeFirstLetter(x.value)
                );
                filters.height = Array.from(heightChecked).map((x) => x.value);
                filters.weight = Array.from(weightChecked).map((x) => x.value);
            }
        });
        // Reset filters button
        const redefineButton = document.querySelector('#reset');
        redefineButton.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false)
            minValueBar.value = ''
            maxValueBar.value = ''
            abilityFilter.value = ''
            filters = {
                type: [],
                weakness: [],
                height: [],
                weight: [],
                minValue: 0,
                maxValue: 0,
                search: searchStr,
                ability: ''
            }
        })
        //Apply filters button
        const buttonU = document.querySelector("#apply");
        buttonU.addEventListener("click", () => {
            advancedSearchPokemon()
        })
    } else if (advancedSearchButton.innerText === "Esconder busca avançada") {
        document
            .querySelector(".advanced-search-options")
            .classList.remove("appear");
        document
            .querySelector(".advanced-search-bar").classList.remove('drag')
        document
            .querySelector(".span-border").classList.remove('drag')
        animations
            .classList.add("desappear");
        filterBarContainer.classList.add("contract");
        setTimeout(() => {
            filterBarContainer.classList.remove('expand');
            animations.classList.add('none')
            advancedSearchButton.innerText = "Mostrar busca avançada";
        }, 180);
        document.querySelector('.filter-values-box').innerHTML = createValuesBox()
    }
    advancedSearchButton.innerText = "Esconder busca avançada"
});


function advancedSearchPokemon() {
    searchStatus = true
    matches = filterPokemons(pokemon, filters)
    button.onclick = function () {
        createPokemons(matches)
        button.remove()
    }
    window.onscroll = function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if (!document.querySelector("#load-more-button") && j < matches.length) {
                createPokemons(matches);
            }
        }
    };
    if (matches.length < 12) {
        button.remove()
    } else {
        document.querySelector('.load-more').appendChild(button)
    }
    j = 0;
    limitCards = 12;
    sortPokemonsBy()
    if (j > matches.length) {
        return;
    }
}


function sortPokemonsBy() {
    const filter = document.querySelector("#list-filter").value;
    let arrObject;
    j = 0
    limitCards = 12
    if (!searchStatus) {
        arrObject = pokemon;
    } else {
        arrObject = matches;
    }
    if (filter === "Max" || filter === "Min") {
        if (filter === "Max") {
            arrObject.sort(byIdOrder).reverse();
        } else {
            arrObject.sort(byIdOrder);
        }
        createPokemons(arrObject);
    } else if (filter === "a-z" || filter === "z-a") {
        if (filter === "a-z") {
            arrObject.sort(byNameAlpha);
        } else {
            arrObject.sort(byNameAlpha).reverse();
        }
        createPokemons(arrObject);
    }
}

function getOptions() {
    let abilitiesArr = [];
    for (let i = 0; i < pokemonDB.length; i++) {
        for (let j = 0; j < pokemonDB[i]['abilities'].length; j++) {
            abilitiesArr.push(pokemonDB[i]['abilities'][j])
        }
    }
    const uniquesSet = new Set(abilitiesArr)
    const uniqueAbilities = [...uniquesSet]
    return uniqueAbilities.sort()
}



function createValuesBox() {
    let valueBox = ''
    let intervalBox = ''
    let min
    let max
    for (const prop in filters) {
        const value = filters[prop]
        if ((Array.isArray(value) && value.length > 0) ||
            (typeof value === 'string' && value !== '')) {
            if (filters[prop].length == 1 || typeof filters[prop] === 'string') {
                valueBox += `<div class="filter-values dark appear" id="remove-${prop}">
                    <p id="${prop}-box">${prop}: <span>${filters[prop]}</span></p><button id="${prop}-clear-button">X</button>
                    </div>` 
                    setTimeout(() => {
                        clearButton(prop)
                    }, 180)              
            } else {
                valueBox += `<div class="filter-values dark appear" id="remove-${prop}">
                <p>${prop}: <span>${filters[prop].length} selected</span></p><button id="${prop}-clear-button">X</button>
                </div>`
                setTimeout(() => {
                    clearButton(prop)
                }, 180)
                
            }

        } else if ((typeof value === 'number' && value !== 0)) {
            min = filters.minValue
            max = filters.maxValue
            if (!document.querySelector('.minValue').value) {
                min = 1
            }
            if (!document.querySelector('.maxValue').value) {
                max = 1010
            }
            if (min === 1 && max === 1010) {
                intervalBox = ''
            }
            else {
                intervalBox = `<div class="filter-values dark appear" id="remove-${prop}">
            <p id="interval-box">Intervalo: <span>${min} - ${max}</span></p><button id="${prop}-clear-button">X</button>
            </div>`

            setTimeout(() => {
                clearButton(prop)
            }, 180)
            }
        }
    }
    return valueBox += intervalBox
}

function randomizePokemons(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    } 
    return array;
  }


function clearButton(prop){
    document.querySelector(`#${prop}-clear-button`).addEventListener('click', () => {
        if(typeof filters[prop] === 'number'){
            document.querySelectorAll('#interval-values').forEach(input => input.value = '')
            filters.minValue = 0 
            filters.maxValue = 0 
        } else if (typeof filters[prop] === 'string') {
            filters[prop] = ''
            document.querySelector('#ability-filter').value = ''
        }else if (Array.isArray(filters[prop])) {
            filters[prop] = []  
            document.querySelectorAll(`input[id='${prop}']:checked`).forEach(input => {
                input.checked = false   
            })
        } 
        let box = document.querySelector(`#remove-${prop}`)
        box.remove()
    })
}