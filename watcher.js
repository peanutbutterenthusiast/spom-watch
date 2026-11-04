(() => {
  if (window.__cpWatch) { alert('SPOM watch is already on in this tab'); return; }
  window.__cpWatch = true;
  // If the LMS page isn't allowed to call ntfy itself, pushes go out through a small relay
  // window instead (it has to be opened now, while the bookmark click still counts as a click).
  const browser = /Edg\//.test(navigator.userAgent) ? 'Edge' : /OPR\//.test(navigator.userAgent) ? 'Opera' : navigator.brave ? 'Brave' : /Firefox/.test(navigator.userAgent) ? 'Firefox' : 'Chrome';
  let relay = null, direct = false, pending = null, bar = null;
  const openRelay = () => {
    try {
      relay = window.open('about:blank', 'spomrelay' + Date.now(), 'width=380,height=170');
      if (relay) relay.document.write('<title>SPOM relay</title><body style="font:14px sans-serif;padding:12px">SPOM watch relay. Minimise this window and leave it open; checkpoint pings to your tablet go through it.</body>');
    } catch (e) { relay = null; }
    return relay;
  };
  const relayOk = () => relay && !relay.closed;
  // shown when this browser can't reach the tablet; clicking it is the click a relay window needs
  const showFix = () => {
    if (bar || direct || relayOk()) return;
    bar = document.createElement('div');
    bar.textContent = 'SPOM watch (' + browser + '): pings can\'t reach your tablet from this browser. Click here to fix.';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#c0392b;color:#fff;font:600 14px sans-serif;padding:10px 14px;cursor:pointer;text-align:center';
    bar.onclick = () => {
      if (!openRelay()) { bar.textContent = 'Pop-ups are blocked: allow pop-ups for lms.icai.org (icon at the right of the address bar), then click here again.'; return; }
      bar.remove(); bar = null;
      if (pending) { relay.location.href = pending; pending = null; }
    };
    document.body.appendChild(bar);
  };
  openRelay();
  fetch('https://ntfy.sh/v1/health', { mode: 'no-cors' })
    .then(() => { direct = true; try { relay && relay.close(); } catch (e) {} relay = null; })
    .catch(() => { if (!relayOk()) showFix(); });
  const title = document.title;
  const label = (prompt('Name for this window', browser) || browser).slice(0, 20);
  try { Notification.requestPermission(); } catch (e) {}
  const docs = (d, out = []) => { out.push(d); for (const f of d.querySelectorAll('iframe,frame')) { try { if (f.contentDocument) docs(f.contentDocument, out); } catch (e) {} } return out; };
  const shown = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const question = d => [...d.querySelectorAll('input[type=radio],input[type=checkbox]')].some(shown) ||
    [...d.querySelectorAll('button,[role=button],a,div,span')].some(el => el.children.length === 0 && /^\s*(submit|check answer|check)\s*$/i.test(el.textContent || '') && shown(el));
  let pausedSince = 0, alerted = false, flash, note;
  // push to the tablet/phone through ntfy (subscribe to this topic in the ntfy app)
  const push = why => {
    const url = 'https://ntfy.sh/spom-a414deed5f/publish?' + new URLSearchParams({ title: label + ' checkpoint', message: why, priority: 'high', tags: 'warning' });
    const viaRelay = () => { if (relayOk()) relay.location.href = url; else { pending = url; new Image().src = url; showFix(); } };
    if (direct) fetch(url, { mode: 'no-cors' }).catch(() => { direct = false; viaRelay(); }); else viaRelay();
  };
  const alertNow = why => {
    alerted = true;
    try { push(why); } catch (e) {}
    try {
      note = new Notification(label + ': checkpoint', { body: why + ' (click to open)', requireInteraction: true, silent: true });
      note.onclick = () => { window.focus(); note.close(); };
    } catch (e) {}
    let on = false; flash = setInterval(() => { document.title = (on = !on) ? '⚠ ' + label + ' CHECKPOINT' : title; }, 700);
  };
  const reset = () => { alerted = false; pausedSince = 0; clearInterval(flash); document.title = title; try { note && note.close(); } catch (e) {} };
  setInterval(() => {
    const all = docs(document);
    const vids = all.flatMap(d => [...d.querySelectorAll('video,audio')]);
    const playing = vids.some(v => !v.paused && !v.ended);
    const stuck = vids.some(v => v.paused && !v.ended && v.currentTime > 1 && !(v.duration - v.currentTime < 2));
    const q = all.some(question);
    if (playing && !q) { if (alerted) reset(); pausedSince = 0; return; }
    if (alerted) return;
    if (q) return alertNow('A question is on screen');
    if (stuck) { pausedSince = pausedSince || Date.now(); if (Date.now() - pausedSince > 45000) alertNow('Paused for 45s, probably a checkpoint'); }
  }, 1500);
  document.title = '✓ ' + label + ' watching';
  setTimeout(() => { if (!alerted) document.title = title; }, 3000);
})();
