# AR Invitations

An expandable collection of image-tracked invitations using MindAR and A-Frame.

## Repository layout

- `index.html`: invitation collection entry page.
- `invitations/dinosaur-birthday/`: first complete theme, with its own code, artwork, settings, notices, and asset placeholders.
- `.nojekyll`: static GitHub Pages serving.

Add future themes alongside `dinosaur-birthday` and link them from the root page. Each theme keeps its asset paths relative so it works under a GitHub Pages project URL.

## Current status

Prepared locally. No upload or deployment was performed by this task. The user has published the earlier welcome screen. This update is prepared locally and has not been uploaded.

The dinosaur theme now includes a compiled tracking target and an optimized static GLB with procedural whole-model motion. Replace assets under `invitations/dinosaur-birthday/assets/ar/`. The theme README explains the fixed URL, QR placement, and future replacements. Original artwork and model rights remain separate from the application MIT license.

## Transfer to the repository

Extract `ar-invitations.zip`, then upload the contents of its `ar-invitations` folder to the root of the `ar-invitations` GitHub repository. Upload extracted files, not the ZIP itself. Include `.nojekyll`. Do not put an extra `ar-invitations` folder inside the repository root.

## Local preview

From this folder run `python3 -m http.server 8000 --bind 127.0.0.1` and open `http://localhost:8000/`. The theme is at `http://localhost:8000/invitations/dinosaur-birthday/`.

## Publishing after approval

In GitHub Settings → Pages, select Deploy from a branch, main, /(root). The theme URL will be `https://USERNAME.github.io/ar-invitations/invitations/dinosaur-birthday/`. Point the invitation QR code to that theme URL. The user has already enabled Pages. Uploading updates to the publishing branch will deploy them; no custom deployment workflow is included.

## Checks

Run `node invitations/dinosaur-birthday/tests/lifecycle.cjs`. Mocked lifecycle tests do not replace phone testing with the final card and animated GLB.
