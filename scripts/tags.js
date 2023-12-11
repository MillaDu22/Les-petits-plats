// Création des containers à tags //
const TagContainer = document.getElementById('container-tag');

const ulTagIngredients = document.createElement('div');
ulTagIngredients.id = 'ulTagIngredients';
ulTagIngredients.classList.add('tag');
TagContainer.appendChild(ulTagIngredients);

const ulTagAppliances = document.createElement('div');
ulTagAppliances.id = 'ulTagAppliances';
ulTagAppliances.classList.add('tag');
TagContainer.appendChild(ulTagAppliances);

const ulTagUstensils = document.createElement('div');
ulTagUstensils.id = 'ulTagUstensils';
ulTagUstensils.classList.add('tag');
TagContainer.appendChild(ulTagUstensils);

