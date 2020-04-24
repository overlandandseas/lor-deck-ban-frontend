import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import config from "../config/environment";
import { DeckEncoder } from "runeterra";

/*
// # NEW_LOBBY
// # LOBBY_FOUND
// # LOBBY_FULL
//
// # 2_CONNECTED
//
// # HOST:DECK_SUBMITTED
// # GUEST:DECK_SUBMITTED
//
// # HOST:DECKS:000001 000002 000003
// # GUEST:DECKS:000001 000002 000003
//
// # HOST:BAN_CHOSEN
// # GUEST:BAN_CHOSEN
//
// # HOST:BAN:0 GUEST:BAN:1
*/

function checkValidity(decks) {
  console.dir(decks);
  let isValid = false;
  try {
    isValid =  decks.every(deck => DeckEncoder.isValidDeck(DeckEncoder.dencode(deck)))
  } catch (_) {
    console.log('invalid deck');
  }
  return isValid;
}

export default class BanGame extends Component {
  @inject websockets;

  socketRef = null;
  roomName = null;

  @tracked messages = [];

  @tracked otherPlayerConnected = false;

  @tracked decksSubmitted = false;
  @tracked otherPlayerDecksSubmitted = false;

  @tracked opponentDeckList = null;

  @tracked deckSelectionPhase = false;
  @tracked banSelectionPhase = false;

  @tracked banSelected = false;
  @tracked otherPlayerBanSubmitted = false;

  @tracked bannedDeckIdx = null;
  @tracked bannedDeck = null;
  @tracked bannedDeckString = null;

  @tracked opponentBannedDeck = null;
  @tracked opponentBannedDeckIdx = null;

  @tracked validDecks = false;

  constructor(_, { roomName }) {
    super(...arguments);
    this.roomName = roomName;
    const socket = this.websockets.socketFor(`${config.WS_URL}/${roomName}`);

    socket.on("open", this.onOpen, this);
    socket.on("message", this.onMessage, this);
    socket.on("close", this.onClose, this);

    this.socketRef = socket;
  }

  willDestroy() {
    this._super(...arguments);

    const socket = this.socketRef;

    socket.off("open", this.myOpenHandler);
    socket.off("message", this.myMessageHandler);
    socket.off("close", this.myCloseHandler);
  }

  onOpen(event) {
    console.log(`On open event has been called: ${event}`);
  }

  ping() {
    this.send("PING");
    console.log("PING");
    setTimeout(this.ping.bind(this), 5000);
  }

  onMessage({ data }) {
    if (data === "NEW_LOBBY") {
      this.openLobby();
      this.timeout = this.ping();
    }
    if (data === "LOBBY_FOUND") {
      this.lobbyFound();
      this.timeout = this.ping()
    }
    if (data === "2_CONNECTED") {
      this.otherPlayerConnected = true;
      this.deckSelectionPhase = true;
    }

    const splitData = data.split(":");

    if (splitData[0] === "DECK_SUBMITTED") {
      if (splitData[1] === this.role) {
        this.decksSubmitted = true;
      } else {
        this.otherPlayerDecksSubmitted = true;
      }
    }

    if (splitData[0] === "DECKS") {
      this.banSelectionPhase = true;
      this.deckSelectionPhase = false;
      if (splitData[1] !== this.role) {
        this.opponentDeckList = splitData[2].split("|").map(decodeURIComponent);
        this.validDecks = checkValidity(this.opponentDeckList)
        clearTimeout(this.timeout);
      }
    }

    if (splitData[0] === "BAN_CHOSEN") {
      if (splitData[1] === this.role) {
        this.banSelected = true;
      } else {
        this.otherPlayerBanSubmitted = true;
      }
    }

    if (splitData[0] === "BANNED") {
      if (splitData[1] !== this.role) {
        this.opponentBannedDeck = this[`deck${Number(splitData[2]) + 1}`];
        this.opponentBannedDeckIdx = Number(splitData[2]) + 1;
        this.bannedDeckString = this[`deck${Number(splitData[2]) + 1}`];
      }
    }

    console.log(`Server:`, data, new Date().toLocaleTimeString());
    this.messages = [...this.messages, `In: ${data}`];
  }

  onClose(event) {
    console.log(`On close event has been called: ${event}`);
  }

  send(message) {
    const socket = this.socketRef;
    this.messages = [...this.messages, `Out: ${message}`];
    socket.send(message);
  }

  openLobby() {
    this.opponentDeckList = null;
    this.decksSubmitted = false;
    this.otherPlayerConnected = false;
    this.deck1 = "";
    this.deck2 = "";
    this.deck3 = "";

    let role = localStorage.getItem(`${this.roomName}:ROLE`);
    if (!role) {
      role = "HOST";
      localStorage.setItem(`${this.roomName}:ROLE`, role);
    }
    this.role = role;
  }

  lobbyFound() {
    let role = localStorage.getItem(`${this.roomName}:ROLE`);

    if (!role) {
      role = "GUEST";
      localStorage.setItem(`${this.roomName}:ROLE`, role);
    }

    this.role = role;
  }

  @action
  submitDecks(evt) {
    evt.preventDefault();
    const deck1Encoded = encodeURIComponent(this.deck1);
    const deck2Encoded = encodeURIComponent(this.deck2);
    const deck3Encoded = encodeURIComponent(this.deck3);

    this.send(
      `DECK_SUBMIT:${this.role}:${deck1Encoded}|${deck2Encoded}|${deck3Encoded}`
    );
  }

  @action
  banDeck(evt) {
    evt.preventDefault();
    const bannedDeck = evt.target["op-deck"].value;
    this.send(`BAN:${this.role}:${bannedDeck}`);
    this.bannedDeckIdx = bannedDeck;
    this.bannedDeck = this.opponentDeckList[bannedDeck];
  }
}