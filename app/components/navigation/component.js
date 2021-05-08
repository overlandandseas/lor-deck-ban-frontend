import Component from '@glimmer/component';
import { action } from '@ember/object';


export default class Navigation extends Component {

  @action
  onShowSidebar() {
    const sidebar = document.getElementById('nav-sidebar');
    const hamburger = document.getElementById('nav-hamburger');
    const sidebarWidth = sidebar.getBoundingClientRect().width;

    sidebar.classList.toggle('transform-off');

    hamburger.style.transform = hamburger.style.transform ? '' : 'translate3d(-' + sidebarWidth + 'px, 0, 0)';

  }

  @action
  onClickOutside() {
    const sidebar = document.getElementById('nav-sidebar');
    const hamburger = document.getElementById('nav-hamburger');

    hamburger.style.transform = '';
    sidebar.classList.add('transform-off');
  }

}
