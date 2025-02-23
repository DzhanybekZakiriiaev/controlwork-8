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
        if (data && data.drinks) {
            displayCocktails(data.drinks,resultsContainer, "Results by name: ");
        } else {
            displayCocktails([], resultsContainer, 'No cocktails found with this name');
        }
    } catch (error) {
        console.log(error);
        displayCocktails([], resultsContainer, 'No cocktails found with this name');
    }

    try {
        const ingResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm}`);
        const ingData = await ingResponse.json();
        if (ingData && ingData.drinks) {
            displayCocktails(ingData.drinks, ingContainer, "Results by ingredient: ");
        } else {
            displayCocktails([], ingContainer, 'No cocktails found with this ingredient');
        }
    } catch (error) {
        console.log(error);
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
        const cocktailCard = createCocktailElement(cocktail, container);
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'mb-4');
        col.appendChild(cocktailCard);
        row.appendChild(col);
    });
    container.appendChild(row);
}




function createCocktailElement(cocktail, container) {
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

    cocktailCard.addEventListener('click', function() {
        popUp(cocktail, container);
    });

    return cocktailCard;
}


function popUp(cocktail, container) {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    modalDialog.setAttribute('role', 'document');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h4');
    modalTitle.classList.add('modal-title');
    modalTitle.setAttribute('id', 'modal-title');
    modalTitle.textContent = cocktail.strDrink;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    closeButton.addEventListener('click', closePopUp);

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    const ingredientsList = document.createElement('ul');
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail['strIngredient' + i];
        const measure = cocktail['strMeasure' + i];
        if (ingredient) {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.width = 20;
            if (ingredient !== null && ingredient !== '') {
                img.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`;
                img.alt = ingredient;
                img.addEventListener('click', showIngredientInfo);
            }
            if (measure){
                listItem.appendChild(document.createTextNode(`(${measure}) `));
            }
            if (img.src) {
                listItem.appendChild(img);
            }
            listItem.appendChild(document.createTextNode(`${ingredient}`));
            ingredientsList.appendChild(listItem);
        }
    }

    const cocktailInstructions = document.createElement('p');
    cocktailInstructions.textContent = cocktail.strInstructions;

    modalBody.appendChild(ingredientsList);
    modalBody.appendChild(cocktailInstructions);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modalDialog.appendChild(modalContent);

    modal.appendChild(modalDialog);

    container.appendChild(modal);

    modal.classList.add('show');
    modal.style.display = 'block';

    function closePopUp() {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.parentNode.removeChild(modal);
    }

    function showIngredientInfo(e) {
        const ingredientName = e.target.alt;
        const ingredientModal = document.createElement('div');
        ingredientModal.classList.add('modal', 'fade');
        ingredientModal.setAttribute('tabindex', '-1');
        ingredientModal.setAttribute('role', 'dialog');
        ingredientModal.setAttribute('aria-labelledby', 'modal-title');
        ingredientModal.setAttribute('aria-hidden', 'true');

        const ingredientDialog = document.createElement('div');
        ingredientDialog.classList.add('modal-dialog');
        ingredientDialog.setAttribute('role', 'document');

        const ingredientContent = document.createElement('div');
        ingredientContent.classList.add('modal-content');

        const ingredientHeader = document.createElement('div');
        ingredientHeader.classList.add('modal-header');

        const ingredientTitle = document.createElement('h4');
        ingredientTitle.classList.add('modal-title');
        ingredientTitle.setAttribute('id', 'modal-title');
        ingredientTitle.textContent = ingredientName;

        const ingredientCloseButton = document.createElement('button');
        ingredientCloseButton.classList.add('close');
        ingredientCloseButton.setAttribute('type', 'button');
        ingredientCloseButton.setAttribute('aria-label', 'Close');
        ingredientCloseButton.innerHTML = '<span aria-hidden="true">&times;</span>';
        ingredientCloseButton.addEventListener('click', closeIngredientModal);

        ingredientHeader.appendChild(ingredientTitle);
        ingredientHeader.appendChild(ingredientCloseButton);

        const ingredientBody = document.createElement('div');
        ingredientBody.classList.add('modal-body');

        const ingredientInfo = document.createElement('p');

        ingredientBody.appendChild(ingredientInfo);

        ingredientContent.appendChild(ingredientHeader);
        ingredientContent.appendChild(ingredientBody);

        ingredientDialog.appendChild(ingredientContent);

        ingredientModal.appendChild(ingredientDialog);

        container.appendChild(ingredientModal);

        ingredientModal.classList.add('show');
        ingredientModal.style.display = 'block';

        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientName}`)
            .then(response => response.json())
            .then(data => {
                const cocktails = data.drinks;
                if (cocktails) {
                    ingredientInfo.innerHTML = `
                <ul>
                    ${cocktails.map(cocktail => `<li>${cocktail.strDrink}</li>`).join('')}
                </ul>
                `;
                } else {
                    ingredientInfo.textContent = 'No cocktails found.';
                }
            })
            .catch(error => {
                ingredientInfo.textContent = 'Failed to load cocktail names.';
            });

        function closeIngredientModal() {
            ingredientModal.classList.remove('show');
            ingredientModal.style.display = 'none';
            ingredientModal.parentNode.removeChild(ingredientModal);
        }
    }
}



