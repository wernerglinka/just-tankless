/* global window */

import barba from '@barba/core';
import barbaCSS from '@barba/css';
import navigation from './modules/navigation';
import faqs from './modules/faqs';

function initPage() {
  // Note that when using BarbaCSS the leave() and enter() hook are not executed.
  // Only the before- and after- hooks are executed.
  barba.use(barbaCSS);

  barba.init({
    transitions: [
      {
        // "home" is used in the transition class attribute.
        name: 'home',
        once() {}
      },
      {
        // "fade" is used in the transition class attribute.
        name: 'fade',
        to: {
          namespace: ['barbaPage']
        },
        beforeLeave() {},
        leave() {},
        afterLeave() {
          navigation.init();
        },
        enter() {
          faqs.init();
        }
      }
    ]
  });
  navigation.init();
  faqs.init();
}

window.addEventListener('load', () => {
  initPage();
});
