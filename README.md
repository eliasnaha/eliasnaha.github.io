# Build Log — Infinite Environment Generation

A week-long progress site for the General Intuition challenge. **Demos only** — the harness
code lives in a separate repository. Static HTML, no build step.

```
index.html        landing page — one row per day (edit the <nav class="days"> list to add days)
day1/index.html   Day 1 build log
day1/media/*.gif  Day 1 demo clips (rendered from the harness engine state)
.nojekyll         serve files as-is (no Jekyll processing)
```

## Add a new day

1. `cp -r day1 day2` and replace `day2/media/*.gif` + the prompts, telemetry and text.
2. In `index.html`, turn the `Day 02` placeholder into a real `<a class="day" href="day2/">`
   and add a new placeholder for the next day.

## Publish (GitHub Pages)

Create an empty GitHub repo, then from this folder:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then enable **Settings → Pages → Source: deploy from branch → main / (root)**.
Name the repo `<you>.github.io` to serve at `https://<you>.github.io/` (Day 1 at `/day1/`),
or any name to serve at `https://<you>.github.io/<repo>/`.
