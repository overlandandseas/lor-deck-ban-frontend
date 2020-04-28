import Component from "@glimmer/component";
import { computed } from '@ember/object';
import { action } from "@ember/object";
import { inject } from '@ember/service';


export default class DragZone extends Component {

  @inject dragAndDrop;


  @action
  dragHasStarted() {
    this.dragAndDrop.dragHasStarted(this.args.deck)
  }

}
