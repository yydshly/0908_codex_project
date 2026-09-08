# Bundled Splat.js runtime

Source: https://github.com/arrival-space/splat.js
Commit: 128438ac803aacf868938471dcd52f2a16e0d3a6 (2026-09-08 research snapshot)
Copyright (c) 2026 Stratum1 GmbH. MIT; see LICENSE.

Includes upstream src/, app/, and data/synthetic/. Third-party bundled modules retain their upstream notices, including PlayCanvas and splat-transform. See the adjacent third-party license files.

- PlayCanvas Engine v2.21.4: https://github.com/playcanvas/engine (MIT; PLAYCANVAS-LICENSE).
- splat-transform: https://github.com/playcanvas/splat-transform (MIT; SPLAT-TRANSFORM-LICENSE).
- Mediabunny (unmodified upstream bundled file in src/vendor/): https://github.com/Vanilagy/mediabunny (MPL-2.0; MEDIABUNNY-LICENSE). The exact bundled artifact is also available in the pinned Splat.js source above; its copyright/license header is preserved. It supports the optional video module.

Local integration changes:
- app/js/data.js: real photograph dataset base points to the upstream public CDN, as in its hosted deployment.
- app/js/app.js: async boot plus ?sample=truck and ?sample=synthetic open their actual input card with synchronized Draft settings; synthetic images resolve to bundled data. No automatic training.
- app/index.html: remove external Google Fonts requests; use CSS fallbacks.
- app/js/app.js: ?videoDemo=nickesc loads an independent public MP4 through the original useOwnVideo / extractSharpFrames flow. Local previews use the checksum-verified download; public pages use the author's source URL via video-source.js. Video intake now awaits open(set) and shows the input detail card, matching the photo intake UI so Start training is reachable. The video decoder, frame selector, SfM and Gaussian training source remain unmodified.

No modification to the numerical training library. Pretrained Truck and Bar models and real photographs are fetched from the upstream CDN, not redistributed here. Bar source: https://huajianup.github.io/research/360Roam/ (CC BY-NC-SA). Dataset licenses are separate from the library license.
