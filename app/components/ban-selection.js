import Component from "@glimmer/component";
import { computed } from '@ember/object';
export default class Lobby extends Component {

  @computed('args.opponentDecks.@each.isBanned', 'args.numberOfBans')
  get validBansChosen() {
    return this.args.opponentDecks.filter(val => val.isBanned).length === this.args.numberOfBans;
  }
}
