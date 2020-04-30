import { DeckEncoder } from 'runeterra';
import set1 from 'lor-card-ban-frontend/fixtures/set1-en_us'
import set2 from 'lor-card-ban-frontend/fixtures/set2-en_us'
import { set } from '@ember/object';

const DATA_MAP = {}

set1.forEach(card => {
  DATA_MAP[card.cardCode] = card
})

set2.forEach(card => {
  DATA_MAP[card.cardCode] = card
})


export default class Deck {


   constructor(deckCode) {
    this.spells = [];
    this.followers = [];
    this.champions = [];
    this.cards = [];
    this.regionsObj = {};

    this.code = deckCode;

    this.decodedDeck = DeckEncoder.decode(deckCode);

    this.decodedDeck.forEach(card => {
      const cardObj = DATA_MAP[card.code];
      set(cardObj, 'count', card.count);
      this.cards.push(cardObj);

      // Region
      if (this.regionsObj[cardObj.regionRef]) {
        this.regionsObj[cardObj.regionRef] += 1;
      } else {
        this.regionsObj[cardObj.regionRef] = 1;
      }

      // Spell
      if (cardObj.type === 'Spell') {
        this.spells.push(cardObj);
      }

      // Follower or Champion
      if (cardObj.type === 'Unit') {
        if(cardObj.rarity === 'Champion') {
          this.champions.push(cardObj);
        } else {
          this.followers.push(cardObj);
        }
      }
    });


    this.regions = Object.keys(this.regionsObj);
    this.regions.sort((a, b) => this.regionsObj[b] - this.regionsObj[a]);

    this.spells.sort((a, b) => a.cost - b.cost)
    this.followers.sort((a, b) => a.cost - b.cost)
    this.champions.sort((a, b) => a.cost - b.cost)

  }
}
