/* ============ NAVIGATION (ABOUT ME / SKILLS / PROJECTS / CONTACT ME) ============ */
(function () {
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('.page-section[id]'));
  if (!navLinks.length || !sections.length) return;

  function setActive(matchId) {
    navLinks.forEach(function (link) {
      var linkId = (link.getAttribute('href') || '').split('#')[1];
      link.classList.toggle('active', !!matchId && linkId === matchId);
    });
  }

  var headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
    10
  ) || 64;

  var suppressSpy = false;
  var resumeTimer = null;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (suppressSpy) return;
        var visible = entries.filter(function (e) { return e.isIntersecting; });
        if (!visible.length) return;
        visible.sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        setActive(visible[0].target.id);
      },
      {
        rootMargin: '-' + headerH + 'px 0px -70% 0px',
        threshold: 0
      }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  window.addEventListener('hashchange', function () {
    setActive(location.hash.slice(1));
  });

  // The last section can be too short to reach the top of the screen,
  // so highlight it when the visitor scrolls to the bottom of the page.
  window.addEventListener('scroll', function () {
    if (suppressSpy) return;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) setActive(sections[sections.length - 1].id);
  }, { passive: true });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var linkId = (link.getAttribute('href') || '').split('#')[1];
      if (!linkId) return;
      setActive(linkId);
      suppressSpy = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(function () {
        suppressSpy = false;
      }, 700);
    });
  });

  setActive(location.hash ? location.hash.slice(1) : sections[0].id);

  if (location.hash) {
    var target = document.querySelector(location.hash);
    var reland = function () {
      if (target) target.scrollIntoView({ block: 'start' });
      setActive(location.hash.slice(1));
    };
    window.addEventListener('load', reland);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reland);
    }
  }
})();

/* ============ CONTACT ME ============ */
(function () {
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (!form) return;

  var address = form.getAttribute('data-email') || '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameField = form.elements.namedItem('name');
    var emailField = form.elements.namedItem('email');
    var messageField = form.elements.namedItem('message');

    var name = nameField ? nameField.value.trim() : '';
    var email = emailField ? emailField.value.trim() : '';
    var message = messageField ? messageField.value.trim() : '';

    if (!name || !email || !message) {
      note.textContent = 'Fill in your name, email, and message before sending.';
      return;
    }

    var subject = encodeURIComponent('Portfolio contact from ' + name);
    var body = encodeURIComponent(message + '\n\n\u2014 ' + name + ' (' + email + ')');

    note.textContent = 'Opening your email app to send this message to ' + address + '.';
    window.location.href = 'mailto:' + address + '?subject=' + subject + '&body=' + body;
    form.reset();
  });
})();
