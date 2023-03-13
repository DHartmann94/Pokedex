let startLoad = 1;
let endLoad = 5;
let allPokemon = [];
const baseStats = ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed'];
const maxStats = [255, 190, 250, 194, 250, 180];
let loadingPokemon = false;


/* --- API --- */
function getUrl(position) {
    return `https://pokeapi.co/api/v2/pokemon/${position}/`;
}

async function loadAllPokemon() {
    let urlAll = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
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

/* --- Search Pokemon --- */
function showSearchOrCards(searchInput) {
    if (searchInput <= '') {
        document.getElementById('pokedex').classList.remove('dnone');
        document.getElementById('search-content').classList.add('dnone');
    } else {
        document.getElementById('pokedex').classList.add('dnone');
        document.getElementById('search-content').classList.remove('dnone');
    }
}

async function search() {
    let searchInput = document.getElementById('search-input').value;
    showSearchOrCards(searchInput);
    results = allPokemon.filter(p => p.name.toLowerCase().includes(searchInput.toLowerCase()));

    let pokemonName = results[0]['name'];
    let pokemon = await loadPokemonFromApi(pokemonName);
    showSearch(pokemon);
}

function showSearch(pokemon) {
    document.getElementById('search-content').innerHTML = pokemonCardTemplate(pokemon);

    pokemonBackground(pokemon);
    pokemonType(pokemon);
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
        document.getElementById(`type${pokemonId}`).innerHTML += pokemonCardTypeTemplate(typeAndColor);
    }
}

/* --- Pokemon Popup --- */
async function popupPokemon(pokemonId) {
    document.getElementById('body').classList.add('overflow-hidden');

    let pokemon = await loadPokemonFromApi(pokemonId);
    document.getElementById('popup-open').innerHTML = pokemonPopupTemplate(pokemon);

    pokemonBackground(pokemon);
    pokemonType(pokemon);
    baseStatsPopup(pokemon);
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
    //document.getElementById(`calculated-stat${i}`).style = `width: ${percent}%;`;
}

function previousPokemon(pokemonId) {
    pokemonId--;
    if (pokemonId == 0) {
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

/* --- Templates --- */
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

function pokemonCardTypeTemplate(typeAndColor) {
    let name = typeAndColor.charAt(0).toUpperCase() + typeAndColor.slice(1).toLowerCase();

    return /*html*/`
    <div class="type-container ${typeAndColor}" id="type-container">${name}</div>
    `;
}

function pokemonPopupTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
    <div class="popup-pokemon" id="popup-content" onclick="closePopup()">
        <img class="close-img" src="img/cancel-256.jpg" alt="Close Popup">
        <div class="pokemon-popup-card" onclick="doNotClose(event)">
            <div class="popup-pokemon-top-container" id="pokemon-card${pokemonId}">
                <div>
                    <span><b># ${pokemonId}</b></span>
                    <h3>${pokemonNameFormatted}</h3>
                    <div id="type${pokemonId}">
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

function pokemonPopupTypeTemplate(typeAndColor) {
    let name = typeAndColor.charAt(0).toUpperCase() + typeAndColor.slice(1).toLowerCase();

    return /*html*/`
    <div class="type-container ${typeAndColor}" id="type-container">${name}</div>
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
    }, 1500)
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