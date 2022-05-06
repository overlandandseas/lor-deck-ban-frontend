import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {

  this.route('room', {path: 'r/:room_name'});
  this.route('about');
  this.route('updates');
  this.route('test');
  this.route('home', {
    path: '/:deck_code'
  });
  this.route('index', {
    path: '/'
  });
});
