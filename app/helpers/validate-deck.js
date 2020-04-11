import { helper } from '@ember/component/helper';
import {DeckEncoder} from 'runeterra'

export default helper(function validateDeck(params/*, hash*/) {

  const deckCode = [ params ]
  if (typeof deckCode !== "string") {
    return true;
  }
  
  if (deckCode.trim().length === 0) {
    return true;
  }

  try {
    return DeckEncoder.isValidDeck(DeckEncoder.dencode(params))
  } catch(_) {
      return false;
  }
});
