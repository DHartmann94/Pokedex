let responseAsJsonPokemon;
let startLoad = 1;
let endLoad = 50;
let loading = false;


async function loadPokemon() {
    for (startLoad; startLoad <= endLoad; startLoad++) {
        await loadPokemonFromApi(startLoad);
    }
    loading = false;
}

async function loadPokemonFromApi(startLoad) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${startLoad}`);
    responseAsJsonPokemon = await response.json();

    document.getElementById('main-content').innerHTML += pokemonCardTemplate(startLoad, responseAsJsonPokemon);
    pokemonCardBackground(startLoad, responseAsJsonPokemon);
    pokemonCardType(startLoad, responseAsJsonPokemon);
}

function pokemonCardBackground(startLoad, responseAsJsonPokemon) {
    let nameAndColour = responseAsJsonPokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon-card${startLoad}`).classList.add(`${nameAndColour}`);
}

function pokemonCardType(startLoad, responseAsJsonPokemon) {
    let type = responseAsJsonPokemon['types'];
    for(let i=0; i < type.length; i++) {
        let nameAndColour = responseAsJsonPokemon['types'][`${i}`]['type']['name'];
        document.getElementById(`type${startLoad}`).innerHTML += pokemonCardTypeTemplate(nameAndColour);
    }
}

function pokemonCardTemplate(startLoad, responseAsJsonPokemon) {
    let pokemonId = responseAsJsonPokemon['id'];
    let pokemonName = responseAsJsonPokemon['name'];
    let pokemonNameFormatted = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
    let pokemonImg = responseAsJsonPokemon['sprites']['other']['official-artwork']['front_default'];
    
    return /*html*/`
        <div class="pokemon-card" id="pokemon-card${startLoad}">
            <div>
                <span><b>#${pokemonId}</b></span>
                <h3>${pokemonNameFormatted}</h3>
                <div id="type${startLoad}"></div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon Img">
        </div>
    `;
}

function pokemonCardTypeTemplate(nameAndColour) {
    let name = nameAndColour.charAt(0).toUpperCase() + nameAndColour.slice(1).toLowerCase();
    return /*html*/`
    <div class="type-container ${nameAndColour}" id="type-container">${name}</div>
    `;
}

/* Loader & loading Pokemon */
function showLoader() {
    document.getElementById('loader').classList.add('show');

    setTimeout(() => {
        document.getElementById('loader').classList.remove('show');

        setTimeout(() => {
            startLoad = endLoad +1; // +1 prevents the first pokemon from being loaded twice
            endLoad = startLoad + 20;
            loading = true; // Set the "loading" variable to true to prevent multiple requests from being sent
            loadPokemon(); 
        }, 100)

    }, 1500)
}


/* Infinite Scroll */
async function loadMorePokemon() {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
		// Verifying that the end of the page has been reached and no request is sent

        showLoader();
	}
}

window.addEventListener("scroll", loadMorePokemon);