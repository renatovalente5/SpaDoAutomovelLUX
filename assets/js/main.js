/* Gold Cleaning Services — main.js */
(function () {
  'use strict';

  /* ---------- Botão "voltar ao topo" ---------- */
  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Voltar ao topo da página');
  toTop.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Header: logo grande no topo, encolhe ao rolar ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Navegação móvel ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function closeNav() {
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open') &&
          !document.querySelector('dialog[open]')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- "Ver mais serviços" (telemóvel) ---------- */
  var svcToggle = document.querySelector('.services-toggle');
  var svcGrid = document.getElementById('lista-servicos');
  var svcWrap = document.querySelector('.services-toggle-wrap');
  if (svcToggle && svcGrid && svcWrap) {
    svcGrid.classList.add('is-collapsed');
    svcToggle.addEventListener('click', function () {
      svcGrid.classList.remove('is-collapsed');
      svcWrap.style.display = 'none';
    });
  }

  /* ---------- "Ver mais resultados" (antes/depois, telemóvel) ----------
     Revela +2 imagens por clique; o botão desaparece quando não há mais. */
  var baToggle = document.querySelector('.ba-toggle');
  var baGrid = document.getElementById('lista-antes-depois');
  var baWrap = document.querySelector('.ba-toggle-wrap');
  if (baToggle && baGrid && baWrap) {
    var INIT = 2, STEP = 2;
    var baItems = [].slice.call(baGrid.querySelectorAll('.ba-item'));
    baItems.forEach(function (li, i) { if (i >= INIT) li.classList.add('ba-hidden'); });
    var refreshBa = function () {
      if (baGrid.querySelectorAll('.ba-item.ba-hidden').length === 0) baWrap.classList.add('is-done');
    };
    refreshBa();
    baToggle.addEventListener('click', function () {
      var hidden = baGrid.querySelectorAll('.ba-item.ba-hidden');
      for (var k = 0; k < STEP && k < hidden.length; k++) hidden[k].classList.remove('ba-hidden');
      refreshBa();
    });
  }

  /* ---------- "Ver mais fotos" (galeria) ---------- */
  var galToggle = document.querySelector('.gallery-toggle');
  var galGrid = document.getElementById('galeria-fotos');
  var galWrap = document.querySelector('.gallery-toggle-wrap');
  if (galToggle && galGrid && galWrap) {
    galGrid.classList.add('is-collapsed');
    galToggle.addEventListener('click', function () {
      galGrid.classList.remove('is-collapsed');
      galWrap.style.display = 'none';
    });
  }

  /* ---------- Slider antes/depois ---------- */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var range = slider.querySelector('input[type="range"]');
    var after = slider.querySelector('.ba-slider__after');
    var divider = slider.querySelector('.ba-slider__divider');
    if (!range || !after || !divider) return;
    var update = function () {
      var v = Number(range.value);
      after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      divider.style.left = v + '%';
      range.setAttribute('aria-valuetext', v + '% — lado esquerdo mostra o antes, lado direito o depois');
    };
    range.addEventListener('input', update);
    update();
  });

  /* ---------- Galeria / lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var links = document.querySelectorAll('.gallery a');
  if (lightbox && typeof lightbox.showModal === 'function' && links.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox.querySelector('.lightbox__prev');
    var nextBtn = lightbox.querySelector('.lightbox__next');
    var lastTrigger = null;
    var downOnBackdrop = false;
    var current = 0;

    var items = [];
    links.forEach(function (link, i) {
      var img = link.querySelector('img');
      items.push({
        src: link.getAttribute('href'),
        alt: img ? img.alt : '',
        caption: link.getAttribute('data-caption') || (img ? img.alt : '')
      });
      link.addEventListener('click', function (e) {
        e.preventDefault();
        lastTrigger = link;
        show(i);
        lightbox.showModal();
      });
    });

    function show(i) {
      current = (i + items.length) % items.length;
      var item = items[current];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.caption;
    }

    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.close(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });

    /* fechar apenas quando o gesto começa E termina no backdrop (evita fecho por arrasto) */
    lightbox.addEventListener('pointerdown', function (e) {
      downOnBackdrop = (e.target === lightbox);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox && downOnBackdrop) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); lightbox.close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    lightbox.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
    });
  }
  /* Sem showModal (browsers antigos), os links da galeria navegam
     diretamente para a imagem — fallback nativo, sem JS adicional. */

  /* ---------- Consentimento de cookies + mapa Google ----------
     Nada da Google carrega até o utilizador aceitar. A escolha fica
     memorizada (localStorage) e pode ser alterada em "Definições de cookies". */
  var CK = 'lux-cookie-consent';
  var mapBox = document.getElementById('map-embed');

  function getConsent() { try { return localStorage.getItem(CK); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CK, v); } catch (e) {} }

  function loadMap() {
    if (!mapBox || mapBox.querySelector('iframe')) return;
    var url = mapBox.getAttribute('data-maps');
    if (!url) return;
    var ph = document.getElementById('map-placeholder');
    var ifr = document.createElement('iframe');
    ifr.src = url;
    ifr.title = 'Mapa do Google Maps com a localização da Gold Cleaning na Rua Nova, Rio Meão';
    ifr.className = 'map-card__iframe';
    ifr.loading = 'lazy';
    ifr.setAttribute('allowfullscreen', '');
    ifr.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    if (ph) ph.remove();
    mapBox.appendChild(ifr);
  }

  /* Banner de consentimento (criado por JS; RGPD / Lei 41/2004) */
  var cookiesLink = document.querySelector('a[href$="cookies.html"]');
  var cookiesHref = cookiesLink ? cookiesLink.getAttribute('href') : 'cookies.html';
  var bar = document.createElement('div');
  bar.className = 'cookiebar';
  bar.id = 'cookiebar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Consentimento de cookies');
  bar.hidden = true;
  bar.innerHTML =
    '<p class="cookiebar__txt">Utilizamos cookies do <strong>Google Maps</strong> apenas para mostrar o mapa da nossa localização. ' +
    'Pode aceitar ou rejeitar — o site funciona na mesma. Saiba mais na <a href="' + cookiesHref + '">Política de Cookies</a>.</p>' +
    '<div class="cookiebar__actions">' +
    '<button type="button" class="btn btn--ghost" id="cookie-reject">Rejeitar</button>' +
    '<button type="button" class="btn btn--gold" id="cookie-accept">Aceitar</button>' +
    '</div>';
  document.body.appendChild(bar);

  function acceptCookies() { setConsent('accepted'); bar.hidden = true; loadMap(); }
  function rejectCookies() { setConsent('rejected'); bar.hidden = true; }

  var consent = getConsent();
  if (consent === 'accepted') loadMap();
  else if (consent !== 'rejected') bar.hidden = false;

  var elAccept = document.getElementById('cookie-accept');
  var elReject = document.getElementById('cookie-reject');
  var elMapAccept = document.getElementById('map-accept');
  var elSettings = document.getElementById('cookie-settings');
  if (elAccept) elAccept.addEventListener('click', acceptCookies);
  if (elReject) elReject.addEventListener('click', rejectCookies);
  if (elMapAccept) elMapAccept.addEventListener('click', acceptCookies);
  if (elSettings) elSettings.addEventListener('click', function (e) {
    e.preventDefault();
    bar.hidden = false;
  });

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
