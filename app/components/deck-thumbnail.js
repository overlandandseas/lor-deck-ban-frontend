import Component from "@glimmer/component";
import { computed } from '@ember/object';

import {DECK_MAP} from './card-data';


export default class DeckThumbnail extends Component {


  @computed('args.deck')
  get primaryRegion() {
    return this.args.deck.regions[0].replace(/\s|&/g, '')
  }

}
