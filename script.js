const PROFILE = {
  name: "Akyikat Kurmanbekova",
  email: "akyikat.kurmanbekova@gmail.com",
  linkedin: "https://www.linkedin.com/in/aku-kurmanbekova/",
  github: "https://github.com/aku-05",
  demo: "https://webchat-aku.onrender.com/"
};

(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // name and links from PROFILE
  document.querySelectorAll('[data-text]').forEach(function (el) {
    var v = PROFILE[el.getAttribute('data-text')];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-href]').forEach(function (el) {
    var k = el.getAttribute('data-href'), v = PROFILE[k];
    if (v) el.setAttribute('href', k === 'email' ? 'mailto:' + v : v);
  });
  document.title = PROFILE.name + ' Portfolio';

  // wake up the free-hosted chat app in the background, so it is ready when someone clicks "Open live demo"
  // (a no-cors request is enough: we do not read the answer, we only want the server to start)
  try {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (PROFILE.demo && !saveData && !sessionStorage.getItem('demoWoken')) {
      sessionStorage.setItem('demoWoken', '1');
      fetch(PROFILE.demo, { mode: 'no-cors', cache: 'no-store' }).catch(function () {});
    }
  } catch (e) {}

  // ---- starry night: twinkling stars ----
  var starsBox = document.getElementById('stars');
  var tints = ['#ffffff', '#ffffff', '#ffffff', '#cfe0ff', '#dfe6ff', '#c9d6ff'];
  var count = Math.max(110, Math.min(230, Math.round(window.innerWidth * window.innerHeight / 6000)));
  var frag = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    var s = document.createElement('div');
    var big = Math.random() < 0.09;
    var size = big ? Math.random() * 1.5 + 2.6 : Math.random() * 1.8 + 1.1;
    s.className = big ? 'star big' : 'star';
    s.style.cssText = '--s:' + size.toFixed(1) + 'px;width:' + size + 'px;height:' + size + 'px;top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;' +
      'background:' + tints[Math.floor(Math.random() * tints.length)] + ';--o:' + (Math.random() * 0.4 + 0.55).toFixed(2) + ';' +
      '--d:' + (Math.random() * 3 + 1.4).toFixed(1) + 's;animation-delay:' + (Math.random() * 4).toFixed(1) + 's';
    frag.appendChild(s);
  }
  starsBox.appendChild(frag);

  // ---- shooting stars: random every few seconds, and wherever you click ----
  var night = document.getElementById('night');
  function isNight() { return root.getAttribute('data-theme') !== 'light'; }
  function shoot(x, y, ring) {
    var el = document.createElement('div');
    var a = Math.random() * 25 + 22, d = 520 + Math.random() * 420;
    el.className = 'shoot';
    el.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--angle:' + a + 'deg;--dist:' + d + 'px;--dur:' + (0.9 + Math.random() * 0.5).toFixed(2) + 's';
    night.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
    if (ring) {
      var r = document.createElement('div');
      r.className = 'ring'; r.style.cssText = 'left:' + x + 'px;top:' + y + 'px';
      night.appendChild(r);
      r.addEventListener('animationend', function () { r.remove(); });
    }
  }
  function loop() {
    setTimeout(function () {
      if (isNight() && !document.hidden) {
        shoot(Math.random() * window.innerWidth * 0.8, Math.random() * window.innerHeight * 0.6);
        if (Math.random() < 0.3) setTimeout(function () { shoot(Math.random() * window.innerWidth * 0.8, Math.random() * window.innerHeight * 0.5); }, 250);
      }
      loop();
    }, 1400 + Math.random() * 2600);
  }
  if (!reduce) {
    loop();
    document.addEventListener('click', function (e) {
      if (!isNight() || (e.target.closest && e.target.closest('a, button, input, summary'))) return;
      shoot(e.clientX, e.clientY, true);
    });
  }

  // ---- theme switch: circular wipe from the button (falls back to a cross-fade) ----
  var btn = document.getElementById('themeBtn');
  function label() {
    var t = isNight() ? 'Switch to the day sky' : 'Switch to the night sky';
    btn.setAttribute('aria-label', t); btn.title = t;
  }
  function setTheme(next) {
    function apply() { root.setAttribute('data-theme', next); label(); }
    try { localStorage.setItem('theme', next); } catch (e) {}
    if (reduce || !document.startViewTransition) { apply(); return; }
    try {
      var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 950, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    } catch (e) { apply(); }
  }
  label();
  btn.addEventListener('click', function () { setTheme(isNight() ? 'light' : 'dark'); });

  // ---- scroll: parallax for moon and clouds, header shadow ----
  var sky = document.getElementById('sky'), header = document.getElementById('siteHeader'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.pageYOffset || 0;
      if (!reduce) sky.style.setProperty('--sy', y);
      header.classList.toggle('scrolled', y > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- scroll reveal and active nav link ----
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });

    var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = document.querySelector('.nav a[href="#' + e.target.id + '"]');
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var t = document.querySelector(a.getAttribute('href')); if (t && t.id !== 'top') navIO.observe(t); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- screenshot tabs ----
  var notes = {
    chat: 'Two browsers in the same room. Messages, edits and typing status appear on both sides immediately.',
    members: 'The side menu lists everyone in the room. Edited and deleted messages are marked for everyone.',
    join: 'Pick a user name and a room name. A name that is already taken is rejected by the server.'
  };
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-shot');
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== key; });
      document.getElementById('shotNote').textContent = notes[key];
    });
  });

  // ---- copy email (falls back to selecting the address) ----
  var copyBtn = document.getElementById('copyEmail');
  copyBtn.addEventListener('click', function () {
    function fallback() {
      var el = document.querySelector('[data-href="email"]');
      var range = document.createRange(); range.selectNodeContents(el);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      copyBtn.textContent = 'Press Ctrl+C';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PROFILE.email).then(function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
      }, fallback);
    } else { fallback(); }
  });
})();
