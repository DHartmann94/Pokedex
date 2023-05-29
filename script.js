let startLoad = 1;
let endLoad = 40;
let allPokemon = [];
const baseStats = ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed'];
const maxStats = [255, 190, 250, 194, 250, 180];
let loadingPokemon = false; // for loadMorePokemon() / infinite scroll
let timeout = null;
let requestInProgress = false; //for search(): prevent faulty loading by input


function init() {
    window.onbeforeunload = function () { // prevents issues with infinite scroll
        window.scrollTo(0, 0);
    };
    loadPokemon();
}

/* --- API --- */
/**
 * Loads the pokemon data from the API.
 */
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
/**
 * Assigns type colors and displays types for a given Pokémon.
 * @param {Object} pokemon - The Pokémon object containing type information.
 * @param {string} idPrefix - The prefix used to identify the HTML element where type information will be displayed.
 */
function typecolorAndType(pokemon, idPrefix) {
    let type = pokemon['types'];
    let pokemonId = pokemon['id'];
    for (let i = 0; i < type.length; i++) {
        let typeAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`${idPrefix}${pokemonId}`).innerHTML += pokemonTypeTemplate(typeAndColor);
    }
}

/* --- Search --- */
function search() {
    if (requestInProgress) {
        // One request is already in progress, waiting for it to complete
        return;
    }
    requestInProgress = true;
    clearTimeout(timeout);

    timeout = setTimeout( () => {
        startSearch();
    }, 1000);
}

function startSearch() {
    let searchInput = document.getElementById('search-input').value;
    document.getElementById('search-content').innerHTML = '';
    showSearchOrPokedex(searchInput);
    
    if (searchInput === '') {
        //the search is aborted if the input field is unexpectedly cleared
        requestInProgress = false;
        return;
    }

    showLoaderSearch();
    results = allPokemon.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchInput.toLowerCase()));
    searchResults(results);
}

/**
 * Displays the search results.
 * @param {Array} results - An array of Pokémon objects matching the search criteria.
 */
async function searchResults(results) {
    if (results.length > 0) {
        await generatePokemonCardFromSearch(results);
    } else {
        document.getElementById('search-content').innerHTML = '<h2>No Pokémon found with this name.</h2>';
    }

    hideLoaderSearch();
    requestInProgress = false; // prevent faulty loading by input
}

/**
 * Generates a Pokémon card for each search result.
 * @param {Array} results - An array of Pokémon objects.
 */
async function generatePokemonCardFromSearch(results) {
    for (let i = 0; i < results.length; i++) {
        let pokemonName = results[i]['name'];
        let pokemon = await loadPokemonFromApi(pokemonName);
        showSearch(pokemon);
    }
}

function showSearch(pokemon) {
    document.getElementById('search-content').innerHTML += pokemonSearchTemplate(pokemon);

    typecolorAndType(pokemon, 'type-search');
}

/**
 * Shows either the search results or the Pokédex.
 * @param {string} searchInput - The user's search input.
 */
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

function showLoaderSearch() {
    document.getElementById('loader-search').classList.add('show');
}

function hideLoaderSearch() {
    document.getElementById('loader-search').classList.remove('show');
}

/* --- Pokemon Card --- */
/**
 * Generates a Pokémon card and displays it in the Pokédex.
 * @param {Object} pokemon - The Pokémon object to generate the card for.
 */
function generatePokemonCard(pokemon) {
    document.getElementById('pokedex').innerHTML += pokemonCardTemplate(pokemon);

    typecolorAndType(pokemon, 'type');
}

/* --- Pokemon Popup --- */
/**
 * Displays a popup with detailed information about a Pokémon.
 * @param {number} pokemonId - The ID of the Pokémon.
 * @param {boolean} [nextAndPrevious=true] - Optional. Indicates whether to display next and previous buttons in the popup.
 */
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

/**
 * Displays the base stats section in the Pokémon popup.
 * @param {Object} pokemon - The Pokémon object.
 */
function baseStatsPopup(pokemon) {
    let pokemonId = pokemon['id'];
    for (let i = 0; i < baseStats.length; i++) {
        document.getElementById(`base-stats${pokemonId}`).innerHTML += baseStatsTemplate(i, pokemon);
        calcBaseStatBar(i, pokemon);
    }
}

/**
 * Calculates and sets the width of the base stat bar in the Pokémon popup.
 * @param {number} i - The index of the base stat.
 * @param {Object} pokemon - The Pokémon object.
 */
function calcBaseStatBar(i, pokemon) {
    let percent = +(pokemon['stats'][i]['base_stat'] / maxStats[i]) * 100;
    document.getElementById(`calculated-stat${i}`).style.setProperty('--progress-percent', `${percent}%`);
}

function previousPokemon(pokemonId) {
    pokemonId--;
    if (pokemonId === 0) {
        return;
    }
    popupPokemon(pokemonId);
}

function nextPokemon(pokemonId) {
    pokemonId++;
    if (pokemonId > endLoad) {
        return;
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

/* --- Loader & loading Pokemon-Card --- */
function showLoader() {
    document.getElementById('loader-pokedex').classList.add('show');

    setTimeout(() => {
        setTimeout(async () => {
            await loadNextPokemon();
            document.getElementById('loader-pokedex').classList.remove('show');
        }, 100)
    }, 2000)
}

async function loadNextPokemon() {
    startLoad = endLoad + 1; // +1 prevents the first pokemon from being loaded twice
    endLoad = startLoad + 20;
    await loadPokemon();
}

/* --- Infinite Scroll --- */
function loadMorePokemon() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loadingPokemon) {
        // Verifying that the end of the page has been reached and no request is sent

        loadingPokemon = true; // Set the "loadingPokemon" variable to true to prevent multiple requests from being sent
        showLoader();
    }
}

window.addEventListener("scroll", loadMorePokemon); 