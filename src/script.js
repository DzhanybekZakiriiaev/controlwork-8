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
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        if (data.drinks) {
            displayCocktails(data.drinks,resultsContainer, "Results by name: ");
        } else {
            displayCocktails([], resultsContainer, 'No cocktails found with this name');
        }
        const ingResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm}`);
        const ingData = await ingResponse.json();
        if (ingData.drinks) {
            displayCocktails(ingData.drinks, ingContainer, "Results by ingredient: ");
        } else {
            displayCocktails([], ingContainer, 'No cocktails found with this ingredient');
        }
    } catch (error) {
        console.log(error);
        displayCocktails([], resultsContainer, 'No cocktails found with this name');
        displayCocktails([], ingContainer, 'No cocktails found with this ingredient');
    }
}

function displayCocktails(cocktails, container, str) {
    container.innerHTML = '';
    const header = document.createElement('h1');
    header.textContent = str;
    container.appendChild(header);

    const row = document.createElement('div');
    row.classList.add('row');
    cocktails.forEach(cocktail => {
        const cocktailCard = createCocktailElement(cocktail);
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');
        col.appendChild(cocktailCard);
        row.appendChild(col);
    });
    container.appendChild(row);
}




function createCocktailElement(cocktail) {
    const cocktailCard = document.createElement('div');
    cocktailCard.classList.add('card');

    const cocktailImage = document.createElement('img');
    cocktailImage.classList.add('card-img-top');
    cocktailImage.setAttribute('src', cocktail.strDrinkThumb);
    cocktailImage.setAttribute('alt', cocktail.strDrink);

    const cocktailCardBody = document.createElement('div');
    cocktailCardBody.classList.add('card-body');

    const cocktailTitle = document.createElement('h5');
    cocktailTitle.classList.add('card-title');
    cocktailTitle.textContent = cocktail.strDrink;

    cocktailCardBody.appendChild(cocktailTitle);
    cocktailCard.appendChild(cocktailImage);
    cocktailCard.appendChild(cocktailCardBody);

    return cocktailCard;
}

