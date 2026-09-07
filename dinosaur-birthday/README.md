# Dinosaur birthday AR invitation

Live destination: https://sosamotion.github.io/ar-invitations/invitations/dinosaur-birthday/

The URL and QR stay fixed while assets are replaced in `assets/ar/`. See [asset swap instructions](./assets/ar/README.md).

## Included in this update

- Actual compiled MindAR target from the lower rock-ring panel of the revised invitation.
- Unmodified copy of the latest lighter Blue_Dino_01.glb (9.1 MiB). Original source file is untouched.
- Whole-model bounce for this static GLB; embedded animation playback for future animated GLBs.
- Automatic model sizing, single-download model loading, fresh asset URLs, and editable settings.json.
- Existing camera start, recovery, target found/lost, replay, and stop behavior.

Upload the updated files to the existing repository, preserving this folder structure. This task has not pushed or deployed the update.

## QR placement

The revised invitation already contains a QR pointing to the correct live destination. It is included in the new tracking crop along with the surrounding rock ring. Preserve its position, size, and pattern when reusing this target. Party information above the panel can change independently. Remove “Your paragraph text” before printing. Test the QR and tracking on the final printed version.

The QR opens the web page; it is not the image-tracking target. After allowing camera access, guests point the camera at the illustrated part of the invitation.

## Verification

Run `node tests/lifecycle.cjs` from this theme folder. Checks cover startup failures, missing named clip, static-model motion, found/lost/replay, and background cleanup with mocks. The generated .mind file is imported back through MindAR to check structure. The GLB is parsed to check format and geometry. Actual recognition, visual model fidelity, camera permission behavior, and placement still require real-phone testing.

Open the root project locally using Python's HTTP server or use the deployed HTTPS URL. Do not use file:// or an insecure phone LAN URL for camera testing.

See NOTICE.md for licensing. Supplied artwork and GLB are excluded from the source-code MIT license.
