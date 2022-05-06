import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import config from 'lor-card-ban-frontend/config/environment';
import { tracked } from '@glimmer/tracking';
import Deck from 'lor-card-ban-frontend/utils/Deck';


export default class CreateRoom extends Component {

  @inject router;

  @inject user;

  @inject savedDecks;

  @tracked spotlightDeck;

  @tracked numberOfDecks = 3;

  @tracked numberOfBans = 1;

  @tracked banOptions = [1, 2];

  @tracked isValidDeckCode;
  @tracked pastedDeckCode;

  constructor() {
    super(...arguments);

    if (this.args.urlDeckCode) {
      this.verifyDeckCode({
        target: {
          value: this.args.urlDeckCode
        }
      })
      this.pastedDeckCode = this.args.urlDeckCode;
    }
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

  @action
  saveDeck() {
    this.savedDecks.saveDeck(this.spotlightDeck, this.deckName);
  }

  @action
  onNumberOfDecksChange(evt) {
    let options = [];
    for (let c = 1; c < evt.target.value; c++) {
      options.push(c);
    }

    this.numberOfDecks = evt.target.value;
    this.banOptions = options;
    this.numberOfBans = 1;
  }

  @action
  transitionUrl() {
    this.router.transitionTo('home', this.pastedDeckCode)
  }

  @action
  onNumberOfBansChange(evt) {
    this.numberOfBans = evt.target.value;
  }

  @action
  async createNewRoom() {


    const resp = await fetch(`${config.API_URL}/room`, {
      method: 'POST',
      body: JSON.stringify({
        numberOfDecks: this.numberOfDecks,
        numberOfBans: this.numberOfBans,
        user: this.user.getUser()
      }),
    });
    const { user, room } = await resp.json();
    this.user.setUser(user);
    this.router.transitionTo('room', room);
  }
}
