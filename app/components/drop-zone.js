import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class DropZone extends Component {
  @inject dragAndDrop;

  @action
  dropItem(idx, evt) {
    this.dragAndDrop.dropItem(evt, idx);
  }

  @action
  dragOver(evt) {
    this.dragAndDrop.dragOver(evt);
  }

  @action
  dropLeave(idx) {
    this.dragAndDrop.dropLeave(idx);
  }

  @action
  dropEnter(idx) {
    this.dragAndDrop.dropEnter(idx);
  }
}
