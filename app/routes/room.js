import Route from '@ember/routing/route';

export default class RoomRoute extends Route {
  model(arg) {
    return {
      numberOfDecks: 3,
      numberOfBans: 1,
      state: 'FRESH',
      ...arg
    };
  }
}
