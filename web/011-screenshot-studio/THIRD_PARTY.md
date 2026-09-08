# Third-party dependency

The showcase page and the Folio sample SVG are original research/demo material. The full Screenshot Studio application is not bundled.

## modern-screenshot 4.6.6

- Package: https://www.npmjs.com/package/modern-screenshot/v/4.6.6
- Source: https://github.com/qq15725/modern-screenshot
- Download: https://registry.npmjs.org/modern-screenshot/-/modern-screenshot-4.6.6.tgz
- Bundled file: package `dist/index.js` → `vendor/modern-screenshot.js` (unmodified).
- SHA-256: `b7c474fbf3e18159d48c9312993d57635aee091bdb5a50351c9c48cefae7278a`
- License: MIT; full copyright and license text retained in [vendor/LICENSE.txt](vendor/LICENSE.txt).
- Purpose: DOM capture and client-side PNG export. No CDN request is needed to load this dependency.

## Screenshot Studio original application and export samples

Screenshot Studio at commit `7c7a38a65a547aa081cb86bf489d27be44aeb4f7` uses Apache-2.0. Its full application is cloned into the ignored `upstream/screenshot-studio` directory and run separately, rather than bundled into this static site. Reproducible local configuration is in `projects/011-screenshot-studio/experiments/`.

`assets/original/original-browser.jpg`, `original-code.png`, `original-animation.mp4` and `animation-poster.png` were produced locally using that application. The Folio content and code snippet are original research samples. The outer background and browser-frame presentation use assets/styles supplied by upstream. The poster is a frame extracted from the exported animation. These are actual exports, not upstream promotional images. The upstream [Apache-2.0 license](assets/original/LICENSE.txt) is retained alongside the samples.

The local adaptation disables the layout's advertising/analytics integrations and PostHog initialization, and adds a minimal local health route; it does not modify the upstream editing or export algorithms. External fonts, online imports and the original feedback UI retain their upstream behavior.
