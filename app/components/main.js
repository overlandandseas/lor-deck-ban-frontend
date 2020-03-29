import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject } from "@ember/service";

export default class Main extends Component {
  @inject router;

  @action
  async createNewRoom(person) {
    const resp = await fetch("http://localhost:4567/", {
      method: "POST"
    });
    const roomName = await resp.text();
    this.router.transitionTo("room", roomName);
  }
}
