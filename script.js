let startLoad = 1;
let endLoad = 40;
let allPokemon = [];
const baseStats = ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed'];
const maxStats = [255, 190, 250, 194, 250, 180];
let loadingPokemon = false; // for loadMorePokemon() / infinite scroll
let timeout = null; 
let requestInProgress = false; //for search(): prevent faulty loading by input


/* --- API --- */
function getUrl(position) {
    return `https://pokeapi.co/api/v2/pokemon/${position}/`;
}

async function loadAllPokemon() {
    let urlAll = `https://pokeapi.co/api/v2/pokemon?limit=1008&offset=0`; // api only with: pokemon name and url
    allPokemon = (await (await fetch(urlAll)).json()).results;
}

async function loadPokemon() {
    await loadAllPokemon();
    for (startLoad; startLoad <= endLoad; startLoad++) {
        let pokemon = await loadPokemonFromApi(startLoad);
        generatePokemonCard(pokemon);
    }
    loadingPokemon = false;
}

async function loadPokemonFromApi(position) {
    let url = getUrl(position);
    let response = await fetch(url);
    let responseAsJsonPokemon = await response.json(); 
    return responseAsJsonPokemon;
}
/* --- General --- */
function typecolorAndType(pokemon, idPrefix) {
    let type = pokemon['types'];
    let pokemonId = pokemon['id'];
    for (let i = 0; i < type.length; i++) {
        let typeAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`${idPrefix}${pokemonId}`).innerHTML += pokemonTypeTemplate(typeAndColor);
    }
}

/* --- Search --- */
async function search() {
    if (requestInProgress) {
        // One request is already in progress, waiting for it to complete
        return;
    }

    clearTimeout(timeout);
    requestInProgress = true;
    
    timeout = setTimeout(async () => {
        document.getElementById('search-content').innerHTML = '';
        let searchInput = document.getElementById('search-input').value;

        showSearchOrPokedex(searchInput);

        results = allPokemon.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchInput.toLowerCase()));
        if(results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            let pokemonName = results[i]['name'];
            let pokemon = await loadPokemonFromApi(pokemonName);
            showSearch(pokemon);
        }
    } else {
        document.getElementById('search-content').innerHTML = '<h2>No Pokémon found with this name.</h2>';
    }
        requestInProgress = false; // prevent faulty loading by input
    }, 1500);
}

function showSearchOrPokedex(searchInput) {
    if (searchInput <= '') {
        loadingPokemon = false;
        document.getElementById('pokedex').classList.remove('dnone');
        document.getElementById('search-content').classList.add('dnone');
    } else {
        loadingPokemon = true;
        document.getElementById('pokedex').classList.add('dnone');
        document.getElementById('search-content').classList.remove('dnone');
    }
}

function showSearch(pokemon) {
    document.getElementById('search-content').innerHTML += pokemonSearchTemplate(pokemon);

    typecolorAndType(pokemon, 'type-search'); 
}

/* --- Pokemon Card --- */
function generatePokemonCard(pokemon) {
    document.getElementById('pokedex').innerHTML += pokemonCardTemplate(pokemon);

    typecolorAndType(pokemon, 'type'); 
}

/* --- Pokemon Popup --- */
async function popupPokemon(pokemonId, nextAndPrevious = true) {
    document.getElementById('body').classList.add('overflow-hidden');

    let pokemon = await loadPokemonFromApi(pokemonId);
    document.getElementById('popup-open').innerHTML = pokemonPopupTemplate(pokemon);

    typecolorAndType(pokemon, 'type-popup');
    baseStatsPopup(pokemon);

    if (nextAndPrevious) { // not open from search()
        document.getElementById(`next-and-previous${pokemonId}`).innerHTML = pokemonPopupNextPrevious(pokemonId);
    }
}

function baseStatsPopup(pokemon) {
    let pokemonId = pokemon['id'];
    for (let i = 0; i < baseStats.length; i++) {
        document.getElementById(`base-stats${pokemonId}`).innerHTML += baseStatsTemplate(i, pokemon);
        calcBaseStatBar(i, pokemon);
    }
}

function calcBaseStatBar(i, pokemon) {
    let percent = +(pokemon['stats'][i]['base_stat'] / maxStats[i]) * 100;
    document.getElementById(`calculated-stat${i}`).style.setProperty('--progress-percent', `${percent}%`);
}

function previousPokemon(pokemonId) {
    pokemonId--;
    if (pokemonId === 0) {
        pokemonId = 1;
    }
    popupPokemon(pokemonId);
}

function nextPokemon(pokemonId) {
    pokemonId++;
    if (pokemonId >= endLoad) {
        pokemonId = endLoad;
    }
    popupPokemon(pokemonId);
}

function closePopup() {
    document.getElementById("popup-content").classList.add('dnone');
    document.getElementById('body').classList.remove('overflow-hidden');
}

function doNotClose(event) {
    event.stopPropagation();
}

/* --- Loader & loading Pokemon --- */
function showLoader() {
    document.getElementById('loader').classList.add('show');

    setTimeout(() => {
        document.getElementById('loader').classList.remove('show');

        setTimeout(async () => {
            startLoad = endLoad + 1; // +1 prevents the first pokemon from being loaded twice
            endLoad = startLoad + 20;
            await loadPokemon();
        }, 100)
    }, 2000)
    loadingPokemon = true; // Set the "loadingPokemon" variable to true to prevent multiple requests from being sent
}

/* --- Infinite Scroll --- */
async function loadMorePokemon() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loadingPokemon) {
        // Verifying that the end of the page has been reached and no request is sent

        showLoader();
    }
}

window.addEventListener("scroll", loadMorePokemon); // or wheel