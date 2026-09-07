// Edit this file to personalize the experience. All asset URLs are relative to index.html.
window.CARD_CONFIG = Object.freeze({
  headline: "Get your dino ready for Party time.",
  // Set headline to a different string to replace the styled default heading.
  intro: "Point your camera at your birthday card. Let’s get this dino party started!",
  modelUrl: "./assets/ar/dinosaur.glb",
  targetUrl: "./assets/ar/card.mind",
  targetIndex: 0,
  modelPosition: "0 0 0",
  modelRotation: "90 0 0", // glTF +Y becomes the outward-facing target +Z.
  modelScale: "0.5 0.5 0.5", // One target-space unit equals the printed target width.
  animationClip: "", // Empty = first embedded clip; otherwise use its exact name.
  restartOnFound: true,
  foundMessage: "It’s Party time! Have a roarsome birthday!"
});
