import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class RoomRoute extends Route {


  model(arg) {
    return {
      numberOfDecks: 3,
      numberOfBans: 1,
      state: 'FRESH',
      ...arg
    }
  }

}
