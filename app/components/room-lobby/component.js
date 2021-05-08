import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { inject } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import config from "lor-card-ban-frontend/config/environment";
import { isEmpty } from "@ember/utils";

export default class RoomLobby extends Component {
  @inject playerRoomState;
  @inject user;
  @inject websockets;

  // pre submit, after submit this is ignored
  @tracked playerDecks = [];
  @tracked spotlightDeck;
  @tracked isFullDeckModalOpen = false;


  @computed("playerRoomState.numberOfDecks", "playerDecks.[]")
  get desktopDeckList() {
    const arr =  [...this.playerDecks];
    for(var c = 0; c < this.playerRoomState.numberOfDecks; c++) {
      if(!arr[c]) {
        arr[c] = false;
      }
    }
    return arr;
  }

  @computed("playerRoomState.{yourDecks,yourBans,otherBans}")
  get showDeckSubmit() {
    return isEmpty(this.playerRoomState.yourDecks);
  }

  @computed("playerRoomState.{yourDecks,yourBans,otherBans}")
  get showDeckBan() {
    return (
      !isEmpty(this.playerRoomState.yourDecks) &&
      isEmpty(this.playerRoomState.yourBans)
    );
  }

  @computed("playerRoomState.{yourDecks,yourBans,otherBans}")
  get showBanResult() {
    return (
      !isEmpty(this.playerRoomState.otherBans) &&
      !isEmpty(this.playerRoomState.yourBans)
    );
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

    socket.on("open", this.onOpen, this);
    socket.on("message", this.onMessage, this);
    socket.on("close", this.onClose, this);
  }

  onOpen() {
    console.log("opened connection");
  }

  onMessage(msg) {
    console.log(msg)
    this.playerRoomState.updateRoomState(msg.data);
  }

  onClose() {}

  @action
  addDeckToPlayerDecks(deck) {
    const index = this.desktopDeckList.indexOf(false);
    this.playerDecks[index] = deck;
    this.playerDecks = [...this.playerDecks];
  }

  @action
  removeDeck(index) {
    this.playerDecks.removeAt(index);
  }

  @action
  submitPlayerDecks() {
    const deckCodes = this.playerDecks.map((i) => i.deck.code).join(",");
    this.socketRef.send(`DECK_SUBMIT;${deckCodes}`);
  }

  @action
  banDeck(index) {
    this.socketRef.send(`BAN_SUBMIT;${index}`);
  }

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
  selectDraggedDeck(deck, index) {
    this.playerDecks[index] = deck;
    this.playerDecks = [...this.playerDecks];
  }
}
