import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  //JSDOC
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM => Optional
   * @returns {undefined | string }  A markup is returned if render=false
   * @this  {Object} View instance
   * @author Vedran Milović
   * @todo Finish implementation
   */

  render(data, render = true) {
    // tu su nam podaci iz model.js. Dolaze iz render() metode u controller.js
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // guard clause (ako je prazan array) => message već imamo iz this._errorMessage
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // tu generiramo novi markup i onda uspoređujemo sa starim te mijenjamo samo promjene
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*')); // stvara i puni novi array
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        console.log('👀', newEl.firstChild?.nodeValue.trim()); // ovaj cl ruši app bez optional chaininga, nebre pročitati nodelist
        // firstChild sadrži tekst koji želimo mijenjati
        curEl.textContent = newEl.textContent;
      }
      //Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._clear(); // clearamo parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // insertamo u element, prije početka
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
              <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
