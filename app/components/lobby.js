import Component from "@glimmer/component";
import config from "../config/environment";
import { inject } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import Deck from 'lor-card-ban-frontend/utils/Deck'

const DELIMITER = ";";

export default class Lobby extends Component {
  @inject websockets;

  @inject dragAndDrop;

  @tracked messages = [];

  @tracked numberOfBans;
  @tracked numberOfDecks;

  @tracked otherPlayerConnected = false;
  @tracked decksSubmitted = false;
  @tracked showDeckSelection = false;

  @tracked showBanSelection = false;
  @tracked bansSubmitted = false;
  @tracked yourDecks;
  @tracked opponentDecks;
  @tracked opponentBans;

  @tracked role;

  @tracked viewDeck;
  @tracked viewDeckName;
  @tracked isViewDeckModalOpen = false;


  constructor(_, { roomName }) {
    super(...arguments);
    this.roomName = roomName;
    const socket = this.websockets.socketFor(
      `${config.WS_URL}websocket/${roomName}`
    );

    socket.on("open", this.onOpen, this);
    socket.on("message", this.onMessage, this);
    socket.on("close", this.onClose, this);

    this.socketRef = socket;
  }

  @action
  removeDeckFromList(index) {
    this.dragAndDrop.removeDeckFromList(index);
  }

  @action
  openViewDeckModal(deck, deckName, evt) {
    evt.stopPropagation();
    this.isViewDeckModalOpen = true;
    this.viewDeck = deck;
    this.viewDeckName = deckName;
  }

  @action
  closeViewDeckModal(deck, deckName) {
    this.isViewDeckModalOpen = false;
    this.viewDeck = null;
    this.viewDeckName = "";
    console.log("closed view deck modal");
  }

  @action
  submitDecks() {
    const codeString = this.dragAndDrop.deckArray
      .map((val) => {
        return {
          name: val.name,
          code: val.deck.code,
        };
      });

    this.send(`DECK_SUBMIT;${this.role};${JSON.stringify(codeString)}`);
    this.decksSubmitted = true;
  }

  @action
  submitBans() {
    const banString = this.opponentDecks.reduce((acc, val, index) => {
      if (val.isBanned){
        acc.push(index)
      }
      return acc;
    }, []);

    this.send(`BAN_SUBMIT;${this.role};${JSON.stringify(banString)}`);
    this.bansSubmitted = true;
  }

  onOpen(event) {
    console.log(`Connected event has been called: ${event}`);
    this.ping();
  }


  onMessage({ data }) {
    this.messages = [...this.messages, `In: ${data}`];
    this.messageController(data);
  }

  onClose(event) {
    console.log(`On close event has been called: ${event}`);
  }

  ping() {
    this.send("PING");
    setTimeout(this.ping.bind(this), 10000);
  }

  send(message) {
    const socket = this.socketRef;
    this.messages = [...this.messages, `Out: ${message}`];
    socket.send(message);
  }

  messageController(message) {
    const [task, ...data] = message.split(DELIMITER);

    // Set Host or Guest
    if (task === "NEW_LOBBY" || task === "LOBBY_FOUND") {
      // new lobby
      this.setUserRole(task);
    } else if (task === "ROOM_INFO") {
      // info about room
      this.setupRoomOptions(data);
    } else if (task === "CONNECTED") {
      // number of players connected or disconnected
      this.otherPlayerConnected = Number(data) === 2;
    } else if (task === "DECK_SUBMITTED") {
      this.handleDeckSubmitted(data[0]);
    } else if (task === "DECKS") {
      this.handleDecks(data);
    } else if (task === "BANNED") {
      this.handleBans(data);
    }
  }

  setupRoomOptions(data) {
    const { numberOfDecks, numberOfBans } = JSON.parse(data);
    this.numberOfBans = numberOfBans;
    this.numberOfDecks = numberOfDecks;

    this.dragAndDrop.setDeckArray(numberOfDecks);
    this.showDeckSelection = true;

    // reset state
    this.yourDecks = null;
    this.opponentDecks = null;
  }

  setUserRole(task) {
    let role = sessionStorage.getItem(`${this.roomName}:ROLE`);
    if (!role) {
      role = task === "NEW_LOBBY" ? "HOST" : "GUEST";
      sessionStorage.setItem(`${this.roomName}:ROLE`, role);
    }
    this.role = role;
  }

  handleDeckSubmitted(role) {
    if (role !== this.role) {
      this.otherPlayerDecksSubmitted = true;
    }
  }

  handleDecks(data) {

    if (data[0] === this.role) {
      this.yourDecks = JSON.parse(data[1]).map(val => {
        return {
          name: val.name,
          deck: new Deck(val.code)
        }
      })
    } else {
      this.opponentDecks = JSON.parse(data[1]).map(val => {
        return {
          name: val.name,
          deck: new Deck(val.code)
        }
      });
    }

    if (this.yourDecks && this.opponentDecks) {
      this.showDeckSelection = false;
      this.showBanSelection = true;
    }

  }

  handleBans(data){
    if (data[0] !== this.role) {
      const banArray = JSON.parse(data[1]);

      this.yourDecks = this.yourDecks.map(({name, deck}, index) => {
        return {
          name,
          deck,
          isBanned: banArray.includes(index)
        }
      });
      this.opponentBans = this.yourDecks.filter( i => i.isBanned).map(i => i.name).join(', ')
    }
  }
}
