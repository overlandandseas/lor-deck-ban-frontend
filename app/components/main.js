import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import config from '../config/environment';
import { tracked } from '@glimmer/tracking';

export default class Main extends Component {
  @inject router;

  @tracked numberOfDecks = 3;

  @tracked numberOfBans = 1;

  @tracked banOptions = [1, 2];

  selectionItems = [
    'English',
    'Türk',
    '日本語',
  ];

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
  onNumberOfBansChange(evt) {
    this.numberOfBans = evt.target.value;
  }

  @action
  async createNewRoom() {
    const resp = await fetch(config.API_URL, {
      method: 'POST',
      body: JSON.stringify({
        numberOfDecks: this.numberOfDecks,
        numberOfBans: this.numberOfBans
      })
    });
    const roomName = await resp.text();
    this.router.transitionTo('room', roomName);
  }
}
