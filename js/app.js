/* AKHC Studio Rental: renders the gear list, switches language, filters the list.
 * Content lives in config.js (your details), gear.js (the gear) and text.js (wording).
 * No prices are shown anywhere on the site: the price comes with the quote. */
(function () {
  'use strict';

  var CFG = window.AKHC_CONFIG || {};
  var GEAR = window.AKHC_GEAR || { categories: [], packages: [] };
  var TXT = window.AKHC_TEXT;
  var LANGS = ['en', 'fo'];
  var MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fo: ['januar', 'februar', 'mars', 'apríl', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
  };
  var lang = pickLang();

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function t(key) { return (TXT[lang] && TXT[lang][key]) || TXT.en[key] || ''; }
  function tr(obj) { return obj ? (obj[lang] || obj.en || '') : ''; }
  function fill(s, vars) { return s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k]; }); }
  function fold(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[øØ]/g, 'o').replace(/[æÆ]/g, 'ae').replace(/[ðÐ]/g, 'd').toLowerCase(); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function pickLang() {
    var q = null, s = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* ignore */ }
    if (LANGS.indexOf(q) >= 0) return q;
    try { s = localStorage.getItem('akhc-lang'); } catch (e) { /* storage can be blocked */ }
    if (LANGS.indexOf(s) >= 0) return s;
    return /^fo\b/i.test(navigator.language || '') ? 'fo' : 'en';
  }

  function renderPackages() {
    var wrap = $('#pkg-cards'), all = {};
    GEAR.categories.forEach(function (c) { c.items.forEach(function (it) { all[it.ref] = it; }); });
    var items = (GEAR.packages || []).map(function (r) { return all[r]; }).filter(Boolean);
    wrap.textContent = '';
    items.forEach(function (it) {
      wrap.appendChild(el('article', { 'class': 'card' }, [
        el('h3', { text: it.name }),
        it.includes ? el('p', { text: tr(it.includes) }) : null
      ]));
    });
    $('#packages').hidden = items.length === 0;
  }

  function renderGear() {
    var host = $('#gear-list'), chips = $('#chips');
    host.textContent = ''; chips.textContent = '';
    GEAR.categories.forEach(function (cat) {
      var id = 'cat-' + cat.id;
      chips.appendChild(el('a', { href: '#' + id, text: tr(cat.name) }));
      var list = el('ul', { 'class': 'items' });
      cat.items.forEach(function (it) {
        var name = el('span', { 'class': 'item-name', text: it.name });
        if (it.qty > 1) name.appendChild(el('span', { 'class': 'qty', text: '×' + it.qty, 'aria-label': fill(t('available'), { n: it.qty }), title: fill(t('available'), { n: it.qty }) }));
        var li = el('li', { 'class': 'item', 'data-search': fold([it.name, tr(it.note), tr(it.includes), tr(cat.name)].join(' ')) }, [
          el('div', { 'class': 'item-main' }, [name]),
          window.AKHC_QUOTE ? window.AKHC_QUOTE.control(it) : null
        ]);
        var note = tr(it.note);
        if (note) li.firstChild.appendChild(el('span', { 'class': 'item-note', text: note }));
        list.appendChild(li);
      });
      host.appendChild(el('section', { 'class': 'cat', id: id, 'aria-labelledby': id + '-h' }, [el('h3', { id: id + '-h', text: tr(cat.name) }), list]));
    });
    applyFilter();
  }

  function applyFilter() {
    var q = fold($('#q').value.trim()), words = q ? q.split(/\s+/) : [], shown = 0;
    $$('.item').forEach(function (li) {
      var hay = li.getAttribute('data-search');
      var ok = words.every(function (w) { return hay.indexOf(w) >= 0; });
      li.hidden = !ok; if (ok) shown++;
    });
    $$('.cat').forEach(function (c) { c.hidden = !$$('.item:not([hidden])', c).length; });
    $('#empty').hidden = shown > 0;
    $('#count').textContent = q ? fill(t('count'), { n: shown }) : '';
  }

  function dateText(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return '';
    var d = +p[2], m = MONTHS[lang][+p[1] - 1];
    return lang === 'fo' ? d + '. ' + m + ' ' + p[0] : d + ' ' + m + ' ' + p[0];
  }

  function renderContact() {
    var host = $('#contact-body'), dl = el('dl'), has = false;
    host.textContent = '';
    function row(label, node) { dl.appendChild(el('div', {}, [el('dt', { text: label }), el('dd', {}, [node])])); has = true; }
    var box = el('div', { 'class': 'contact' });
    if (CFG.email) {
      var href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(t('mailSubject')) + '&body=' + encodeURIComponent(t('mailBody').replace(/\n/g, '\r\n'));
      box.appendChild(el('p', {}, [el('a', { 'class': 'btn primary', href: href, text: t('emailBtn') })]));
      row(t('emailLabel'), el('a', { href: 'mailto:' + CFG.email, text: CFG.email }));
    }
    if (CFG.phone) row(t('phone'), el('a', { href: 'tel:' + CFG.phone.replace(/[^\d+]/g, ''), text: CFG.phone }));
    if (CFG.address) {
      var a = el('span', { text: CFG.address });
      if (CFG.mapUrl) { var w = el('span', {}, [a, document.createTextNode(' · '), el('a', { href: CFG.mapUrl, rel: 'noopener', text: t('openMap') })]); row(t('address'), w); }
      else row(t('address'), a);
    }
    var hrs = tr(CFG.hours); if (hrs) row(t('hours'), el('span', { text: hrs }));
    (CFG.links || []).forEach(function (l) { if (l && l.url) row(l.label || l.url, el('a', { href: l.url, rel: 'noopener', text: l.url.replace(/^https?:\/\/(www\.)?/, '') })); });
    if (has) box.appendChild(dl);
    host.appendChild(box);
    if (!CFG.email) host.appendChild(el('p', { 'class': 'notice', text: TXT.en.setupNote }));
  }

  function renderFooter() {
    var parts = [CFG.company, CFG.cvr ? 'CVR ' + CFG.cvr : ''].filter(Boolean);
    $('#foot-company').textContent = parts.join(' · ');
    $('#foot-updated').textContent = GEAR.updated ? fill(t('updated'), { d: dateText(GEAR.updated) }) : '';
  }

  function applyText() {
    document.documentElement.lang = lang;
    document.title = t('docTitle');
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('metaDesc'));
    $$('[data-t]').forEach(function (n) { n.textContent = t(n.getAttribute('data-t')); });
    $$('[data-t-placeholder]').forEach(function (n) { n.setAttribute('placeholder', t(n.getAttribute('data-t-placeholder'))); });
    $$('[data-t-aria-label]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-t-aria-label'))); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    renderPackages(); renderGear(); renderContact(); renderFooter();
    if (window.AKHC_QUOTE) window.AKHC_QUOTE.render();
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === lang) return;
    lang = l;
    try { localStorage.setItem('akhc-lang', l); } catch (e) { /* ignore */ }
    applyText();
  }

  var started = false;
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
  function init() {
    if (started || !TXT) return; started = true;
    $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
    $('#q').addEventListener('input', applyFilter);
    if (window.AKHC_QUOTE) window.AKHC_QUOTE.init();
    applyText();
  }
}());
