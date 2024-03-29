import { DeckEncoder } from 'runeterra';
import set1 from 'lor-card-ban-frontend/fixtures/set1-en_us';
import set2 from 'lor-card-ban-frontend/fixtures/set2-en_us';
import set3 from 'lor-card-ban-frontend/fixtures/set3-en_us';
import set4 from 'lor-card-ban-frontend/fixtures/set4-en_us';
import set5 from 'lor-card-ban-frontend/fixtures/set5-en_us';
import { set } from '@ember/object';

const DATA_MAP = {};

set1.forEach(card => {
  DATA_MAP[card.cardCode] = card;
});

set2.forEach(card => {
  DATA_MAP[card.cardCode] = card;
});

set3.forEach(card => {
  DATA_MAP[card.cardCode] = card;
});

set4.forEach(card => {
  DATA_MAP[card.cardCode] = card;
});

set5.forEach(card => {
  DATA_MAP[card.cardCode] = card;
});

export default class Deck {
  constructor(deckCode) {
    this.spells = [];
    this.followers = [];
    this.champions = [];
    this.landmarks = [];
    this.cards = [];
    this.regions = [];
    this.regionsObj = {};

    this.code = deckCode;

    this.decodedDeck = DeckEncoder.decode(deckCode);
    this.decodedDeck.forEach(card => {
      const cardObj = Object.assign({}, DATA_MAP[card.code]);
      set(cardObj, 'count', card.count);
      cardObj.regionRef = cardObj.regionRefs[0];
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
        if (cardObj.rarity === 'Champion') {
          this.champions.push(cardObj);
        } else {
          this.followers.push(cardObj);
        }
      }

      // Landmarks
      if (cardObj.type === 'Landmark') {
        this.landmarks.push(cardObj);
      }
    });

    this.regions = Object.keys(this.regionsObj);
    this.regions.sort((a, b) => this.regionsObj[b] - this.regionsObj[a]);

    this.spells.sort((a, b) => a.cost - b.cost);
    this.followers.sort((a, b) => a.cost - b.cost);
    this.champions.sort((a, b) => a.cost - b.cost);
  }
}
