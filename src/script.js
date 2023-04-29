const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

searchForm.addEventListener('submit', searchHandler);

async function searchHandler(e) {
    e.preventDefault();
    const searchTerm = searchInput.value;
    await searchCocktails(searchTerm);
}

async function searchCocktails(searchTerm) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    if (data.drinks) {
        displayCocktails(data.drinks);
    }
}

function displayCocktails(cocktails) {
    resultsContainer.innerHTML = '';
    cocktails.forEach(cocktail => {
        const cocktailElement = createCocktailElement(cocktail);
        resultsContainer.appendChild(cocktailElement);
    });
}

function createCocktailElement(cocktail) {
    const cocktailElement = document.createElement('div');
    cocktailElement.classList.add('cocktail');
    cocktailElement.innerHTML = `
    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
    <h2>${cocktail.strDrink}</h2>
  `;
    cocktailElement.addEventListener('click', event => {
        event.preventDefault();
        displayCocktailDetails(cocktail);
    });
    return cocktailElement;
}
