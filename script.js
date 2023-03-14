let startLoad = 1;
let endLoad = 40;
let allPokemon = [];
const baseStats = ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed'];
const maxStats = [255, 190, 250, 194, 250, 180];
let loadingPokemon = false; // for loadMorePokemon() / infinite scroll
let timeout = null; //for search(): prevent faulty loading


/* --- API --- */
function getUrl(position) {
    return `https://pokeapi.co/api/v2/pokemon/${position}/`;
}

async function loadAllPokemon() {
    let urlAll = `https://pokeapi.co/api/v2/pokemon?limit=1008&offset=0`; // api only with: pokemon name and url
    allPokemon = (await (await fetch(urlAll)).json()).results; // fetch and parse in one
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
    let response = await fetch(url); // fetch
    let responseAsJsonPokemon = await response.json(); // parsen
    return responseAsJsonPokemon;
}

async function search() {
    clearTimeout(timeout);
    timeout = setTimeout(async () => { // prevent faulty loading
        document.getElementById('search-content').innerHTML = '';
        let searchInput = document.getElementById('search-input').value;
        showSearchOrPokedex(searchInput);

        results = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput.toLowerCase()));
        for (let i = 0; i < results.length; i++) {
            let pokemonName = results[i]['name'];
            let pokemon = await loadPokemonFromApi(pokemonName);
            showSearch(pokemon);
        }
    }, 750);
}

function showSearchOrPokedex(searchInput) {
    if (searchInput <= '') {
        document.getElementById('pokedex').classList.remove('dnone');
        document.getElementById('search-content').classList.add('dnone');
    } else {
        document.getElementById('pokedex').classList.add('dnone');
        document.getElementById('search-content').classList.remove('dnone');
    }
}

function showSearch(pokemon) {
    document.getElementById('search-content').innerHTML += pokemonSearchTemplate(pokemon);

    searchPokemonBackground(pokemon);
    searchPokemonType(pokemon);
}

function searchPokemonBackground(pokemon) {
    let typeAndColor = pokemon['types'][0]['type']['name'];
    let pokemonId = pokemon['id'];
    document.getElementById(`pokemon-search${pokemonId}`).classList.add(`${typeAndColor}`);
}

function searchPokemonType(pokemon) {
    let type = pokemon['types'];
    let pokemonId = pokemon['id'];
    for (let i = 0; i < type.length; i++) {
        let typeAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type-search${pokemonId}`).innerHTML += pokemonTypeTemplate(typeAndColor);
    }
}


/* --- Pokemon Card --- */
function generatePokemonCard(pokemon) {
    document.getElementById('pokedex').innerHTML += pokemonCardTemplate(pokemon);

    pokemonBackground(pokemon);
    pokemonType(pokemon);
}

function pokemonBackground(pokemon) {
    let typeAndColor = pokemon['types'][0]['type']['name'];
    let pokemonId = pokemon['id'];
    document.getElementById(`pokemon-card${pokemonId}`).classList.add(`${typeAndColor}`);
}

function pokemonType(pokemon) {
    let type = pokemon['types'];
    let pokemonId = pokemon['id'];
    for (let i = 0; i < type.length; i++) {
        let typeAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type${pokemonId}`).innerHTML += pokemonTypeTemplate(typeAndColor);
    }
}

/* --- Pokemon Popup --- */
async function popupPokemon(pokemonId) {
    document.getElementById('body').classList.add('overflow-hidden');

    let pokemon = await loadPokemonFromApi(pokemonId);
    document.getElementById('popup-open').innerHTML = pokemonPopupTemplate(pokemon);

    popupBackground(pokemon);
    popupType(pokemon);
    baseStatsPopup(pokemon);
}

function popupBackground(pokemon) {
    let typeAndColor = pokemon['types'][0]['type']['name'];
    let pokemonId = pokemon['id'];
    document.getElementById(`pokemon-card-pupup${pokemonId}`).classList.add(`${typeAndColor}`);
}

function popupType(pokemon) {
    let type = pokemon['types'];
    let pokemonId = pokemon['id'];
    for (let i = 0; i < type.length; i++) {
        let typeAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type-popup${pokemonId}`).innerHTML += pokemonTypeTemplate(typeAndColor);
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

window.addEventListener("wheel", loadMorePokemon); // or scroll

/* --- Templates --- */
/* --- Templates Cards --- */
function pokemonCardTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
        <div class="pokemon-card" id="pokemon-card${pokemonId}" onclick="popupPokemon(${pokemonId})">
            <div>
                <span><b>#${pokemonId}</b></span>
                <h3>${pokemonNameFormatted}</h3>
                <div id="type${pokemonId}">
                </div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon Img">
        </div>
    `;
}

function pokemonTypeTemplate(typeAndColor) {
    let name = typeAndColor.charAt(0).toUpperCase() + typeAndColor.slice(1).toLowerCase();

    return /*html*/`
    <div class="type-container ${typeAndColor}">${name}</div>
    `;
}

/* --- Templates Search --- */
function pokemonSearchTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
        <div class="pokemon-card" id="pokemon-search${pokemonId}" onclick="popupPokemon(${pokemonId})">
            <div>
                <span><b>#${pokemonId}</b></span>
                <h3>${pokemonNameFormatted}</h3>
                <div id="type-search${pokemonId}">
                </div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon Img">
        </div>
    `;
}

/* --- Templates Popup --- */
function pokemonPopupTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
    <div class="popup-pokemon" id="popup-content" onclick="closePopup()">
        <img class="close-img" src="img/cancel-256.jpg" alt="Close Popup">
        <div class="pokemon-popup-card" onclick="doNotClose(event)">
            <div class="popup-pokemon-top-container" id="pokemon-card-pupup${pokemonId}">
                <div>
                    <span><b># ${pokemonId}</b></span>
                    <h3>${pokemonNameFormatted}</h3>
                    <div id="type-popup${pokemonId}">
                    </div>
                </div>
                <img class="popup-img" src="${pokemonImg}" alt="Pokemon Img">
            </div>
            <div class="popup-pokemon-next-previous">
                <span class="arrow" onclick="previousPokemon(${pokemonId})"><b>&#8678;</b></span>
                <span class="arrow" onclick="nextPokemon(${pokemonId})"><b>&#8680;</b></span>
            </div>
            <span class="popup-pokemon-info"><b>Base-Stats</b></span>
            <div class="popup-pokemon-bottom-container" id="base-stats${pokemonId}">
            </div>
        </div>
    </div>
    `;
}

function baseStatsTemplate(i, pokemon) {
    let baseStatName = baseStats[i];
    let baseStatApi = pokemon['stats'][i]['base_stat'];

    return /*html*/`
    <div class="stats-container">
        <div class="name-stats">
            <div>${baseStatName}</div>
            <div>${baseStatApi}</div>
        </div>
        <div class="statbar-container">
            <div class="total-statbar">
                <div class="calculated-stats" id="calculated-stat${i}"></div>
            </div>
        </div>
    </div>
    `;
}