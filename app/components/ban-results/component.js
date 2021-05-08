import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Deck from 'lor-card-ban-frontend/utils/Deck';
import { isEmpty } from '@ember/utils';



export default class BanResults extends Component {
  @inject playerRoomState;

  @computed('playerRoomState.otherDecks')
  get otherPlayerDecks(){
    if (!isEmpty(this.playerRoomState.otherDecks)) {
      return this.playerRoomState.otherDecks[0].map(code => {
        const deck = new Deck(code);
        return {
          name: `${deck.regions.join(' / ')} Deck`,
          deck
        }
      })
    } else {
      return [];
    }
  }

  @computed('playerRoomState.yourDecks')
  get yourDecks() {
    if (isEmpty(this.args.playerDecks)) {
      return this.playerRoomState.yourDecks.map(code => {
        const deck = new Deck(code);
        return {
          name: `${deck.regions.join(' / ')} Deck`,
          deck
        }
      })
    } else {
      return this.args.playerDecks;
    }
  }

}
