import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Deck from 'lor-card-ban-frontend/utils/Deck';


export default class SelectDeckModal extends Component {

  @inject savedDecks;

  @tracked showFullDeckList = false;

  @tracked isValidDeckCode = false;

  @tracked spotlightDeck;


  @action
  onShowFullDeckList(deck, evt) {
    evt.stopPropagation();
    this.showFullDeckList = true;
    this.spotlightDeck = deck;
  }

  @action
  onCloseFullDeckList(evt) {
    evt.stopPropagation();
    this.showFullDeckList = false;
  }

  @action
  verifyDeckCode({ target }) {

    const deckCode = target.value;

    try {
      const deck = new Deck(deckCode);
      this.pastedDeck = deck;
      this.isValidDeckCode = true;
    } catch(ex) {
      this.isValidDeckCode = false;
    }
  }

  @action
  selectPastedDeck() {
    this.args.selectDeck({
      deck: this.pastedDeck,
      name: `${this.pastedDeck.regions.join(' / ')} Deck`
    });
  }

  closeViewDeckModal() {
    console.log('close view deck');
  }
}
