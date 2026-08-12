# vendor

Third-party libraries, committed rather than installed so the site has no
build step and no runtime CDN dependency. Nothing in here is my code, and
nothing in here should be edited by hand: to change a version, re-download.

## What the page actually loads

`index.html` loads the two minified builds:

| File | Size | Why |
|---|---|---|
| `three.r134.min.js` | 616 KB | WebGL renderer. Vanta needs a global `THREE`. |
| `vanta.net.min.js`  |  13 KB | The animated lattice behind every section. |

## What is here to read

Minified builds are not readable in any useful sense: reformatting them
gives you well-indented `a`, `b`, `e2` variables and no comments. So the
readable upstream sources sit alongside them instead.

| File | What it is |
|---|---|
| `three.r134.js` | The three.js **development build**: same library, real names, full comments. |
| `src/vanta.net.js` | The lattice effect itself: options, point generation, line drawing. Start here. |
| `src/_base.js` | `VantaBase`: the lifecycle every Vanta effect inherits (init, resize, animation loop, mouse handling). |
| `src/helpers.js` | Small utilities `vanta.net.js` calls (`rn`, `ri`, `mobileCheck`, `getBrightness`). |

The three `src/*.js` files are ES modules that import each other, which is
why they cannot simply be swapped into a `<script>` tag: the browser build
is what `vanta.net.min.js` already is. Read them, do not wire them up.

## Reading the development build instead of the minified one

If you want to step through three.js in DevTools, point the page at the
development build for the length of the debugging session:

```html
<!-- index.html, near the bottom -->
<script src="vendor/three.r134.js"></script>
```

That is 1.2 MB instead of 616 KB, so switch it back before deploying.

## Versions and where they came from

- three.js `r134` (npm `three@0.134.0`) — pinned to r134 because that is the
  release Vanta 0.5.24 is built against.
- Vanta `0.5.24`

```bash
curl -L https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js -o vendor/three.r134.min.js
curl -L https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.js     -o vendor/three.r134.js
curl -L https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js -o vendor/vanta.net.min.js
for f in vanta.net.js _base.js helpers.js; do
  curl -L "https://cdn.jsdelivr.net/npm/vanta@0.5.24/src/$f" -o "vendor/src/$f"
done
```

## Licences

three.js is MIT (Copyright © 2010-2021 three.js authors). Vanta is MIT
(Copyright © 2019 Teng Bao). Both licences are included in the files above.
