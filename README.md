# SPOM watch

Tells you when an ICAI SPOM lecture stops at an MCQ checkpoint, so you can keep watching something else.
When a checkpoint appears you get a silent desktop notification and the tab title flashes **⚠ Set C CHECKPOINT**.
Click the notification to jump to that window, answer, and carry on. Nothing to install, no admin rights needed.

## Set up (once per browser)

This bookmark loads the latest `watcher.js` each time you click it, so updates need no re-pasting. It loads through jsDelivr (`cdn.jsdelivr.net`), one of the few outside sites the LMS lets pages load scripts from; the LMS blocks GitHub Pages. If it still won't load, use the full code in [`bookmarklet.txt`](bookmarklet.txt) instead.

If you made the bookmark before 5 Nov 2026, replace its URL with the line below.

1. Copy the line below with the copy button on the right of the box.
2. Press **Ctrl + Shift + B** to show the bookmarks bar.
3. Right-click the bar → **Add page** (Chrome/Brave/Opera) or **Add favorite** (Edge). Name it `SPOM watch`, paste the line as the **URL**, save.

```
javascript:(()=>{const add=(u,f)=>{const s=document.createElement('script');s.src=u;s.onerror=f;document.body.appendChild(s)};add('https://cdn.jsdelivr.net/gh/peanutbutterenthusiast/spom-watch@main/watcher.js?v='+Date.now(),()=>add('https://peanutbutterenthusiast.github.io/spom-watch/watcher.js?v='+Date.now(),()=>alert('SPOM watch could not load. Use the full code in bookmarklet.txt instead.')))})()
```

## Get alerts on your tablet/phone

Install the **ntfy** app, tap **+**, and subscribe to the topic `spom-a414deed5f`. Every checkpoint is pushed there with the window's name.

Note: the LMS (learning.icai.org) blocks pages from contacting ntfy.sh, so phone alerts may not arrive from LMS pages. The desktop notification and the flashing tab title still work.

## Use

- In each LMS lecture window, click **SPOM watch**, press OK (it names the window after the browser), and **Allow** notifications.
- The title shows "✓ Set C watching" for a moment, which means it is on.
- After **Next** loads a new lecture page, click it again.

## If it never alerts

The LMS player may sit in a frame the browser won't let scripts look into. Note what the checkpoint looks like and report back.

Source: [`watcher.js`](watcher.js). [`bookmarklet.txt`](bookmarklet.txt) is the same code on one line.
