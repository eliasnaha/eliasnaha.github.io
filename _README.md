# eliasnaha.github.io

Personal site, served by GitHub Pages from `main` / root. Static files, no build
step for the portfolio. The file is named `_README.md` so that Pages does not
publish it.

```
index.html              the portfolio (home page)
404.html                not-found page
favicon.svg
assets/site.css         all styles
assets/signal.js        the figure under the opening line
assets/fonts/           Newsreader (variable, SIL Open Font License, see OFL.txt)
assets/img/             figures for the research entries (720 px webp)

blog/game-harness/      write-up of the game harness (generated elsewhere, committed as built)

build-log/index.html    password-gated landing of the build log
day1/ ... day5/         password-gated build-log pages
_src/                   plaintext sources of the gated pages
_build.py               encrypts _src into build-log/ and dayN/
```

## Editing the portfolio

Everything is in `index.html`. Each section is a `<section class="band">` with
its name in an `<h2 class="side">` and its content in `<div class="main">`; each
item inside is an `<article class="entry">`. Update the "Last updated" line in
the footer when you change something.

To preview locally: `python -m http.server` in this folder, then open
`http://localhost:8000/`.

## Do not add `.nojekyll`

Pages runs Jekyll on this repository, and Jekyll skips every file and folder
whose name starts with an underscore. That is what keeps `_src/`, `_build.py`
and this file off the public site. Adding `.nojekyll` would publish the
plaintext sources of the gated pages.

Jekyll only hides them from the website. Anyone who can read the repository on
GitHub can read `_src/`.

## Build log

The build log used to be the site root. The portfolio lives there now, so the
landing is published at `/build-log/` and the day pages keep their URLs. The
`_src` pages still link as if the landing were the root; each gate rewrites
those links after decrypting (see `RELINK_LANDING` and `RELINK_PAGE` in
`_build.py`).

To rebuild after editing `_src`: put the password in `_secret/password.txt`
(never committed) and run `python _build.py`.
