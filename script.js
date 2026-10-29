(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Scroll progress bar
  var bar = document.querySelector('.progress');
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // 2. Highlight the nav link of the section in view
  var links = document.querySelectorAll('.topbar nav a');
  var sections = [];
  links.forEach(function (a) {
    var s = document.querySelector(a.getAttribute('href'));
    if (s) sections.push({ link: a, el: s });
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        sections.forEach(function (s) {
          if (s.el === e.target) s.link.setAttribute('aria-current', 'true');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s.el); });
  }

  // 3. Publication filters
  var buttons = document.querySelectorAll('.filters button');
  var pubs = document.querySelectorAll('.pub');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      pubs.forEach(function (p) { p.hidden = !(f === 'all' || p.getAttribute('data-type') === f); });
    });
  });

  // 4. Hero parallax that follows the pointer
  var stage = document.querySelector('.stage');
  if (stage && !reduce && window.matchMedia('(pointer: fine)').matches) {
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      stage.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    stage.addEventListener('mouseleave', function () {
      stage.style.setProperty('--mx', 0);
      stage.style.setProperty('--my', 0);
    });
  }
})();
