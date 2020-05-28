import { mapOverDropZone } from 'lor-card-ban-frontend/utils/check-drop-zones';
import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class OnTouchmoveModifier extends Modifier {
  @inject dragAndDrop;

  @action
  handleTouchmove(event) {
    const touch = event.targetTouches[0];
    this.clone.style.left = `${touch.pageX - this.width / 2}px`;
    this.clone.style.top = `${touch.pageY - this.height / 2}px`;
    const found = mapOverDropZone(touch.pageX, touch.pageY);
    found.forEach(val => {
      if (val.found) {
        console.log('found', val.index, this.dragAndDrop.overDropZone);
        this.dragAndDrop.dropEnter(val.index);
      } else {
        this.dragAndDrop.dropLeave(val.index);
      }
    });
  }

  @action
  handleTouchstart() {
    this.clone.style.position = 'absolute';
    this.clone.style['z-index'] = 2;
    this.element.insertAdjacentElement('afterend', this.clone);
    this.args.positional[0]();

    this.element.addEventListener('touchmove', this.handleTouchmove);
    this.element.addEventListener('touchend', this.handleTouchend);
  }

  @action
  handleTouchend(event) {
    const lastFoundIndex = this.dragAndDrop.overDropZone.findIndex(i => i);
    console.log('drop', lastFoundIndex);
    if (lastFoundIndex !== -1) {
      this.dragAndDrop.dropItem(event, lastFoundIndex);
      console.log('dropped', this.dragAndDrop.overDropZone);
    }

    this.element.parentElement.removeChild(this.clone);
  }

  didInstall() {
    const { width, height } = this.element.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.clone = this.element.cloneNode(true);
    this.element.addEventListener('touchstart', this.handleTouchstart);
  }
}
