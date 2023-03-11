let startLoad = 1;
let endLoad = 50;
let baseStats = ['HP', 'Attack', 'Sp. Atk.', 'Defense', 'Sp. Def.', 'Speed']; // Defense and spDefense 250???
let maxStats = [255, 190, 194, 230, 230, 180];
let loading = false;


/* --- API --- */
function getUrl(position) {
    return `https://pokeapi.co/api/v2/pokemon/${position}/`;
}

async function loadPokemon() {
    for (startLoad; startLoad <= endLoad; startLoad++) {
        let pokemon = await loadPokemonFromApi(startLoad);
        generatePokemonCard(startLoad, pokemon);
    }
    loading = false;
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
}

/*function pokemonPopupBackground(position, pokemon) {
    let nameAndColor = pokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon-popup-card${position}`).classList.add(`${nameAndColor}`);
}

function pokemonPopupType(position, pokemon) {
    let type = pokemon['types'];
    for (let i = 0; i < type.length; i++) {
        let nameAndColor = pokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type-popup${position}`).innerHTML += pokemonPopupTypeTemplate(nameAndColor);
    }
}*/

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
                <div id="type${position}"></div>
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
                    <div id="type${position}"></div>
                </div>
                <img class="popup-img" src="${pokemonImg}" alt="Pokemon Img">
            </div>
            <div class="popup-pokemon-back-forward">
                <span class="arrow"><b><</b></span>
                <span class="arrow"><b>></b></span>
            </div>
            <span class="popup-pokemon-base-stats"><b>Base Stats</b></span>
            <div class="popup-pokemon-all-stats">
                Alle STATS
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

/* --- Loader & loading Pokemon --- */
function showLoader() {
    document.getElementById('loader').classList.add('show');

    setTimeout(() => {
        document.getElementById('loader').classList.remove('show');

        setTimeout(() => {
            startLoad = endLoad + 1; // +1 prevents the first pokemon from being loaded twice
            endLoad = startLoad + 20;
            loading = true; // Set the "loading" variable to true to prevent multiple requests from being sent
            loadPokemon();
        }, 100)

    }, 1500)
}


/* --- Infinite Scroll --- */
async function loadMorePokemon() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
        // Verifying that the end of the page has been reached and no request is sent

        showLoader();
    }
}

window.addEventListener("scroll", loadMorePokemon);