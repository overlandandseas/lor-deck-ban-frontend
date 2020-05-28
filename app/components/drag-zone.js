import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class DragZone extends Component {
  @inject dragAndDrop;

  @action
  dragHasStarted() {
    this.dragAndDrop.dragHasStarted(this.args.deck);
  }

  dragStart = this.dragAndDrop.dragHasStarted.bind(this);
}
