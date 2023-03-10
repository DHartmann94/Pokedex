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

    console.log('Loaded Pokemon', responseAsJsonPokemon);
}

function pokemonCardBackground(startLoad, responseAsJsonPokemon) {
    let backgroundColour = responseAsJsonPokemon['types'][0]['type']['name'];
    document.getElementById(`pokemon-card${startLoad}`).classList.add(`${backgroundColour}`);
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
                <div class="type-container" id="type">Type 1</div>
                <div class="type-container">Type 2</div>
            </div>
            <img src="${pokemonImg}" alt="Pokemon Img">
        </div>
    `;
}


/* Infinite Scroll */
async function loadMorePokemon() {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
		// Überprüfen, ob das Ende der Seite erreicht wurde und keine Anfrage gesendet wird
		startLoad = endLoad +1; // +1 verhindert das das erste Pokemon doppelt geladen wird
		endLoad = startLoad + 20;
		loading = true; // Setzen der Variablen "loading" auf "true", um zu verhindern, dass mehrere Anfragen gesendet werden
		loadPokemon(); 
	}
}

window.addEventListener("scroll", loadMorePokemon);