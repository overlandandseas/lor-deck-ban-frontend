import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';



export default class DeckSubmit extends Component {
  @inject playerRoomState;

  @tracked showSelectDeckModal = false;

  @computed('args.playerDecks.[]', 'playerRoomState.numberOfDecks')
  get showSubmitDeckButton() {
    return this.args.playerDecks.filter(i => i).length >= this.playerRoomState.numberOfDecks;
  }

  @computed('playerRoomState.connected')
  get isOtherPlayerConnected() {
    return this.playerRoomState.connected > 1;
  }

  @computed('args.playerDecks.[]')
  get numberOfDecksPresent() {
    return this.args.playerDecks.filter(i => i).length;
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
