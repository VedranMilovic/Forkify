import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your querry. Please try again';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);

    // ovo dolje je zapravo array of strings koji sadrži markup koji želimo

    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
