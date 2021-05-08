import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';


export default class PlayerStatus extends Component {
  @inject playerRoomState;

  @computed('playerRoomState.{connected,otherBans,otherDecks}')
  get opponentStatus() {
    if (this.playerRoomState.connected < 2) {
      return {
        class:'waiting',
        image: 'waiting.jpg',
        text: 'Waiting for opponent.'
      };
    }

    if (!isEmpty(this.playerRoomState.otherBans)) {
      return {
        class: 'bans',
        image: 'bans.jpg',
        text: `Opponent submitted ${this.playerRoomState.numberOfBans > 1 ? 'bans' : 'ban'}.`
      };
    }

    if (!isEmpty(this.playerRoomState.otherDecks)) {
      return {
        class: 'decks',
        image: 'sword.jpg',
        text: 'Opponent submitted decks.'
      };
    }

    return {
      class: 'connected',
      image: 'connected.jpg',
      text: 'Opponent connected.'
    };
  }

  @computed('playerRoomState.{yourDecks,yourBans,otherBans}')
  get playerStatus() {

    if (isEmpty(this.playerRoomState.yourDecks)) {
      return 'Submit your decks';
    }

    if (isEmpty(this.playerRoomState.otherDecks)) {
      return 'Waiting for opponent to submit decks.';
    }

    if (isEmpty(this.playerRoomState.yourBans)) {
      return `Submit which ${this.playerRoomState.numberOfBans === 1 ? 'deck' : 'decks'} to ban.`;
    }

    if (isEmpty(this.playerRoomState.otherBans)) {
      return 'Waiting for opponent to submit bans.';
    }

    return '';
  }

}
