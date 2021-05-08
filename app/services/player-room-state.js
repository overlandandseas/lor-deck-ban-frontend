import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class PlayerRoomStateService extends Service {

  @tracked yourDecks = [];

  @tracked otherDecks = [];

  @tracked yourBans = [];

  @tracked otherBans = [];

  @tracked connected = 0;

  @tracked numberOfDecks = 0;

  @tracked numberOfBans = 0;


  updateRoomState(data) {
    const jsonData = JSON.parse(data);

    this.yourDecks = jsonData.yourDecks;
    this.otherDecks = jsonData.otherDecks;
    this.yourBans = jsonData.yourBans;
    this.otherBans = jsonData.otherBans;
    this.connected = jsonData.connected;
    this.numberOfDecks = jsonData.numberOfDecks;
    this.numberOfBans = jsonData.numberOfBans;

    console.log("playerRoomState", this.numberOfDecks);
  }

}
