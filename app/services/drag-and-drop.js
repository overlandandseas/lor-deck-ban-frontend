import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';


export default class DragAndDropService extends Service {
  @tracked overDropZone = A([]);

  @tracked banArray;

  dropItem(dragEvent, index) {
    dragEvent.preventDefault();
    this.overDropZone[index] = false;
    this.overDropZone = [...this.overDropZone];
  }

  dragOver(dragEvent) {
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = 'move';
  }

  dropLeave(index) {
    this.overDropZone[index] = false;
    this.overDropZone = [...this.overDropZone];
  }

  dropEnter(index) {
    this.overDropZone[index] = true;
    this.overDropZone = [...this.overDropZone];
  }

  dragHasStarted(deck) {
    this.deck = deck;
  }

  setDeckArray(numberOfDecks) {
    this.deckArray = new Array(numberOfDecks).fill(false);
  }

  removeDeckFromList(index) {
    this.deckArray[index] = false;
    this.deckArray = [...this.deckArray];
  }
}
