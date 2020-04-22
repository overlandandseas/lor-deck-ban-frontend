import Component from "@glimmer/component";
import {DeckEncoder} from 'runeterra';
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';

import {DECK_MAP} from './card-data';


export default class DeckCard extends Component {

  @tracked deckCode;

  @computed('deckCode')
  get cards() {
    let cards = [];
    try {
      cards = DeckEncoder.decode(this.args.deckCode).map(card => {
        card.name = DECK_MAP[card.code];
        return card;
      });
    } catch (_) {
      console.log('invalid deck');
    }
    return cards;
  }
}
