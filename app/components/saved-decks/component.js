import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Deck from 'lor-card-ban-frontend/utils/Deck';



export default class SavedDecks extends Component {
  @inject savedDecks;

  @tracked spotlightDeck;

  @tracked isFullDeckModalOpen;
  @tracked isNewDeckModalOpen;

  @tracked isValidDeckCode;
  @tracked pastedDeckCode;

  @tracked deckName;

  @action
  showFullDeckList(deck, evt) {
    evt.stopPropagation();
    this.spotlightDeck = deck;
    this.isFullDeckModalOpen = true;
  }

  @action
  closeFullDeckModal() {
    this.isFullDeckModalOpen = false;
  }

  @action
  openNewDeckModal(evt) {
    evt.stopPropagation();
    window.scrollTo(0,0);
    this.pastedDeckCode = null;
    this.isNewDeckModalOpen = true;
    this.isValidDeckCode = null;
  }

  @action
  closeNewDeckModal() {
    this.isNewDeckModalOpen = false;
  }

  @action
  saveDeck() {
    this.savedDecks.saveDeck(this.spotlightDeck, this.deckName);
    this.isNewDeckModalOpen = false;
  }

  @action
  deleteDeck() {
    this.savedDecks.removeDeck(this.spotlightDeck.deck.code);
    this.isFullDeckModalOpen = false;
  }

  @action
  verifyDeckCode({ target }) {

    const deckCode = target.value;

    try {
      const deck = new Deck(deckCode);
      this.spotlightDeck = deck;
      this.isValidDeckCode = true;
      this.deckName = `${this.spotlightDeck.regions.join(' / ')} Deck`
    } catch(ex) {
      this.isValidDeckCode = false;
    }
  }
}
