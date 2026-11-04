# SPOM watch

Tells you when an ICAI SPOM lecture stops at an MCQ checkpoint, so you can keep watching something else.
When a checkpoint appears you get a silent desktop notification and the tab title flashes **⚠ Set C CHECKPOINT**.
Click the notification to jump to that window, answer, and carry on. Nothing to install, no admin rights needed.

## Set up (once per browser)

1. Copy the line below with the copy button on the right of the box.
2. Press **Ctrl + Shift + B** to show the bookmarks bar.
3. Right-click the bar → **Add page** (Chrome/Brave/Opera) or **Add favorite** (Edge). Name it `SPOM watch`, paste the line as the **URL**, save.

```
javascript:(() => { if (window.__cpWatch) { alert('SPOM watch is already on in this tab'); return; } window.__cpWatch = true; const title = document.title; const label = (prompt('Name for this window (e.g. Set C)', '') || 'SPOM').slice(0, 20); try { Notification.requestPermission(); } catch (e) {} const docs = (d, out = []) => { out.push(d); for (const f of d.querySelectorAll('iframe,frame')) { try { if (f.contentDocument) docs(f.contentDocument, out); } catch (e) {} } return out; }; const shown = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }; const question = d => [...d.querySelectorAll('input[type=radio],input[type=checkbox]')].some(shown) || [...d.querySelectorAll('button,[role=button],a,div,span')].some(el => el.children.length === 0 && /^\s*(submit|check answer|check)\s*$/i.test(el.textContent || '') && shown(el)); let pausedSince = 0, alerted = false, flash, note; const push = why => { const url = 'https://ntfy.sh/spom-a414deed5f/publish?' + new URLSearchParams({ title: label + ' checkpoint', message: why, priority: 'high', tags: 'warning' }); fetch(url, { mode: 'no-cors' }).catch(() => { new Image().src = url; }); }; const alertNow = why => { alerted = true; try { push(why); } catch (e) {} try { note = new Notification(label + ': checkpoint', { body: why + ' (click to open)', requireInteraction: true, silent: true }); note.onclick = () => { window.focus(); note.close(); }; } catch (e) {} let on = false; flash = setInterval(() => { document.title = (on = !on) ? '⚠ ' + label + ' CHECKPOINT' : title; }, 700); }; const reset = () => { alerted = false; pausedSince = 0; clearInterval(flash); document.title = title; try { note && note.close(); } catch (e) {} }; setInterval(() => { const all = docs(document); const vids = all.flatMap(d => [...d.querySelectorAll('video,audio')]); const playing = vids.some(v => !v.paused && !v.ended); const stuck = vids.some(v => v.paused && !v.ended && v.currentTime > 1); const q = all.some(question); if (playing && !q) { if (alerted) reset(); pausedSince = 0; return; } if (alerted) return; if (q) return alertNow('A question is on screen'); if (stuck) { pausedSince = pausedSince || Date.now(); if (Date.now() - pausedSince > 4000) alertNow('The lecture has paused'); } }, 1500); document.title = '✓ ' + label + ' watching'; setTimeout(() => { if (!alerted) document.title = title; }, 3000); })(); 
```

## Get alerts on your tablet/phone

Install the **ntfy** app, tap **+**, and subscribe to the topic `spom-a414deed5f`. Every checkpoint is pushed there with the window's name.

## Use

- In each LMS lecture window, click **SPOM watch**, type a name (e.g. `Set C`), press OK, and **Allow** notifications.
- The title shows "✓ Set C watching" for a moment, which means it is on.
- After **Next** loads a new lecture page, click it again.

## If it never alerts

The LMS player may sit in a frame the browser won't let scripts look into. Note what the checkpoint looks like and report back.

Source: [`watcher.js`](watcher.js). [`bookmarklet.txt`](bookmarklet.txt) is the same code on one line.
