import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';



export default class DeckSubmit extends Component {
  @inject playerRoomState;

  @tracked showSelectDeckModal = false;

  @computed('args.playerDecks.length', 'playerRoomState.numberOfDecks')
  get showSubmitDeckButton() {
    return this.args.playerDecks.length >= this.playerRoomState.numberOfDecks;
  }

  @action
  onOpenSelectDeckModal(evt) {
    evt.stopPropagation();

    this.showSelectDeckModal = true;
  }

  @action
  oncloseSelectDeckModal() {
    this.showSelectDeckModal = false;
  }

  @action
  selectDeck(deck) {
    this.showSelectDeckModal = false;
    this.args.addDeckToPlayerDecks(deck);
  }
}
