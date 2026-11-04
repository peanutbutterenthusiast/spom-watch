# SPOM watch

Tells you when an ICAI SPOM lecture stops at an MCQ checkpoint, so you can keep watching something else.
When a checkpoint appears you get a silent desktop notification and the tab title flashes **⚠ Set C CHECKPOINT**.
Click the notification to jump to that window, answer, and carry on. Nothing to install, no admin rights needed.

## Set up (once per browser)

This bookmark loads the latest `watcher.js` from GitHub Pages each time you click it, so updates need no re-pasting. If the LMS ever blocks it, use the full code in [`bookmarklet.txt`](bookmarklet.txt) instead.

1. Copy the line below with the copy button on the right of the box.
2. Press **Ctrl + Shift + B** to show the bookmarks bar.
3. Right-click the bar → **Add page** (Chrome/Brave/Opera) or **Add favorite** (Edge). Name it `SPOM watch`, paste the line as the **URL**, save.

```
javascript:(()=>{const s=document.createElement('script');s.src='https://peanutbutterenthusiast.github.io/spom-watch/watcher.js?v='+Date.now();s.onerror=()=>alert('SPOM watch could not load. The LMS may block outside scripts.');document.body.appendChild(s)})()
```

## Get alerts on your tablet/phone

Install the **ntfy** app, tap **+**, and subscribe to the topic `spom-a414deed5f`. Every checkpoint is pushed there with the window's name.

## Use

- In each LMS lecture window, click **SPOM watch**, press OK (it names the window after the browser), and **Allow** notifications.
- The title shows "✓ Set C watching" for a moment, which means it is on.
- After **Next** loads a new lecture page, click it again.

## If it never alerts

The LMS player may sit in a frame the browser won't let scripts look into. Note what the checkpoint looks like and report back.

Source: [`watcher.js`](watcher.js). [`bookmarklet.txt`](bookmarklet.txt) is the same code on one line.
