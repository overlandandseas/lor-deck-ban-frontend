import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class WaitingDots extends Component {
  @tracked dots = '.';

  constructor() {
    super(...arguments);

    setInterval(this.addOrResetDots.bind(this), 700);
  }

  addOrResetDots() {
    if (this.dots === '...') {
      this.dots = '.';
    } else {
      this.dots = `${this.dots}.`;
    }
  }
}
