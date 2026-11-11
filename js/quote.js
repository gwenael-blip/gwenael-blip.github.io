/* AKHC Studio Rental: "Your list". Visitors add gear from the gear list, set dates and send a quote request, or
 * keep the list for later. No prices are shown anywhere: the price comes with the quote.
 *
 * The page has no server of its own. A request leaves through the visitor's own email app (or as text they copy),
 * and every request ends with a link (…#r1<data>~) that holds the list, the dates and what they typed. Opening that
 * link shows the list again, and the gear tracker reads the same link to make a booking from it.
 * "Save or share this list" makes a short link when a store is set in config.js (the list is kept there scrambled),
 * otherwise a long one that holds the list itself. */
(function () {
  'use strict';
  var CFG = window.AKHC_CONFIG || {}, GEAR = window.AKHC_GEAR || { categories: [] }, TXT = window.AKHC_TEXT || { en: {} };
  var KEY = 'akhc-list-v1';
  var list = {}, form = { s: '', u: '', p: '', n: '', e: '', c: '', m: '' }, byKey = {}, order = [], lastCleared = null;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function lang() { return document.documentElement.lang === 'fo' ? 'fo' : 'en'; }
  function t(k, v) { var s = (TXT[lang()] && TXT[lang()][k]) || TXT.en[k] || ''; return s.replace(/\{(\w+)\}/g, function (m, x) { return v && v[x] !== undefined ? v[x] : m; }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function keyOf(it) { return Array.isArray(it.ref) ? it.ref.join(',') : String(it.ref); }
  function maxOf(it) { return Math.max(1, it.qty || (Array.isArray(it.ref) ? it.ref.length : 1)); }
  function dmy(iso) { return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? iso.slice(8) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4) : ''; }
  function days() {
    if (!form.s || !form.u) return 0;
    var a = new Date(form.s + 'T12:00:00'), b = new Date(form.u + 'T12:00:00'), n = Math.round((b - a) / 86400000) + 1;
    return isNaN(n) || n < 1 ? 0 : n;
  }
  function rows() { return order.filter(function (k) { return list[k] > 0; }).map(function (k) { return { k: k, it: byKey[k], n: list[k] }; }); }
  function count() { return rows().reduce(function (a, r) { return a + r.n; }, 0); }

  GEAR.categories.forEach(function (c) { c.items.forEach(function (it) { var k = keyOf(it); byKey[k] = it; order.push(k); }); });

  function save() { try { localStorage.setItem(KEY, JSON.stringify({ i: rows().map(function (r) { return [r.k, r.n]; }), f: form })); } catch (e) { /* storage can be blocked */ } }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!d) return;
      (d.i || []).forEach(function (p) { if (byKey[p[0]]) list[p[0]] = Math.min(maxOf(byKey[p[0]]), Math.max(0, p[1] | 0)); });
      Object.keys(form).forEach(function (k) { if (d.f && typeof d.f[k] === 'string') form[k] = d.f[k]; });
    } catch (e) { /* start empty */ }
  }

  /* ---- packing a list into a link: JSON, squeezed, as link-safe text ("1" = deflate, "0" = plain), "~" marks the end ---- */
  function b64u(bytes) { var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(s) { var b = atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  async function pack(obj) {
    var raw = new TextEncoder().encode(JSON.stringify(obj));
    if (typeof CompressionStream === 'function') { try { return '1' + b64u(new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer())); } catch (e) { /* send it plain */ } }
    return '0' + b64u(raw);
  }
  async function unpack(s) {
    var bytes = unb64u(String(s).slice(1));
    if (s[0] === '0') return JSON.parse(new TextDecoder().decode(bytes));
    if (s[0] !== '1' || typeof DecompressionStream !== 'function') throw new Error('cannot unpack');
    return JSON.parse(new TextDecoder().decode(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()));
  }
  function payload(withDetails) {
    var o = { v: 1, i: rows().map(function (r) { return [r.k, r.n]; }), l: lang(), t: Date.now() };
    ['s', 'u'].concat(withDetails ? ['p', 'n', 'e', 'c', 'm'] : []).forEach(function (k) { if (form[k]) o[k] = form[k]; });
    return o;
  }
  function base() { return location.href.replace(/#.*$/, ''); }
  async function longLink(withDetails) { return base() + '#r' + await pack(payload(withDetails)) + '~'; }
  function take(o) { // a list from a link replaces the one on the page
    if (!o || o.v !== 1 || !Array.isArray(o.i)) throw new Error('not a list');
    list = {};
    o.i.forEach(function (p) { if (Array.isArray(p) && byKey[p[0]]) list[p[0]] = Math.min(maxOf(byKey[p[0]]), Math.max(1, p[1] | 0)); });
    Object.keys(form).forEach(function (k) { if (typeof o[k] === 'string') form[k] = o[k].slice(0, k === 'm' ? 2000 : 200); });
    save();
  }

  /* ---- short links: the list is stored scrambled, the link holds only the key (the same store as the signing page) ---- */
  async function parts(k) {
    var h = async function (s) { return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))); };
    return { id: b64u(await h('akhc-list place ' + k)).slice(0, 20), key: await crypto.subtle.importKey('raw', (await h('akhc-list key ' + k)).slice(0, 16), 'AES-GCM', false, ['encrypt', 'decrypt']) };
  }
  async function shortLink() {
    var packed = await pack(payload(false)), k = b64u(crypto.getRandomValues(new Uint8Array(16))), p = await parts(k), iv = crypto.getRandomValues(new Uint8Array(12));
    var ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, p.key, new TextEncoder().encode(packed))), all = new Uint8Array(12 + ct.length);
    all.set(iv); all.set(ct, 12);
    var r = await fetch(CFG.store.replace(/\/+$/, '') + '/s/' + p.id + '.json', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ c: b64u(all), t: { '.sv': 'timestamp' } }) });
    if (!r.ok) throw new Error('store refused');
    return base() + '#l' + k;
  }
  async function fetchShort(k) {
    var p = await parts(k), r = await fetch(CFG.store.replace(/\/+$/, '') + '/s/' + p.id + '.json', { cache: 'no-store' }), v = r.ok ? await r.json() : null;
    if (!v || typeof v.c !== 'string') throw new Error('gone');
    var all = unb64u(v.c);
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12) }, p.key, all.slice(12)));
  }
  async function fromHash() {
    var h = location.hash || '', m = /^#r([01][A-Za-z0-9_-]+)~?$/.exec(h), s = /^#l([A-Za-z0-9_-]{22})$/.exec(h);
    if (!m && !s) return;
    try { take(await unpack(m ? m[1] : await fetchShort(s[1]))); say(t('qLoaded')); }
    catch (e) { say(t('qBadLink'), true); }
    try { history.replaceState(null, '', base() + '#list'); } catch (e) { /* the address just keeps the link */ }
    renderPanel();
    var el = $('#list'); if (el && el.scrollIntoView) el.scrollIntoView();
  }

  /* ---- what the request says ---- */
  function requestText(link) {
    var n = days(), L = [t('qmTitle'), ''], add = function (label, v) { if (v) L.push(label + ': ' + v); };
    add(t('qmProject'), form.p); add(t('qmName'), form.n); add(t('qmCompany'), form.c); add(t('qmEmail'), form.e);
    L.push(t('qmDates') + ': ' + (n ? dmy(form.s) + ' - ' + dmy(form.u) + ' (' + t(n === 1 ? 'qDay1' : 'qDaysN', { n: n }) + ')' : t('qmNoDates')));
    L.push('', t('qmGear') + ':');
    rows().forEach(function (r) { L.push('  ' + r.n + ' x ' + r.it.name); });
    if (form.m) L.push('', t('qmMsg') + ':', form.m);
    L.push('', t('qmLink') + ':', link);
    return L.join('\n');
  }

  /* ---- the panel ---- */
  var status = { text: '', bad: false };
  function say(text, bad) { status = { text: text || '', bad: !!bad }; var el = $('#list-status'); if (el) { el.textContent = status.text; el.className = 'status' + (status.bad ? ' bad' : ''); } }
  function stepper(k, n, max, name) {
    return '<span class="stepper"><button type="button" data-q="dec" data-k="' + esc(k) + '" aria-label="' + esc(t('qLess', { name: name })) + '">&minus;</button><output aria-live="polite">' + n + '</output><button type="button" data-q="inc" data-k="' + esc(k) + '"' + (n >= max ? ' disabled' : '') + ' aria-label="' + esc(t('qMore', { name: name })) + '">+</button></span>';
  }
  function control(it) { // the Add button or the counter on a row of the gear list
    var k = keyOf(it), box = document.createElement('div');
    box.className = 'item-add'; box.setAttribute('data-qk', k);
    paintControl(box);
    return box;
  }
  function paintControl(box) {
    var k = box.getAttribute('data-qk'), it = byKey[k], n = list[k] || 0; if (!it) return;
    box.innerHTML = n ? stepper(k, n, maxOf(it), it.name) : '<button type="button" class="add" data-q="inc" data-k="' + esc(k) + '" aria-label="' + esc(t('qAddAria', { name: it.name })) + '">+ ' + esc(t('qAdd')) + '</button>';
  }
  function sums() { // no prices on the site: only how long the rental is and what happens next
    if (!rows().length) return '';
    var n = days();
    return '<p class="note">' + esc((n ? t('qPeriod', { d: t(n === 1 ? 'qDay1' : 'qDaysN', { n: n }) }) : t('qNoDates')) + ' ' + t('qQuoteNote')) + '</p>';
  }
  function itemsHtml() {
    var r = rows();
    if (!r.length) return '<p class="list-empty">' + esc(t('qEmpty')) + '</p>';
    return '<ul class="list-items">' + r.map(function (x) {
      return '<li><span class="nm">' + esc(x.it.name) + '</span><span class="list-ctl">' + stepper(x.k, x.n, maxOf(x.it), x.it.name) + '<button type="button" class="rm" data-q="rm" data-k="' + esc(x.k) + '" aria-label="' + esc(t('qRemove', { name: x.it.name })) + '">&times;</button></span></li>';
    }).join('') + '</ul>';
  }
  function field(k, label, type, extra) { return '<label>' + esc(label) + '<input type="' + type + '" data-f="' + k + '" value="' + esc(form[k]) + '" ' + (extra || '') + '></label>'; }
  function renderPanel() {
    var host = $('#list'); if (!host) return;
    var n = count(), has = n > 0;
    host.innerHTML = '<h2 id="list-h">' + esc(t('qTitle')) + ' <span class="count">(' + n + ')</span></h2>' +
      '<p class="sub">' + esc(t('qLead')) + '</p>' +
      '<div id="list-items">' + itemsHtml() + '</div>' +
      '<div class="list-dates">' + field('s', t('qFrom'), 'date') + field('u', t('qTo'), 'date', form.s ? 'min="' + esc(form.s) + '"' : '') + '</div>' +
      '<div id="list-sums">' + sums() + '</div>' +
      '<div class="list-form"><h3>' + esc(t('qDetails')) + '</h3>' + field('p', t('qProject'), 'text', 'maxlength="120"') + field('n', t('qName'), 'text', 'autocomplete="name" maxlength="120"') + field('e', t('qEmail'), 'email', 'autocomplete="email" maxlength="160"') + field('c', t('qCompany'), 'text', 'autocomplete="organization" maxlength="120"') +
      '<label>' + esc(t('qMsg')) + '<textarea data-f="m" rows="3" maxlength="2000">' + esc(form.m) + '</textarea></label></div>' +
      (CFG.email ? '' : '<p class="notice">' + esc(TXT.en.qSetup || '') + '</p>') +
      '<div class="actions"><button type="button" class="btn primary" data-q="send"' + (CFG.email ? '' : ' disabled') + '>' + esc(t('qSend')) + '</button><button type="button" class="btn" data-q="copy">' + esc(t('qCopy')) + '</button></div>' +
      '<p id="list-status" class="status' + (status.bad ? ' bad' : '') + '" role="status" aria-live="polite">' + esc(status.text) + '</p>' +
      '<div class="actions small"><button type="button" class="linkbtn" data-q="share"' + (has ? '' : ' disabled') + '>' + esc(t('qShare')) + '</button><button type="button" class="linkbtn" data-q="print"' + (has ? '' : ' disabled') + '>' + esc(t('qPrint')) + '</button><button type="button" class="linkbtn" data-q="clear"' + (has || lastCleared ? '' : ' disabled') + '>' + esc(has || !lastCleared ? t('qClear') : t('qUndo')) + '</button></div>' +
      '<div id="list-link" hidden><label>' + esc(t('qLinkReady')) + '<input type="text" readonly id="list-link-in"></label></div>';
    syncOutside();
  }
  function refresh() { // after a quantity or a date changed: the parts that show numbers, not the boxes being typed in
    var a = $('#list-items'), b = $('#list-sums'), c = $('#list-h .count'), n = count();
    if (!a) { renderPanel(); return; }
    a.innerHTML = itemsHtml(); b.innerHTML = sums(); c.textContent = '(' + n + ')';
    $$('#list [data-q="share"], #list [data-q="print"]').forEach(function (x) { x.disabled = !n; });
    var cl = $('#list [data-q="clear"]'); if (cl) { cl.disabled = !(n || lastCleared); cl.textContent = n || !lastCleared ? t('qClear') : t('qUndo'); }
    var u = $('#list [data-f="u"]'); if (u) { if (form.s) u.setAttribute('min', form.s); else u.removeAttribute('min'); }
    syncOutside();
  }
  function syncOutside() { // the buttons in the gear list and the bar at the bottom of a phone screen
    $$('[data-qk]').forEach(paintControl);
    var bar = $('#listbar'), n = count(), d = days();
    if (bar) {
      bar.hidden = !n; document.body.classList.toggle('has-list', !!n);
      bar.innerHTML = '<span>' + esc(t('qBar', { n: n })) + '</span><span>' + (d ? esc(t(d === 1 ? 'qDay1' : 'qDaysN', { n: d })) : '') + '</span>';
    }
  }

  async function act(what, k) {
    if (what === 'inc' || what === 'dec' || what === 'rm') {
      var it = byKey[k]; if (!it) return;
      var n = list[k] || 0; n = what === 'inc' ? Math.min(maxOf(it), n + 1) : what === 'dec' ? Math.max(0, n - 1) : 0;
      if (n) list[k] = n; else delete list[k];
      lastCleared = null; save(); refresh(); return;
    }
    if (what === 'clear') {
      if (count()) { lastCleared = JSON.stringify(list); list = {}; say(t('qCleared')); }
      else if (lastCleared) { list = JSON.parse(lastCleared); lastCleared = null; say(''); }
      save(); refresh(); return;
    }
    if (what === 'print') { document.body.classList.add('print-list'); window.print(); return; }
    if (!count()) { say(t('qNeedItems'), true); return; }
    if (what === 'share') {
      var link = '';
      try { link = CFG.store && window.crypto && crypto.subtle ? await shortLink() : await longLink(false); } catch (e) { link = await longLink(false); }
      var box = $('#list-link'), inp = $('#list-link-in'); box.hidden = false; inp.value = link;
      try { if (navigator.share) { await navigator.share({ url: link, title: t('qTitle') }); return; } } catch (e) { /* the share sheet was closed: the link is still shown */ }
      try { await navigator.clipboard.writeText(link); say(t('qLinkCopied')); } catch (e) { inp.focus(); inp.select(); say(t('qLinkSelect')); }
      return;
    }
    if (!form.n.trim()) { say(t('qNeedName'), true); var fn = $('#list [data-f="n"]'); if (fn) fn.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.e.trim())) { say(t('qNeedEmail'), true); var fe = $('#list [data-f="e"]'); if (fe) fe.focus(); return; }
    var text = requestText(await longLink(true));
    if (what === 'copy') {
      try { await navigator.clipboard.writeText(text); say(t('qCopied')); } catch (e) { say(t('qCopyFail'), true); }
      return;
    }
    if (what === 'send' && CFG.email) {
      var what2 = form.p || form.c || form.n, when = days() ? ', ' + dmy(form.s) + ' - ' + dmy(form.u) : '';
      location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(t('qmSubject', { what: what2 }) + when) + '&body=' + encodeURIComponent(text.replace(/\n/g, '\r\n'));
      say(t('qSent'));
    }
  }

  function init() {
    load();
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-q]') : null; if (!b || b.disabled) return;
      e.preventDefault(); act(b.getAttribute('data-q'), b.getAttribute('data-k'));
    });
    document.addEventListener('input', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-f'); if (!k || !(k in form)) return;
      form[k] = e.target.value; save();
      if (k === 's' || k === 'u') { if (form.s && form.u && form.u < form.s) { form.u = form.s; var u = $('#list [data-f="u"]'); if (u) u.value = form.u; } refresh(); }
    });
    window.addEventListener('afterprint', function () { document.body.classList.remove('print-list'); });
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  window.AKHC_QUOTE = { control: control, render: renderPanel, init: init };
}());
