import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'lor-card-ban-frontend/config/environment';
import { isEmpty } from '@ember/utils';


export default class RoomLobby extends Component {

  @inject playerRoomState;
  @inject user;
  @inject websockets;

  // pre submit, after submit this is ignored
  @tracked playerDecks = [];
  @tracked spotlightDeck;
  @tracked isFullDeckModalOpen = false;


  @computed('playerRoomState.{yourDecks,yourBans,otherBans}')
  get showDeckSubmit() {
    return isEmpty(this.playerRoomState.yourDecks);
  }

  constructor(_, { roomName }) {
    super(...arguments);
    this.roomName = roomName;

    this._connectToWebSocket();
  }

  async _connectToWebSocket() {
    const userCode = await this.user.getUserFromServer();

    const socket = this.websockets.socketFor(
      `${config.WS_URL}/websocket/${this.roomName}/${userCode}`
    );

    this.socketRef = socket;

    socket.on('open', this.onOpen, this);
    socket.on('message', this.onMessage, this);
    socket.on('close', this.onClose, this);
  }

  onOpen(){
    console.log('opened connection')
  }

  onMessage(msg) {
    this.playerRoomState.updateRoomState(msg.data);
  }


  onClose() {

  }

  @action
  addDeckToPlayerDecks(deck) {
    this.playerDecks.pushObject(deck);
  }

  @action
  removeDeck(index) {
    this.playerDecks.removeAt(index);
  }

  submitPlayerDecks() {

  }

  @action
  showFullDeckList(deck, evt) {
    evt.stopPropagation()
    this.spotlightDeck = deck;
    this.isFullDeckModalOpen = true;
  }

  @action
  closeFullDeckModal(){
    this.isFullDeckModalOpen = false;
  }
}
