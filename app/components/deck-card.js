import Component from "@glimmer/component";
import {DeckEncoder} from 'runeterra';
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';

export default class DeckCard extends Component {

  @tracked deckCode;

  constructor(_, { deckCode }) {
    super(...arguments);
    // debugger
  }

  @computed('deckCode')
  get cards() {
    let cards = [];
    try {
      cards = DeckEncoder.decode(this.args.deckCode);
    } catch (_) {
      console.log('invalid deck');
    }
    return cards;
  }

}
