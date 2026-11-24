// Tema claro/escuro e ajuste da altura do header para a rolagem por âncoras.
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'pf-dark';
  var toggle = document.querySelector('.theme-toggle');
  var header = document.querySelector('.site-header');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function savedPreference() {
    try {
      var value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return typeof value === 'boolean' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    if (toggle) toggle.setAttribute('aria-pressed', String(dark));
    if (themeColor) themeColor.setAttribute('content', dark ? '#141a16' : '#f4f8f4');
  }

  applyTheme(root.dataset.theme === 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = root.dataset.theme !== 'dark';
      applyTheme(dark);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dark)); } catch (e) {}
    });
  }

  // Sem escolha salva: acompanha o tema do sistema em tempo real.
  if (media) {
    var onSystemChange = function (event) {
      if (savedPreference() === null) applyTheme(event.matches);
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  // Mantém o título da seção visível abaixo do header fixo ao navegar pelo menu.
  function syncHeaderHeight() {
    if (header) root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
})();
