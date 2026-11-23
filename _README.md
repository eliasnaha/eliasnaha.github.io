# eliasnaha.github.io

Personal site, served by GitHub Pages from `main` / root. Static files, no
build step. This file is named `_README.md` so that Pages does not publish it
(Jekyll skips names that start with an underscore).

```
index.html              the portfolio (home page)
404.html                not-found page
favicon.svg, favicon-32.png, apple-touch-icon.png
assets/site.css         all styles
assets/og.png           preview image for shared links
assets/fonts/           IBM Plex Mono (SIL Open Font License, see OFL.txt)
assets/img/             figures for the research entries (720 px webp)

blog/game-harness/            write-up of the game harness (generated elsewhere, committed as built)
blog/game-harness/build-log/  its password-gated build log: landing page plus day1/ ... day5/
```

## Editing the portfolio

Everything is in `index.html`. The page is a header plus three columns
(`<div class="stack">`), and each column holds bordered sections
(`<section class="cell">`, named by its `<h2>`). Entries separated by a dashed
rule are `<article class="item">`; the tighter ones are `class="entry"`. Update
the "updated" date in the header when you change something.

The page uses two colours only, black and white, with no grey: keep it that
way in `assets/site.css`. Only the photographs carry colour.

To preview, open `index.html` in a browser, or run `python -m http.server` in
this folder and open `http://localhost:8000/`.

## Build log

The build-log pages under `blog/game-harness/build-log/` are committed as
built: each one is an encrypted page with a small unlock form. Their sources
and the script that encrypts them are kept outside this repository.
