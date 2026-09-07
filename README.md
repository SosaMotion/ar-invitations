# AR Invitations

An expandable collection of image-tracked invitations using MindAR and A-Frame.

## Repository layout

- `index.html`: invitation collection entry page.
- `invitations/dinosaur-birthday/`: first complete theme, with its own code, artwork, settings, notices, and asset placeholders.
- `.nojekyll`: static GitHub Pages serving.

Add future themes alongside `dinosaur-birthday` and link them from the root page. Each theme keeps its asset paths relative so it works under a GitHub Pages project URL.

## Current status

Prepared locally. No upload or deployment was performed by this task. GitHub Pages should remain disabled until publication is approved.

The dinosaur welcome screen and AR application code are included. Camera tracking requires two actual files that have not yet been supplied:

- `invitations/dinosaur-birthday/assets/models/dinosaur.glb`
- `invitations/dinosaur-birthday/assets/targets/card.mind`

PNG illustrations do not replace either file. See the theme README for export and compilation instructions. Supplied artwork is excluded from the application MIT license; see the theme NOTICE.md.

## Transfer to the repository

Extract `ar-invitations.zip`, then upload the contents of its `ar-invitations` folder to the root of the `ar-invitations` GitHub repository. Upload extracted files, not the ZIP itself. Include `.nojekyll`. Do not put an extra `ar-invitations` folder inside the repository root.

## Local preview

From this folder run `python3 -m http.server 8000 --bind 127.0.0.1` and open `http://localhost:8000/`. The theme is at `http://localhost:8000/invitations/dinosaur-birthday/`.

## Publishing after approval

In GitHub Settings → Pages, select Deploy from a branch, main, /(root). The theme URL will be `https://USERNAME.github.io/ar-invitations/invitations/dinosaur-birthday/`. Point the invitation QR code to that theme URL. Keep Pages disabled until approved; no automated deployment workflow is included.

## Checks

Run `node invitations/dinosaur-birthday/tests/lifecycle.cjs`. Mocked lifecycle tests do not replace phone testing with the final card and animated GLB.
