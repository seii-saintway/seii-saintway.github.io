/**
 * Tabs tag listener (without twitter bootstrap).
 */

var registerTabsTag = function() {
  // Binding `nav-tabs` & `tab-content` by real time permalink changing.
  document.querySelectorAll('.tabs ul.nav-tabs .tab').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault();
      // Prevent selected tab to select again.
      if (element.classList.contains('active')) return;
      const nav = element.parentNode;
      // Get the height of `tab-pane` which is activated before, and set it as the height of `tab-content` with extra margin / paddings.
      const tabContent = nav.nextElementSibling;
      tabContent.style.overflow = 'hidden';
      tabContent.style.transition = 'height 1s';
      // Comment system selection tab does not contain .active class.
      const activeTab = tabContent.querySelector('.active') || tabContent.firstElementChild;
      // Hight might be `auto`.
      const prevHeight = parseInt(window.getComputedStyle(activeTab).height.replace('px', ''), 10) || 0;
      const paddingTop = parseInt(window.getComputedStyle(activeTab).paddingTop.replace('px', ''), 10);
      const marginBottom = parseInt(window.getComputedStyle(activeTab.firstElementChild).marginBottom.replace('px', ''), 10);
      tabContent.style.height = prevHeight + paddingTop + marginBottom + 'px';
      // let the height be adaptive
      tabContent.style.height = '';
      // Add & Remove active class on `nav-tabs` & `tab-content`.
      [...nav.children].forEach(target => {
        target.classList.toggle('active', target === element);
      });
      // https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
      const tActive = document.getElementById(element.querySelector('a').getAttribute('href').replace('#', ''));
      [...tActive.parentNode.children].forEach(target => {
        target.classList.toggle('active', target === tActive);
      });
      // Trigger event
      tActive.dispatchEvent(new Event('tabs:click', {
        bubbles: true
      }));
      // Get the height of `tab-pane` which is activated now.
      const hasScrollBar = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
      const currHeight = parseInt(window.getComputedStyle(tabContent.querySelector('.active')).height.replace('px', ''), 10);
      // Reset the height of `tab-content` and see the animation.
      tabContent.style.height = currHeight + paddingTop + marginBottom + 'px';
      // let the height be adaptive
      tabContent.style.height = '';
      // Change the height of `tab-content` may cause scrollbar show / disappear, which may result in the change of the `tab-pane`'s height
      setTimeout(() => {
        if ((document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)) !== hasScrollBar) {
          tabContent.style.transition = 'height 0.3s linear';
          // After the animation, we need reset the height of `tab-content` again.
          const currHeightAfterScrollBarChange = parseInt(window.getComputedStyle(tabContent.querySelector('.active')).height.replace('px', ''), 10);
          tabContent.style.height = currHeightAfterScrollBarChange + paddingTop + marginBottom + 'px';
        }
        // Remove all the inline styles, and let the height be adaptive again.
        setTimeout(() => {
          tabContent.style.transition = '';
          tabContent.style.height = '';
        }, 250);
      }, 1000);
      // stickytabs == false
      if (!false) return;
      const offset = nav.parentNode.getBoundingClientRect().top + window.scrollY + 10;
      window.anime({
        targets  : document.scrollingElement,
        duration : 500,
        easing   : 'linear',
        scrollTop: offset
      });
    });
  });

  window.dispatchEvent(new Event('tabs:register'));
}
