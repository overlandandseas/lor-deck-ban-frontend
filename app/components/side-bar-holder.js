import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { computed } from '@ember/object';
import { action } from "@ember/object";


import Deck from 'lor-card-ban-frontend/utils/Deck'


export default class DeckThumbnail extends Component {

  @tracked isModalOpen = false;


  constructor(){
    super(...arguments)
    this.deck = new Deck("CEBACAIADIDACBILEAUTAMJ2AIBACAAPGYDACBIJB4NB2IRIAIAQCBIZAIAQAAQ3")
    this.deck2 = new Deck("CEBAMAIBAEFREFRHFIDACBABBAERSHB2AEBACBAHGUAA");
    this.deck3 = new Deck("CEBAIAIACILCMKYFAEBQYGRGFM3QEAQBAMERSBABAAEQ2GRHAEAQCABS")
    this.deck4 = new Deck("CEBAEAIDEQXAOAICAIEAYDZEEU4QEAIBAM3AKAICA4QS4MJYAEAQCAZR")
  }


  @action
  openModal(evt) {
    evt.stopPropagation()
    this.isModalOpen = true
  }


  @action
  closeModal() {
    this.isModalOpen = false;
  }

}
