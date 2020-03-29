import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject } from "@ember/service";
import config from "../config/environment";

export default class Main extends Component {
  @inject router;

  @action
  async createNewRoom(person) {
    const resp = await fetch(config.API_URL, {
      method: "POST"
    });
    const roomName = await resp.text();
    this.router.transitionTo("room", roomName);
  }
}
