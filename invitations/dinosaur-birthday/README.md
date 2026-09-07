> This theme is part of `ar-invitations`. Follow the repository root README for upload and publishing paths. The standalone publishing instructions below are only for deploying this theme separately.

# Dinosaur birthday card · WebAR

Local review build. Nothing has been published. No repository, remote, or deployment workflow has been created.

A static MindAR image-tracking experience built with A-Frame. No build step or account is needed to run it. Application and asset paths are relative, including when hosted at `https://USERNAME.github.io/REPOSITORY/`.

## Structure to approve

```text
invitations/dinosaur-birthday/
  index.html              Mobile welcome screen and AR overlays
  css/styles.css          Responsive illustrated dinosaur party styling
  js/config.js            Editable copy, paths, placement, animation
  js/app.js               Camera lifecycle, tracking, animation
  assets/models/          Add dinosaur.glb here
  assets/targets/         Add card.mind here
  assets/artwork/          Supplied dinosaur and scenery PNG illustrations
  assets/card/            Optional flattened card reference
  .nojekyll               Serve the project as static files
  .gitignore
  LICENSE                 Original application code license
  NOTICE.md               Dependency and artwork licensing notices
  README.md
```

The placeholder folders contain instructions, not fake binary files. The welcome screen works now; Start shows an explanatory missing-asset message until both real files are installed. The welcome screen uses the supplied dinosaur and scenery PNG artwork. The animated GLB and compiled target still need to be added.

## Visual direction

The welcome screen says “Get your dino ready for Party time.” and uses the supplied smiling dinosaurs with leaf green, sky blue, and warm orange accents. Original PNG copies are retained in `assets/artwork/`; they are layout illustrations, not 3D models or tracking targets. Their original resolution is preserved, so the initial artwork download is larger than an optimized web export.

## Add your card and dinosaur

1. Export the exact final tracking area of your editable card as a high-resolution PNG or JPG. Keep the editable original in your design tool. Use distinctive, varied artwork with clear contrast; avoid a mostly blank, glossy, repetitive, or text-only target.
2. Open the [MindAR image compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile), compile that image, and save the output as `assets/targets/card.mind`. With one image, use target index 0. A renamed PNG is not a compiled target.
3. Export an animated glTF 2.0 binary with embedded textures as `assets/models/dinosaur.glb`. Begin with an uncompressed GLB; Draco / Meshopt / KTX2 assets may need additional decoder configuration. Keep geometry and textures modest for mobile; aim for a download under roughly 10 MB.
4. Edit `js/config.js`. Set the greeting and intro, choose a clip by exact name (blank plays the first clip), and adjust model scale, position, and rotation. The included custom A-Frame component uses A-Frame's bundled Three.js AnimationMixer; it does not require aframe-extras. It loops one clip at a time.
5. Record model and artwork rights in `NOTICE.md` before distribution.

The target's center is the origin. X/Y follow the card plane; positive Z points out of the card. One unit is the target's printed width. The default 90-degree X rotation points a Y-up dinosaur out of a card lying flat; tune it for your export. Adjust the model origin in your 3D tool if its feet float above the card.

If personalization changes the tracked artwork, recompile `card.mind` for the new printed design. To reuse one target across editions, keep a distinct tracking panel unchanged and place editable names/ages outside that panel. This project does not edit the original card design in the browser.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/`. Do not double-click index.html: camera access requires HTTPS or a localhost secure context. The CDN libraries require an internet connection. A phone cannot use your computer's localhost, and plain HTTP on a LAN IP generally cannot access its camera. Before publication, use a trusted local HTTPS setup if you need phone testing; no public tunnel is configured here.

To check a GitHub Pages style subpath, serve the parent folder and open `http://localhost:8000/invitations/dinosaur-birthday/`.

## Experience and recovery

