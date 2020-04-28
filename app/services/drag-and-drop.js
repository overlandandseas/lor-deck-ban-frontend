import Service from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { A } from '@ember/array';
import { computed } from '@ember/object';


export default class DragAndDropService extends Service {


  @tracked overDropZone = A([]);

  @tracked deckArray = [];

  @tracked banArray;

  @computed('deckArray')
  get allDecksGood() {
    const codeSet = new Set(this.deckArray.map(val => val && val.deck.code));
    return codeSet.size === this.deckArray.length;
  }

  dropItem(dragEvent, index) {
    dragEvent.preventDefault();
    this.overDropZone[index] = false;
    this.overDropZone = [...this.overDropZone];

    this.deckArray[index] = this.deck;
    this.deckArray = [...this.deckArray];
  }

  dragOver(dragEvent) {
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = "move";
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
    this.deckArray = new Array(numberOfDecks);
  }

  removeDeckFromList(index) {
    this.deckArray[index] = null;
    this.deckArray = [...this.deckArray];
  }
}
