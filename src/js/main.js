/* global window */

import navigation from './modules/navigation';
import faqs from './modules/faqs';
import logosLists from './modules/logos';

function initPage() {
  navigation.init();
  faqs.init();
  logosLists.init();
}

window.addEventListener('load', () => {
  initPage();
});
