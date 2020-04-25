import Component from "@glimmer/component";
import config from "../config/environment";
import { inject } from "@ember/service";
// import { DeckEncoder } from "runeterra";
// import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

const DELIMITER = ";";

export default class Lobby extends Component {
  @inject websockets;

  @tracked messages = [];

  @tracked numberOfBans;

  @tracked numberOfDecks;

  constructor(_, { roomName }) {
    super(...arguments);
    this.roomName = roomName;
    const socket = this.websockets.socketFor(`${config.WS_URL}/${roomName}`);

    socket.on("open", this.onOpen, this);
    socket.on("message", this.onMessage, this);
    socket.on("close", this.onClose, this);

    this.socketRef = socket;
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
    console.log("PING");
    setTimeout(this.ping.bind(this), 5000);
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
      this.setUserRole(task);
    } else if (task === "ROOM_INFO") {
      this.setupRoomOptions(data);
    }
  }

  setupRoomOptions(data) {
    const { numberOfDecks, numberOfBans } = JSON.parse(data);
    this.numberOfBans = numberOfBans;
    this.numberOfDecks = numberOfDecks;
  }

  setUserRole(task) {
    let role = localStorage.getItem(`${this.roomName}:ROLE`);
    if (!role) {
      role = task === "NEW_LOBBY" ? "HOST" : "GUEST";
      localStorage.setItem(`${this.roomName}:ROLE`, role);
    }
    this.role = role;
  }
}
