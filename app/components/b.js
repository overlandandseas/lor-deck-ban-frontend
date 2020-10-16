import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';


export default class B extends Component {
  @inject('saved-decks') savedDecks;



  @computed('savedDecks.deckList')
  get atLeastOneDeck() {
    return !isEmpty(this.savedDecks.deckList);
  }
}
