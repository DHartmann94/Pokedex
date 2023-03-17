/* --- Templates --- */
/* --- Templates Cards --- */
function pokemonCardTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];
    let typeAndColor = pokemon['types'][0]['type']['name'];

    return /*html*/`
        <div class="pokemon-card ${typeAndColor}" id="pokemon-card${pokemonId}" onclick="popupPokemon(${pokemonId})">
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
    let typeAndColor = pokemon['types'][0]['type']['name'];

    return /*html*/`
        <div class="pokemon-card ${typeAndColor}" id="pokemon-search${pokemonId}" onclick="popupPokemon(${pokemonId}, nextAndPrevious = false)">
            <div>
                <span><b>#${pokemonId}</b></span>
                <h3>${pokemonNameFormatted}</h3>
                <div id="type-search${pokemonId}">
                </div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon #${pokemonId}">
        </div>
    `;
}

/* --- Templates Popup --- */
function pokemonPopupTemplate(pokemon) {
    let pokemonId = pokemon['id'];
    let pokemonHeight = pokemon['height'];
    let pokemonWeight = pokemon['weight'];
    let pokemonName = pokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = pokemon['sprites']['other']['official-artwork']['front_default'];
    let typeAndColor = pokemon['types'][0]['type']['name'];

    return /*html*/`
    <div class="popup-pokemon" id="popup-content" onclick="closePopup()">
        <img class="close-img" src="img/cancel-256.jpg" alt="Close Popup">
        <div class="pokemon-popup-card" onclick="doNotClose(event)">
            <div class="popup-pokemon-top-container ${typeAndColor}" id="pokemon-card-pupup${pokemonId}">
                <div>
                    <span><b># ${pokemonId}</b></span>
                    <h3>${pokemonNameFormatted}</h3>
                    <div id="type-popup${pokemonId}">
                    </div>
                </div>
                <img class="popup-img" src="${pokemonImg}" alt="Pokemon Img">
            </div>
            <div class="popup-pokemon-next-previous" id="next-and-previous${pokemonId}">

            </div>
            <span class="popup-pokemon-info"><b>Base-Stats</b></span>
            <div class="popup-pokemon-bottom-container" id="base-stats${pokemonId}">
                <div class="weight-height-container">
                    <div class="weight-height">
                        <span><b>${pokemonWeight/10} KG</b></span>
                        <span class="weight-height-font">Weight</span>
                    </div>
                    <div class="weight-height">
                        <span><b>${pokemonHeight/10} M</b></span>
                        <span class="weight-height-font">Height</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function pokemonPopupNextPrevious(pokemonId) {


    return`
    <span class="arrow" onclick="previousPokemon(${pokemonId})"><b>&#8678;</b></span>
    <span class="arrow" onclick="nextPokemon(${pokemonId})"><b>&#8680;</b></span>
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