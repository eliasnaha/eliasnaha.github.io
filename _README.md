# eliasnaha.github.io

Personal site, served by GitHub Pages from `main` / root. Static files, no
build step. This file is named `_README.md` so that Pages does not publish it
(Jekyll skips names that start with an underscore).

```
index.html              the portfolio (home page)
404.html                not-found page
favicon.svg, favicon-32.png, apple-touch-icon.png
assets/site.css         all styles
assets/signal.js        the figure under the opening line
assets/og.png           preview image for shared links
assets/fonts/           Newsreader (variable, SIL Open Font License, see OFL.txt)
assets/img/             figures for the research entries (720 px webp)

blog/game-harness/            write-up of the game harness (generated elsewhere, committed as built)
blog/game-harness/build-log/  its password-gated build log: landing page plus day1/ ... day5/
```

## Editing the portfolio

Everything is in `index.html`. Each section is a `<section class="band">` with
its name in an `<h2 class="side">` and its content in `<div class="main">`; each
item inside is an `<article class="entry">`. Update the "Last updated" line in
the footer when you change something.

To preview, open `index.html` in a browser, or run `python -m http.server` in
this folder and open `http://localhost:8000/`.

## Build log

The build-log pages under `blog/game-harness/build-log/` are committed as
built: each one is an encrypted page with a small unlock form. Their sources
and the script that encrypts them are kept outside this repository.
