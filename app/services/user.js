import Service from '@ember/service';
import config from 'lor-card-ban-frontend/config/environment';


export default class UserService extends Service {


  getUser() {
    return sessionStorage.getItem('user');
  }

  setUser(user) {
    sessionStorage.setItem('user', user);
  }

  async getUserFromServer() {
    let user = this.getUser();

    if(!user) {

      const resp = await fetch(`${config.API_URL}/user`, {
        method: 'GET'
      });

      user = await resp.text();
    }
    this.setUser(user);
    return user;
  }

}
