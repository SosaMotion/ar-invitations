# Swap this invitation's AR assets

- dinosaur.glb: the model visitors see. Replace using this exact filename.
- card.png: tracking artwork exported from the invitation. This reference image does not drive tracking directly.
- card.mind: compiled tracking data. Recompile whenever card.png changes.
- settings.json: optional placement, scale, and animation settings.

To recompile: open https://hiukim.github.io/mind-ar-js-doc/tools/compile/ on a computer, select card.png as the ONLY image, compile, download, and rename the result card.mind. Replace card.png and card.mind together in the same GitHub commit. Upload the GLB in that commit too if it belongs to the same update. Wait for Pages deployment and reopen the invitation.

Keep the folder and filenames unchanged. No QR change is needed. A browser already running the old experience needs to reload/start a new session. Assets use a fresh URL each session to avoid stale browser copies; Pages/CDN propagation may still take time.

Current target is a crop of the supplied 5 x 7 inch PDF: full width, from 50% to 84.375% of its height measured from the top (3.5 to approximately 5.91 inches). The remaining bottom approximately 1.09 inches is outside the target. Keep the artwork inside the crop unchanged if you want to reuse this .mind file. Changing names/dates above it does not change this target. Moving/scaling the entire target region together is okay in principle; changing the arrangement within it needs recompilation and testing.

Current model is an unmodified copy of the latest user-supplied lighter Blue_Dino_01.glb: 9,537,012 bytes (9.1 MiB), with 12,061 vertices and embedded textures. The original source is untouched. It has no animation clips; application code supplies a gentle whole-model bounce. A future GLB with embedded clips automatically plays its first clip. Set animationClip to an exact clip name to choose another. A wrong explicit name produces a setup error.

settings.json: autoFit=true normalizes export units and centers the model at its base. modelScale sets its size relative to the target width. modelRotation is in degrees. modelPosition is in target coordinates: X/Y lie on the card; +Z points out. Set autoFit=false if an intentionally positioned export should keep its original coordinates.

Use binary glTF 2.0 with embedded textures. Start with uncompressed geometry; Draco/Meshopt/KTX2 compressed replacement assets require decoder setup that this page does not include. Preserve animation clips when exporting. Test replacement models on a phone, especially shape, orientation, texture appearance, and scale.

## Tracking tuning

The stability preset uses filterMinCF=0.0005 and filterBeta=100 for stronger smoothing, warmupTolerance=5, and missTolerance=10 for brief missed-frame tolerance. These are tuning starting points, not phone-validated guarantees. Extra smoothing adds some lag; missed-frame tolerance briefly holds the last pose, so it can appear to float if the camera moves while the target is obscured. Keep the whole tracked artwork visible.

staticMotion=false disables the test model's intentional bounce so tracking is easier to judge. It does not disable embedded GLB animations. Set true to restore the bounce for a static model. restartOnFound=false resumes embedded animation after reacquisition instead of restarting it.

If movement feels delayed, try filterBeta=300 and filterMinCF=0.001. If the model hangs in the wrong place after losing the card, reduce missTolerance to 5. Values are exposed by MindAR 1.2.5; tolerances count processing frames, not seconds.
