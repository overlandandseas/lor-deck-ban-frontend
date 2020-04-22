import Service from '@ember/service';
import Deck from 'lor-card-ban-frontend/utils/Deck'


export default class SavedDecksService extends Service {

  constructor() {
    super(...arguments);

    this.deckCodeList = JSON.parse(localstorage.getItem("deckCodeList"));


    this.deckList = this.deckCodeList.map(code => new Deck(code));
  }



  saveDeck(deck) {
    this.deckCodeList.push(deck.code)

    this.deckList.push(deck);
  }


  removeDeck(deck) {
    this.deckCodeList = this.deckCodeList.filter(code => code !== deck.code);
    this._saveStorage();

    this.deckList = this.deckList.filter(d => d.code !== deck.code);
  }


  _saveStorage(){
    localStorage.setItem("deckCodeList", JSON.stringify(this.deckCodeList))
  }
}
