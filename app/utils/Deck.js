import { DeckEncoder } from 'runeterra';
import { DATA_MAP } from 'lor-card-ban-frontend/utils/set-1-data'
import { set } from '@ember/object';


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
      const region = cardObj.region.replace(/\s/g, '')
      if (this.regionsObj[cardObj.region]) {
        this.regionsObj[cardObj.region] += 1;
      } else {
        this.regionsObj[cardObj.region] = 1;
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
