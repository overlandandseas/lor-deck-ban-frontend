import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';
import { action } from "@ember/object";
import Deck from 'lor-card-ban-frontend/utils/Deck'
import { DeckEncoder } from 'runeterra'
import { inject } from '@ember/service';



export default class DeckThumbnail extends Component {



  @inject('saved-decks') savedDecks;

  @tracked isNewDeckModalOpen = false;

  @tracked isViewDeckModalOpen = false;

  @tracked deckCode;

  @tracked newDeckName;

  @tracked viewDeck;

  @tracked viewDeckName;


  @computed('deckCode')
  get newDeck() {
    let deckObj;

    if (this.deckCode) {
      try {
        deckObj = new Deck(this.deckCode)
      } catch (_) {}
    }
    return deckObj;
  }


  @computed('deckCode', 'newDeck')
  get isValidDeck() {
    if (!this.newDeck || !this.deckCode) {
      return false
    }

    return DeckEncoder.isValidDeck(this.newDeck.decodedDeck);
  }

  @action
  openNewDeckModal(evt) {
    evt.stopPropagation()
    this.isNewDeckModalOpen = true
  }


  @action
  closeNewDeckModal() {
    this.deckCode = '';
    this.newDeckName = '';
    this.isNewDeckModalOpen = false;
  }


  @action
  saveDeck() {
    if(!this.newDeckName) {
      this.newDeckName = `${this.newDeck.regions.join(' / ')} Deck`
    }
    this.savedDecks.saveDeck(this.newDeck, this.newDeckName);
    this.deckCode = '';
    this.newDeckName = '';
    this.isNewDeckModalOpen = false;
  }

  @action
  openViewDeckModal(deck, deckName, evt) {
    evt.stopPropagation()
    this.isViewDeckModalOpen = true;
    this.viewDeck = deck;
    this.viewDeckName = deckName;
  }

  @action
  closeViewDeckModal(deck, deckName) {
    this.isViewDeckModalOpen = false;
    this.viewDeck = null;
    this.viewDeckName = '';
  }

  @action
  removeDeck() {
    if (window.confirm(`Are you sure you want to remove deck: ${this.viewDeckName}?`)) {
      this.savedDecks.removeDeck(this.viewDeck.code);
      this.isViewDeckModalOpen = false;
      this.viewDeck = null;
      this.viewDeckName = '';
    }
  }

}
