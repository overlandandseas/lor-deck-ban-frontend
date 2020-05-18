import Service from '@ember/service';
import Deck from 'lor-card-ban-frontend/utils/Deck'
import { set } from '@ember/object';


export default class SavedDecksService extends Service {

  constructor() {
    super(...arguments);

    const storageItem = localStorage.getItem('deckCodeList')

    if (storageItem) {
      this.deckCodeList = JSON.parse(storageItem);
    } else {
      this.deckCodeList = []
    }

    this.deckList = this.deckCodeList.map(val => {
      return {
        name: val.name,
        deck: new Deck(val.deckCode)
      }
    });
  }



  saveDeck(deck, name) {
    set(this, 'deckCodeList', [...this.deckCodeList, { name, deckCode: deck.code }]);
    set(this, 'deckList', [...this.deckList, { name, deck }]);

    this._saveStorage();
  }


  removeDeck(code) {
    set(this, 'deckCodeList', this.deckCodeList.filter(val => val.deckCode !== code));
    set(this, 'deckList', this.deckList.filter(val => val.deck.code !== code));

    this._saveStorage();
  }


  _saveStorage() {
    localStorage.setItem('deckCodeList', JSON.stringify(this.deckCodeList))
  }
}
