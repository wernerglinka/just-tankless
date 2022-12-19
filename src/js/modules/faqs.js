/* global window, document, IntersectionObserver */

/**
 * faqs
 * @params {*} none
 * @return {function} initializes faqs
 */
const faqs = (function () {
  const init = () => {
    const faqs = document.querySelectorAll('.js-faq');

    console.log(faqs);

    if (faqs) {

      faqs.forEach(faq => {
        faq.querySelector('h3').addEventListener('click', () => {
          faq.querySelector('div').classList.toggle('open');
        });
      });
    }
  };

  return { init };
})();

export default faqs;
