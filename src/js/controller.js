import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

///////////////////////////////////////
if (module.hot) {
  // Parcel sintaksa
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    //290
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return; //  miče error kad nemamo hash
    recipeView.renderSpinner();
    //288, 292. => 1. loading recipe (288)

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1. Updating bookmarks view
    // debugger;
    bookmarksView.update(model.state.bookmarks);

    //2. loading recipe
    await model.loadRecipe(id); //async funkcija, vraća Promise, pa moramo await! dobijamo state.recipe

    //289, 292 => 2. Rendering recipe
    //3. Rendering recipe
    // const recipeView = new recipeView(model.state.recipe) => kad bi imali podatke u recipeView.js, i od tamo ih vukli ovdje
    recipeView.render(model.state.recipe); // render kad želimo insertati novi element, a ne update
  } catch (err) {
    // alert(err);
    recipeView.renderError(); // tu handlamo renderiranje na user interface. Prazna metoda znači da nemamo poveznicu na View
    console.error(err);
  }
};

// 290. Listening for Load and hashchange Events

//ovo dolje isto
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);

//dva controllera, rade slične stvari. U principu su event handleri
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); //spinner se stalno vrti prije neg se ikaj loada, poigledaj

    //1.get search query

    const query = searchView.getQuery();
    if (!query) return;
    //2. load serch results
    await model.loadSearchResults(query); // tu možda greška!!!!!!!!!!!!!!!
    //3. render results
    resultsView.render(model.getSearchResultsPage()); // prazno ko da passamo 1

    // 4. Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// controlSearchResults(); //subscriber
//294. Event handlers in MVC: Publisher-Subscriber pattern
const controlPagination = function (goToPage) {
  //1.  render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); // render cleara prijašnji markup prije nego nastupi novi (ima metodu clear)

  // 4. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state). tu passamo servings kojeg dobijemo iz recipeView
  model.updateServings(newServings); //

  // Update the recipe view
  // recipeView.render(model.state.recipe); // opet renderiramo cijeli recept
  recipeView.update(model.state.recipe); // opet renderiramo cijeli recept
};

const controlAddBookmark = function () {
  //1. add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  //update recipe view
  recipeView.update(model.state.recipe);

  //3. render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe); // tu awaitamo Promise iz model (uploadRecipe), kao obična funkcija ne radi
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    //Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change ID  in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`👀`, err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log();
  ('welcome to the application');
};

const init = function () {
  //Subscriber
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); // controlRecipes je handler u recipeView addHandlerRender
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination); // tu možda greška!!!!!!!!!!!!!
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();  // tu još nije došao ni jedan recept s API-a
  newFeature();
};

init(); // tu se handlea event, makar se sluša u recipeView