- Start preflights both assets and loads pinned A-Frame 1.5.0 and MindAR 1.2.5 on demand. The camera is only requested after Start and successful preparation.
- A loading screen covers asset, model, and tracking setup. A 120-second startup timeout offers recovery; it is not a percentage progress bar.
- MindAR's `arReady` enables the scanning overlay. `arError` gives camera settings and browser guidance. MindAR reports a generic video failure, so the app does not pretend to distinguish denial from an unavailable camera.
- On target found, the model appears and the selected animation loops. On target lost, it hides and pauses immediately; the scan guide returns. Reacquisition restarts the clip by default. Set `restartOnFound: false` to resume instead. Replay restarts the current clip.
- End camera / Back / Retry release tracks and reload to create a clean session. Switching away from a running experience stops tracking and camera tracks and asks for a fresh start on return.
- No audio is requested, no images are uploaded by this app, and no analytics or storage are used. CDN asset requests still contact external hosts.

## Publish through GitHub Pages — ONLY AFTER LOCAL APPROVAL

Do not follow these steps until you approve this structure and are ready to publish.

1. Create a GitHub repository such as `dinosaur-birthday-card`. A public repository supports Pages on GitHub Free; private repository availability depends on your plan. Anything you publish as Pages content should be intended for public viewing.
2. Upload the **contents** of this folder to the repository root, including `index.html`, `.nojekyll`, and the populated `assets` directories. Avoid uploading the surrounding ChatGPT workspace. No workflow YAML is necessary.
3. In the repository, open **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, select **main** and **/(root)**, and Save.
4. Wait for the Pages deployment to complete; open the exact URL GitHub shows, normally `https://USERNAME.github.io/dinosaur-birthday-card/`. Use HTTPS and enable Enforce HTTPS where available.
5. Test with the printed card on a phone before putting this URL into a QR code. Use the Pages site URL, not a GitHub repository/file URL. After initial testing, place the QR outside the tracking area, or recompile if it changes that area.
6. Later changes pushed to the selected branch publish automatically. Preserve filename casing and relative paths. For asset updates, verify with a fresh tab or cleared cache.

If you prefer a repository's `/docs` folder, place these contents in `docs/` and select `/docs` as the source instead. Paths still work. Do not add leading slashes such as `/assets/models/dinosaur.glb`; those resolve outside a GitHub project subpath.

## Device acceptance checklist

Actual camera/tracking behavior cannot be validated without your final assets and a real camera.

- Test current iOS Safari and Android Chrome over HTTPS, portrait and landscape.
- Fresh permission: allow, deny, then recover through browser site settings.
- Missing files, bad GLB, invalid .mind, no animation, offline/CDN failure: clear recovery screen, no endless loader.
- Scan under even light; model position, size, orientation, textures, and selected clip look correct.
- Remove/reintroduce card: hide/pause and restart/resume as configured. Check Replay.
- End camera and switch apps: camera indicator turns off; returning requires a fresh start.
- Test from the repository subpath and after a refresh. No asset requests go to the domain root.
- Keyboard focus, screen reader status, narrow screen, large text, and reduced-motion preference remain usable. The decorative spinner respects reduced motion; the requested dinosaur animation still plays.

## Sources

- [MindAR installation and pinned dependency example](https://hiukim.github.io/mind-ar-js-doc/installation/)
- [MindAR 1.2.5 A-Frame lifecycle source](https://github.com/hiukim/mind-ar-js/blob/v1.2.5/src/image-target/aframe.js)
- [A-Frame glTF model documentation](https://aframe.io/docs/1.5.0/components/gltf-model.html)
- [GitHub Pages publishing source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Local verification performed

JavaScript syntax checks, local HTTP response, and mocked lifecycle tests passed. Run `node tests/lifecycle.cjs` to repeat the checks for insecure context, missing assets, missing animation, target found/lost, replay, and background camera cleanup. These tests do not emulate a camera, WebGL, MindAR recognition, or mobile browser rendering. The final asset/device checklist above remains required.
