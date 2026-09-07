/* Original application code. See LICENSE and NOTICE.md. */
(() => {
  "use strict";
  let config = { ...window.CARD_CONFIG };
  let modelBlobUrl, motionTime = 0;
  const $ = id => document.getElementById(id);
  let state = "idle", scene, model, mixer, action, timer;
  const defaultHeadline = "Get your dino ready for Party time.";
  if (config.headline !== defaultHeadline) $("headline").textContent = config.headline;
  $("intro").textContent = config.intro;
  document.title = config.headline;
  const progress = text => { $("loading-text").textContent = text; };
  // Reload ends the document and any pending camera request, avoiding duplicate MindAR sessions.
  const exit = () => { releaseCamera(); window.location.reload(); };
  function releaseCamera() {
    action?.stop();
    scene?.systems?.["mindar-image-system"]?.controller?.stopProcessVideo();
    document.querySelectorAll("video").forEach(video => {
      video.srcObject?.getTracks().forEach(track => track.stop());
    });
  }
  function fail(message) {
    if (state === "error") return;
    state = "error";
    clearTimeout(timer);
    releaseCamera();
    $("loading").hidden = true;
    $("hud").hidden = true;
    $("error").hidden = false;
    $("error-text").textContent = message;
    $("error-title").focus();
  }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error("The AR software could not load. Check your connection, then try again."));
      document.head.appendChild(script);
    });
  }
  async function checkAsset(url, label) {
    const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error(`${label} isn’t available yet. The card creator needs to add ${url} before this adventure can start.`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!bytes.length || (label === "The dinosaur" && String.fromCharCode(...bytes.slice(0, 4)) !== "glTF") || (label !== "The dinosaur" && /text\/html/.test(response.headers.get("content-type") || ""))) {
      throw new Error(`${label} is not a valid asset. Ask the card creator to replace ${url}.`);
    }
    if (label === "The dinosaur") modelBlobUrl = URL.createObjectURL(new Blob([bytes], {type: "model/gltf-binary"}));
  }
  function registerAnimation() {
    AFRAME.registerComponent("birthday-animation", {
      init() {
        this.el.addEventListener("model-loaded", event => {
          const mesh = event.detail.model;
          if (config.autoFit) {
            // MindAR's untracked anchor has a zero matrix. Measure the export in
            // isolation, before parenting it under that anchor or applying AR placement.
            mesh.removeFromParent();
            mesh.updateMatrixWorld(true);
            const box = new AFRAME.THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new AFRAME.THREE.Vector3());
            const center = box.getCenter(new AFRAME.THREE.Vector3());
            const factor = 1 / Math.max(size.x, size.y, size.z, 0.0001);
            // Normalize arbitrary export units and place the model's base at the anchor.
            const wrapper = new AFRAME.THREE.Group();
            this.el.setObject3D('mesh', wrapper);
            wrapper.add(mesh);
            mesh.scale.multiplyScalar(factor);
            mesh.position.multiplyScalar(factor);
            mesh.position.x -= center.x * factor;
            mesh.position.y -= box.min.y * factor;
            mesh.position.z -= center.z * factor;
          }
          const clips = mesh.animations || [];
          const clip = config.animationClip ? clips.find(item => item.name === config.animationClip) : clips[0];
          if (!clip) {
            if (config.animationClip) {
              fail("The selected animation clip was not found. Check assets/ar/settings.json.");
            }
            // Static GLBs get a gentle whole-model bounce, not invented skeletal animation.
            this.staticModel = !config.animationClip;
            return;
          }
          mixer = new AFRAME.THREE.AnimationMixer(mesh);
          action = mixer.clipAction(clip);
          action.setLoop(AFRAME.THREE.LoopRepeat, Infinity);
          action.play();
          action.paused = true;
        });
      },
      tick(_time, delta) {
        if (state !== "found") return;
        const seconds = Math.min(delta / 1000, 0.1);
        if (mixer) mixer.update(seconds);
        if (this.staticModel) {
          motionTime += seconds;
          const base = config.modelPosition.split(" ").map(Number);
          this.el.object3D.position.z = base[2] + 0.025 * (1 - Math.cos(motionTime * 3));
        }
      },
      remove() { mixer?.stopAllAction(); }
    });
  }
  function createScene() {
    return new Promise((resolve, reject) => {
      scene = document.createElement("a-scene");
      scene.setAttribute("mindar-image", `imageTargetSrc: ${config.targetUrl}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; maxTrack: 1`);
      scene.setAttribute("renderer", "colorManagement: true; alpha: true");
      scene.setAttribute("vr-mode-ui", "enabled: false");
      scene.setAttribute("device-orientation-permission-ui", "enabled: false");
      scene.setAttribute("loading-screen", "enabled: false");
      const camera = document.createElement("a-camera");
      camera.setAttribute("position", "0 0 0");
      camera.setAttribute("look-controls", "enabled: false");
      camera.setAttribute("wasd-controls", "enabled: false");
      scene.appendChild(camera);
      const anchor = document.createElement("a-entity");
      anchor.setAttribute("mindar-image-target", `targetIndex: ${config.targetIndex}`);
      model = document.createElement("a-entity");
      model.setAttribute("birthday-animation", "");
      model.setAttribute("position", config.modelPosition);
      model.setAttribute("rotation", config.modelRotation);
      model.setAttribute("scale", config.modelScale);
      model.setAttribute("visible", false);
      model.addEventListener("model-error", () => reject(new Error("The dinosaur could not load. Ask the card creator to check the GLB file and its textures.")), {once: true});
      let rendered = false, loaded = false;
      const done = () => { if (rendered && loaded) resolve(); };
      model.addEventListener("model-loaded", () => { loaded = true; done(); }, {once: true});
      model.setAttribute("gltf-model", `url(${modelBlobUrl || config.modelUrl})`);
      anchor.appendChild(model);
      scene.appendChild(anchor);
      const light = document.createElement("a-entity");
      light.setAttribute("light", "type: hemisphere; color: #ffffff; groundColor: #b4c9bd; intensity: 2");
      scene.appendChild(light);
      anchor.addEventListener("targetFound", () => {
        if (!["scanning", "found"].includes(state)) return;
        state = "found";
        model.setAttribute("visible", true);
        if (config.restartOnFound) { action?.reset(); motionTime = 0; }
        if (action) { action.paused = false; action.play(); }
        $("scan-frame").hidden = true;
        $("replay").hidden = false;
        $("dot").classList.add("found");
        $("tracking-text").textContent = config.foundMessage;
      });
      anchor.addEventListener("targetLost", () => {
        if (state !== "found") return;
        state = "scanning";
        model.setAttribute("visible", false);
        if (action) action.paused = true;
        $("scan-frame").hidden = false;
        $("replay").hidden = true;
        $("dot").classList.remove("found");
        $("tracking-text").textContent = "Where did the card go? Bring it back into view.";
      });
      scene.addEventListener("arReady", () => {
        if (state === "error") { releaseCamera(); return; }
        clearTimeout(timer);
        state = "scanning";
        document.body.classList.add("ar-active");
        $("loading").hidden = true;
        $("hud").hidden = false;
        $("stop").focus();
      });
      scene.addEventListener("arError", () => fail("We couldn’t open the camera. Allow camera access in your browser’s site settings, close other camera apps, and try again. If you’re inside another app, open this link directly in Safari or Chrome."));
      scene.addEventListener("renderstart", () => { rendered = true; done(); }, {once: true});
      $("ar-stage").appendChild(scene);
    });
  }
  $("start").addEventListener("click", async () => {
    if (state !== "idle") return;
    state = "loading";
    $("start").disabled = true;
    $("welcome").hidden = true;
    $("loading").hidden = false;
    $("cancel").focus();
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      fail("Camera AR needs a secure connection and a supported browser. Open the HTTPS link in Safari or Chrome. For computer previews, use localhost.");
      return;
    }
    timer = setTimeout(() => fail("This is taking longer than expected. Check your connection and any camera permission prompt, then return and try again."), 120000);
    try {
      progress("Preparing the card and dinosaur…");
      const settingsResponse = await fetch("./assets/ar/settings.json", {cache: "no-store", signal: AbortSignal.timeout(15000)});
      if (!settingsResponse.ok) throw new Error("The invitation settings could not load. Please try again.");
      config = {...config, ...await settingsResponse.json()};
      // Fresh asset URLs each session prevent old models/targets persisting after a replacement.
      const revision = Date.now();
      config.modelUrl = `./assets/ar/dinosaur.glb?v=${revision}`;
      config.targetUrl = `./assets/ar/card.mind?v=${revision}`;
      await Promise.all([checkAsset(config.targetUrl, "The card target"), checkAsset(config.modelUrl, "The dinosaur")]);
      if (state === "error") return;
      progress("Loading the AR experience…");
      await loadScript("https://aframe.io/releases/1.5.0/aframe.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js");
      if (state === "error") return;
      registerAnimation();
      await createScene();
      if (state === "error") return;
      progress("Allow camera access when asked. Then hold your card in view while tracking gets ready.");
      // start() is not a readiness Promise in MindAR 1.2.5; use arReady/arError above.
      scene.systems["mindar-image-system"].start();
    } catch (error) {
      fail(error.name === "TimeoutError" ? "The card assets took too long to download. Check your connection and try again." : error.message);
    }
  });
  $("replay").addEventListener("click", () => { if (state === "found") { motionTime = 0; action?.reset().play(); if (action) action.paused = false; } });
  ["stop", "cancel", "retry"].forEach(id => $(id).addEventListener("click", exit));
  window.addEventListener("pagehide", () => { releaseCamera(); if (modelBlobUrl) URL.revokeObjectURL(modelBlobUrl); });
  // MindAR starts tracking asynchronously after video metadata. Stop a late permission grant after a failure.
  document.addEventListener("loadedmetadata", () => { if (state === "error") releaseCamera(); }, true);
  window.addEventListener("unhandledrejection", () => {
    if (state === "loading") fail("Tracking could not start. Check that the compiled card target is valid, then try again.");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ["found", "scanning"].includes(state)) {
      fail("The camera was stopped while you were away. Return to the card to start a fresh adventure.");
    }
  });
})();
