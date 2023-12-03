
// Function fetch JSON data //
const collapseUrl = "./data/data.json";
const collapseContainer = document.getElementById('box-drop');

const renderCollapse = () => {
    fetch(collapseUrl)
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
             // Extraction valeur unique pour chaque section dans toutes recettes //
            const allIngredients = getAllIngredients(data);
            const allAppareils = getAllValues(data, 'appliance');
            const allUstensils = getAllValues(data, 'ustensils');

            // Render section des 3 collapses //
            renderSection('ingredients', allIngredients);
            renderSection('appareils', allAppareils);
            renderSection('ustensiles', allUstensils);
        } else {
            console.error('Data is not an array:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching collapse data:', error);
    });
};

const getAllIngredients = (data) => {
    const itemsSet = new Set();
    data.forEach(item => {
        if (Array.isArray(item.ingredients)) {
            item.ingredients.forEach(ingredient => {
                itemsSet.add(ingredient.ingredient);
            });
        }
    });
    return Array.from(itemsSet);
};

const getAllValues = (data, key) => {
    const itemsSet = new Set();
    data.forEach(item => {
        if (Array.isArray(item[key])) {
            item[key].forEach(value => itemsSet.add(value));
        } else if (typeof item[key] === 'string') {
            itemsSet.add(item[key]);
        }
    });
    return Array.from(itemsSet);
};

const renderSection = (sectionId, sectionData) => {
    const dropdownHTML = createDropdown(sectionData, sectionId);
    collapseContainer.innerHTML += dropdownHTML;
};

const createDropdown = (data, sectionId) => {
    const itemsArray = data.map(item => `<li class="dropdown-item" href="#">${item}</li>`);
    return `
    <div class="dropdown">
        <a href="#" role="button" class="nav-link dropdown-toggle" type="button" id="dropdownMenuButton-${sectionId}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Bouton${sectionId}">
            ${sectionId}
            <strong class ="fa-solid fa-chevron-down"></strong>
        </a>
        <div class="dropdown-menu">
            <div class="form-group">
                <input type="text" class="form-control" id="search-drop-${sectionId}" aria-label="Champs de recherche">
                <strong class="fa-solid fa-magnifying-glass"></strong>
            </div>
            <ul class="list-drop">
                ${itemsArray.join('')}
            </ul>
        </div>
    </div>`;
};
renderCollapse();









