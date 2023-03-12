let startLoad = 1;
let endLoad = 50;
let baseStats = ['HP', 'Attack', 'Defense', 'Sp. Atk.', 'Sp. Def.', 'Speed'];
let maxStats = [255, 190, 250, 194, 250, 180];
let loadingPokemon = false;


/* --- API --- */
function getUrl(position) {
    return `https://pokeapi.co/api/v2/pokemon/${position}/`;
}

async function loadPokemon() {
    for (startLoad; startLoad <= endLoad; startLoad++) {
        let pokemon = await loadPokemonFromApi(startLoad);
        generatePokemonCard(startLoad, pokemon);
    }
    loadingPokemon = false;
}

async function loadPokemonFromApi(position) {
    let url = getUrl(position);
    let response = await fetch(url);
    let responseAsJsonPokemon = await response.json();
    return responseAsJsonPokemon;
}

/* --- Pokemon Card --- */
function generatePokemonCard(position, pokemon) {
    document.getElementById('main-content').innerHTML += pokemonCardTemplate(position, pokemon);
    
    pokemonBackground(position, pokemon);
    pokemonType(position, pokemon);
}

function pokemonBackground(position, pokemon) {
    let nameAndColor = pokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon-card${position}`).classList.add(`${nameAndColor}`);
}

function pokemonType(position, pokemon) {
    let type = pokemon['types'];
    for (let i = 0; i < type.length; i++) {
        let nameAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type${position}`).innerHTML += pokemonCardTypeTemplate(nameAndColor);
    }
}

/* --- Pokemon Popup --- */
async function popupPokemon(position) {
    document.getElementById('body').classList.add('overflow-hidden');

    let pokemon = await loadPokemonFromApi(position);
    document.getElementById('popup-open').innerHTML = pokemonPopupTemplate(position, pokemon);

    pokemonBackground(position, pokemon);
    pokemonType(position, pokemon);
    baseStatsPopup(position, pokemon);
}

function previousPokemon(position) {
    position--;
    if (position == 0) {
        position = 1;
    }
    popupPokemon(position);
}

function nextPokemon(position) {
    position++;
    if(position >= endLoad) {
        position = endLoad;
    }
    popupPokemon(position);
}

function baseStatsPopup(position, pokemon) {
    for(let i=0; i < baseStats.length; i++) {
        document.getElementById(`base-stats${position}`).innerHTML += baseStatsTemplate(i, pokemon);
        calcBaseStatBar(i, pokemon);
    }
}

function calcBaseStatBar(i, pokemon)  {
    let percent = +(pokemon['stats'][i]['base_stat'] / maxStats[i]) * 100;
    document.getElementById(`calculated-stat${i}`).style = `width: ${percent}%;`;
}

function closePopup() {
    document.getElementById("popup-content").classList.add('dnone');
    document.getElementById('body').classList.remove('overflow-hidden');
}

function doNotClose(event) {
    event.stopPropagation();
}

/* --- Templates --- */
function pokemonCardTemplate(position, pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
        <div class="pokemon-card" id="pokemon-card${position}" onclick="popupPokemon(${position})">
            <div>
                <span><b>#${pokemonId}</b></span>
                <h3>${pokemonNameFormatted}</h3>
                <div id="type${position}">
                </div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon Img">
        </div>
    `;
}

function pokemonCardTypeTemplate(nameAndColor) {
    let name = nameAndColor.charAt(0).toUpperCase() + nameAndColor.slice(1).toLowerCase();
    return /*html*/`
    <div class="type-container ${nameAndColor}" id="type-container">${name}</div>
    `;
}

function pokemonPopupTemplate(position, pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];

    return /*html*/`
    <div class="popup-pokemon" id="popup-content" onclick="closePopup()">
        <img class="close-img" src="img/cancel-256.jpg" alt="Close Popup">
        <div class="pokemon-popup-card" onclick="doNotClose(event)">
            <div class="popup-pokemon-top-container" id="pokemon-card${position}">
                <div>
                    <span><b># ${pokemonId}</b></span>
                    <h3>${pokemonNameFormatted}</h3>
                    <div id="type${position}">
                    </div>
                </div>
                <img class="popup-img" src="${pokemonImg}" alt="Pokemon Img">
            </div>
            <div class="popup-pokemon-next-previous">
                <span class="arrow" onclick="previousPokemon(${position})"><b>&lArr;</b></span>
                <span class="arrow" onclick="nextPokemon(${position})"><b>&rArr;</b></span>
            </div>
            <span class="popup-pokemon-info"><b>Base-Stats</b></span>
            <div class="popup-pokemon-bottom-container" id="base-stats${position}">
            </div>
        </div>
    </div>
    `;
}

function pokemonPopupTypeTemplate(nameAndColour) {
    let name = nameAndColour.charAt(0).toUpperCase() + nameAndColour.slice(1).toLowerCase();

    return /*html*/`
    <div class="type-container ${nameAndColour}" id="type-container">${name}</div>
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

        setTimeout(() => {
            startLoad = endLoad + 1; // +1 prevents the first pokemon from being loaded twice
            endLoad = startLoad + 20;
            loadPokemon();
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

window.addEventListener("scroll", loadMorePokemon);