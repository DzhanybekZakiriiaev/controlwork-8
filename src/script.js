const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const ingContainer = document.getElementById('ingResults');

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
        resultsContainer.innerHTML = '<h1>Results by name: </h1>';
        displayCocktails(data.drinks);
    } else {
        resultsContainer.innerHTML = 'No cocktails found with this name';
    }
    const ingResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm}`);
    const ingData = await ingResponse.json();
    if (ingData.drinks) {
        ingContainer.innerHTML = '<h1>Results by ingredient: </h1>';
        displayCocktailsIng(ingData.drinks);
    } else {
        ingContainer.innerHTML = 'No cocktails found with this ingredient';
    }
}

function displayCocktailsIng(cocktails) {
    ingContainer.innerHTML = '';
    cocktails.forEach(cocktail => {
        const cocktailElement = createCocktailElement(cocktail);
        ingContainer.appendChild(cocktailElement);
    });
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
    return cocktailElement;
}
