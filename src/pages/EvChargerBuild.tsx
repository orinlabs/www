import { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// ---------------------------------------------------------------------------
// Stage script. The whole build is driven by a single master timeline value
// `t` in [0, STAGES.length]. Stage i owns the window [i, i + 1]. Every part of
// the charger reveals across a sub-window of t, so scrubbing the timeline
// assembles / disassembles the install continuously.
// ---------------------------------------------------------------------------

interface Stage {
  title: string;
  detail: string;
}

const STAGES: Stage[] = [
  {
    title: "Site Prep",
    detail: "Pour the concrete pad and set the anchor bolts.",
  },
  {
    title: "Set Pedestal",
    detail: "Lower the pedestal and torque it down to the foundation.",
  },
  {
    title: "Mount Charger",
    detail: "Place the charging unit and fasten it to the pedestal.",
  },
  {
    title: "Wire Connections",
    detail: "Pull conduit, land the feed, and dress the cable.",
  },
  {
    title: "Commissioning",
    detail: "Energize, run self-tests, and verify a live charging session.",
  },
  {
    title: "Closeout & Photos",
    detail: "Capture inspection photos and submit the closeout packet.",
  },
];

const CLOSEOUT_PHOTOS = [
  "Pad & anchors",
  "Pedestal torque",
  "Conduit & feed",
  "Cable dress",
  "Live session",
  "Final label",
];

const PRIMARY = "#00a071";
const PRIMARY_HEX = 0x00a071;
const ENERGY_HEX = 0x32e6a0;

// ---------------------------------------------------------------------------
// Small math helpers.
// ---------------------------------------------------------------------------

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

// Normalized progress of t across the window [a, b].
function win(t: number, a: number, b: number): number {
  return clamp01((t - a) / (b - a));
}

function easeOut(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

// Overshoot ease for parts that "pop" into place.
function easeBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface SceneApi {
  setTarget: (t: number) => void;
  setPlaying: (playing: boolean) => void;
  getTarget: () => number;
}

// ---------------------------------------------------------------------------
// The Three.js scene. Everything lives inside buildScene so it can be torn
// down cleanly. Returns an imperative API the React overlay drives.
// ---------------------------------------------------------------------------

function buildScene(
  container: HTMLDivElement,
  onTick: (t: number, playing: boolean) => void,
): { api: SceneApi; dispose: () => void } {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.026);

  // Studio backdrop: a soft radial gradient baked into a texture.
  scene.background = makeBackdrop();

  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(6.5, 4.6, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  container.appendChild(renderer.domElement);

  // Post-processing: subtle bloom so the screen, LEDs and energy glow.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.62,
    0.5,
    0.82,
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.6, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4.5;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.32;
  let lastInteract = 0;
  controls.addEventListener("start", () => {
    lastInteract = performance.now();
    controls.autoRotate = false;
  });

  // -- Lighting ------------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0x9fb4d6, 0x0a0c12, 0.72);
  scene.add(hemi);

  const front = new THREE.DirectionalLight(0xdfe8ff, 0.55);
  front.position.set(2, 3.5, 9);
  scene.add(front);

  const key = new THREE.DirectionalLight(0xfff2e0, 2.1);
  key.position.set(6, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x2bd6a0, 1.1);
  rim.position.set(-7, 4, -6);
  scene.add(rim);

  const fill = new THREE.PointLight(0x6f8cff, 0.5, 30);
  fill.position.set(-4, 3, 6);
  scene.add(fill);

  // -- Ground --------------------------------------------------------------
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(40, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0e1118,
      roughness: 1,
      metalness: 0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(60, 60, 0x1b2740, 0x121a2b);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.5;
  grid.position.y = 0.002;
  scene.add(grid);

  // -- Materials -----------------------------------------------------------
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xb7b3a8,
    roughness: 0.95,
    metalness: 0.02,
  });
  const concreteDarkMat = new THREE.MeshStandardMaterial({
    color: 0x8d8a82,
    roughness: 0.98,
    metalness: 0.02,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xc9ccd3,
    roughness: 0.35,
    metalness: 0.9,
  });
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x191b22,
    roughness: 0.42,
    metalness: 0.35,
  });
  const bodyLightMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.5,
    metalness: 0.1,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: PRIMARY_HEX,
    roughness: 0.4,
    metalness: 0.2,
    emissive: new THREE.Color(PRIMARY_HEX),
    emissiveIntensity: 0,
  });
  const rubberMat = new THREE.MeshStandardMaterial({
    color: 0x0d0e11,
    roughness: 0.8,
    metalness: 0.1,
  });
  const conduitMat = new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    roughness: 0.5,
    metalness: 0.6,
  });

  // Tracks per-part reveal so the animate loop can pose everything from t.
  interface Part {
    obj: THREE.Object3D;
    update: (t: number, dt: number, time: number) => void;
  }
  const parts: Part[] = [];

  // -- Concrete pad --------------------------------------------------------
  const padGroup = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.26, 3.4), concreteMat);
  pad.position.y = 0.13;
  pad.castShadow = true;
  pad.receiveShadow = true;
  padGroup.add(pad);
  // Chamfered top lip.
  const padLip = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.06, 3.0),
    concreteDarkMat,
  );
  padLip.position.y = 0.29;
  padLip.receiveShadow = true;
  padGroup.add(padLip);
  scene.add(padGroup);
  parts.push({
    obj: padGroup,
    update: (t) => {
      const r = easeOut(win(t, 0, 0.7));
      padGroup.visible = r > 0.001;
      padGroup.scale.set(r, Math.max(0.001, r), r);
      padGroup.position.y = (1 - r) * -0.4;
    },
  });

  // -- Anchor bolts --------------------------------------------------------
  const boltsGroup = new THREE.Group();
  const boltOffsets: Array<[number, number]> = [
    [-0.45, -0.32],
    [0.45, -0.32],
    [-0.45, 0.32],
    [0.45, 0.32],
  ];
  const boltMeshes: THREE.Mesh[] = [];
  for (const [bx, bz] of boltOffsets) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.22, 12),
      steelMat,
    );
    bolt.position.set(bx, 0.4, bz);
    bolt.castShadow = true;
    boltsGroup.add(bolt);
    boltMeshes.push(bolt);
  }
  scene.add(boltsGroup);
  parts.push({
    obj: boltsGroup,
    update: (t) => {
      boltMeshes.forEach((bolt, i) => {
        const r = easeBack(win(t, 0.5 + i * 0.05, 0.95 + i * 0.05));
        bolt.visible = r > 0.001;
        bolt.scale.set(1, Math.max(0.001, r), 1);
        bolt.position.y = 0.31 + r * 0.09;
      });
    },
  });

  // -- Pedestal ------------------------------------------------------------
  const pedestal = new THREE.Group();
  const pedBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.9, 0.72),
    concreteMat,
  );
  pedBody.position.y = 0.45;
  pedBody.castShadow = true;
  pedBody.receiveShadow = true;
  pedestal.add(pedBody);
  const pedCap = new THREE.Mesh(
    new THREE.BoxGeometry(1.02, 0.1, 0.8),
    concreteDarkMat,
  );
  pedCap.position.y = 0.94;
  pedCap.castShadow = true;
  pedestal.add(pedCap);
  pedestal.position.y = 0.29;
  scene.add(pedestal);
  parts.push({
    obj: pedestal,
    update: (t) => {
      const r = easeOut(win(t, 1.0, 1.85));
      pedestal.visible = r > 0.001;
      // Drops in from above and settles.
      pedestal.position.y = 0.29 + (1 - r) * 3.4;
      const op = clamp01(r * 1.4);
      setGroupOpacity(pedestal, op);
    },
  });

  // -- Charger unit --------------------------------------------------------
  // Pedestal cap top sits at y = 0.29 + 0.99 = 1.28.
  const PED_TOP = 1.28;
  const charger = new THREE.Group();

  const column = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 1.78, 0.44),
    bodyMat,
  );
  column.position.y = PED_TOP + 0.89;
  column.castShadow = true;
  charger.add(column);

  // White two-tone base band (brand styling) wrapping the lower column.
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.67, 0.5, 0.47), bodyLightMat);
  skirt.position.set(0, PED_TOP + 0.27, 0);
  skirt.castShadow = true;
  charger.add(skirt);

  // Angled head.
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.68, 0.22, 0.48),
    bodyMat,
  );
  head.position.y = PED_TOP + 1.85;
  head.castShadow = true;
  charger.add(head);

  // Primary accent bar near the top.
  const accentBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.06, 0.03),
    accentMat,
  );
  accentBar.position.set(0, PED_TOP + 1.72, 0.234);
  charger.add(accentBar);

  // Dark recessed faceplate framing the display.
  const faceplate = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.8, 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x0b0c0f,
      roughness: 0.5,
      metalness: 0.2,
    }),
  );
  faceplate.position.set(0, PED_TOP + 1.22, 0.222);
  charger.add(faceplate);

  // Screen (canvas texture, lit only after commissioning).
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 300;
  screenCanvas.height = 380;
  const screenCtx = screenCanvas.getContext("2d");
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0xffffff,
    emissiveMap: screenTex,
    emissiveIntensity: 0,
    roughness: 0.3,
    metalness: 0,
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.68), screenMat);
  screen.position.set(0, PED_TOP + 1.22, 0.24);
  charger.add(screen);

  // Vertical LED status strip.
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x223a33,
    emissive: new THREE.Color(ENERGY_HEX),
    emissiveIntensity: 0,
    roughness: 0.4,
  });
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.2, 0.03), ledMat);
  led.position.set(0.26, PED_TOP + 0.95, 0.2);
  charger.add(led);

  // Cable holster on the side.
  const holster = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.26, 0.2),
    bodyMat,
  );
  holster.position.set(-0.36, PED_TOP + 0.7, 0.05);
  holster.castShadow = true;
  charger.add(holster);

  // Connector handle (nozzle) parked in the holster.
  const connector = new THREE.Group();
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.26, 16),
    new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.5,
      metalness: 0.3,
    }),
  );
  connector.add(handle);
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16),
    steelMat,
  );
  nozzle.position.y = 0.18;
  connector.add(nozzle);
  const connectorTip = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.05, 0.04),
    accentMat,
  );
  connectorTip.position.set(0, 0.06, 0.06);
  connector.add(connectorTip);
  connector.position.set(-0.43, PED_TOP + 0.78, 0.06);
  charger.add(connector);

  // Coiled charging cable (tube along a curve from column to holster).
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.32, PED_TOP + 1.0, 0.1),
    new THREE.Vector3(-0.6, PED_TOP + 0.78, 0.18),
    new THREE.Vector3(-0.5, PED_TOP + 0.5, 0.05),
    new THREE.Vector3(-0.43, PED_TOP + 0.62, 0.06),
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 40, 0.028, 10, false),
    rubberMat,
  );
  charger.add(cable);

  scene.add(charger);
  parts.push({
    obj: charger,
    update: (t) => {
      const drop = easeOut(win(t, 2.0, 2.9));
      charger.visible = drop > 0.001;
      charger.position.y = (1 - drop) * 4.2;
      setGroupOpacity(charger, clamp01(drop * 1.5), [screenMat, accentMat, ledMat]);
      // Screen + accents fade in as the detail work happens.
      const detail = win(t, 2.6, 3.0);
      accentBar.visible = detail > 0.02;
      screen.visible = detail > 0.02;
      led.visible = detail > 0.02;
      connector.visible = detail > 0.02;
      cable.visible = detail > 0.02;
      holster.visible = detail > 0.02;
    },
  });

  // -- Underground feed / conduit -----------------------------------------
  const feed = new THREE.Group();
  // Vertical conduit riser from below the pad up into the pedestal.
  const riser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16),
    conduitMat,
  );
  riser.position.set(0.18, 0.2, -0.1);
  feed.add(riser);
  // 90° sweep elbow toward the trench.
  const elbow = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.06, 12, 24, Math.PI / 2), conduitMat);
  elbow.position.set(0.34, 0.18, -0.1);
  elbow.rotation.set(0, Math.PI, Math.PI / 2);
  feed.add(elbow);
  // Horizontal run out to the edge of the pad (the trench).
  const trench = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 1.5, 16),
    conduitMat,
  );
  trench.rotation.z = Math.PI / 2;
  trench.position.set(1.1, 0.03, -0.1);
  feed.add(trench);
  scene.add(feed);
  parts.push({
    obj: feed,
    update: (t) => {
      const r = easeOut(win(t, 3.0, 3.6));
      feed.visible = r > 0.001;
      setGroupOpacity(feed, r);
      feed.scale.z = Math.max(0.001, r);
    },
  });

  // -- Energy particles flowing through the cable to the car --------------
  const ENERGY_COUNT = 60;
  const energyGeo = new THREE.BufferGeometry();
  const energyPos = new Float32Array(ENERGY_COUNT * 3);
  energyGeo.setAttribute("position", new THREE.BufferAttribute(energyPos, 3));
  const energyMat = new THREE.PointsMaterial({
    color: ENERGY_HEX,
    size: 0.09,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const energy = new THREE.Points(energyGeo, energyMat);
  scene.add(energy);

  // -- Stylized EV that rolls in for commissioning ------------------------
  const car = new THREE.Group();
  const carPaint = new THREE.MeshStandardMaterial({
    color: 0x3c4555,
    roughness: 0.28,
    metalness: 0.6,
  });
  const carGlass = new THREE.MeshStandardMaterial({
    color: 0x0a0d12,
    roughness: 0.1,
    metalness: 0.2,
  });
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 1.1), carPaint);
  carBody.position.y = 0.55;
  carBody.castShadow = true;
  car.add(carBody);
  const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.42, 1.0), carPaint);
  carCabin.position.set(-0.1, 0.94, 0);
  carCabin.castShadow = true;
  car.add(carCabin);
  const carWindow = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.34, 1.02), carGlass);
  carWindow.position.set(-0.1, 0.96, 0);
  car.add(carWindow);
  for (const wx of [-0.8, 0.8]) {
    for (const wz of [-0.55, 0.55]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.18, 20),
        rubberMat,
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.28, wz);
      wheel.castShadow = true;
      car.add(wheel);
    }
  }
  // Charge port glow on the car.
  const carPort = new THREE.Mesh(
    new THREE.CircleGeometry(0.06, 20),
    new THREE.MeshStandardMaterial({
      color: 0x111316,
      emissive: new THREE.Color(ENERGY_HEX),
      emissiveIntensity: 0,
      roughness: 0.4,
    }),
  );
  carPort.position.set(1.26, 0.62, 0.2);
  carPort.rotation.y = Math.PI / 2;
  car.add(carPort);
  car.position.set(2.7, 0, 1.6);
  car.rotation.y = -0.35;
  scene.add(car);

  // Live cable arcing from the charger to the car port during commissioning.
  const liveCableMat = rubberMat.clone();
  const liveCable = new THREE.Mesh(new THREE.BufferGeometry(), liveCableMat);
  scene.add(liveCable);
  const carWorldPort = new THREE.Vector3();

  parts.push({
    obj: car,
    update: (t) => {
      const r = easeOut(win(t, 3.85, 4.45));
      car.visible = r > 0.001;
      // Rolls in from the right and settles.
      car.position.x = 2.7 + (1 - r) * 4.5;
      setGroupOpacity(car, clamp01(r * 1.4), [
        carPort.material as THREE.MeshStandardMaterial,
      ]);

      const live = win(t, 4.25, 4.7);
      const portMat = carPort.material as THREE.MeshStandardMaterial;
      portMat.emissiveIntensity = live * 2.2;

      // Build / pose the arcing live cable once the car is seated.
      liveCable.visible = live > 0.02;
      if (live > 0.02) {
        carPort.getWorldPosition(carWorldPort);
        const start = new THREE.Vector3(-0.43, PED_TOP + 0.78, 0.06);
        const mid = new THREE.Vector3()
          .addVectors(start, carWorldPort)
          .multiplyScalar(0.5);
        mid.y -= 0.55 * live;
        const curve = new THREE.CatmullRomCurve3([
          start,
          mid,
          carWorldPort.clone(),
        ]);
        const geo = new THREE.TubeGeometry(curve, 32, 0.03, 8, false);
        liveCable.geometry.dispose();
        liveCable.geometry = geo;
      }
    },
  });

  // Energy flow + screen + LED state driven each frame in the main loop.
  function updateLive(t: number, time: number) {
    const live = win(t, 4.25, 4.9);
    energyMat.opacity = live;
    ledMat.emissiveIntensity = win(t, 4.0, 4.5) * 2.4;
    accentMat.emissiveIntensity = win(t, 2.7, 3.2) * 0.6 + win(t, 4.0, 4.5) * 1.4;
    screenMat.emissiveIntensity = win(t, 2.7, 3.2) * 0.2 + win(t, 4.0, 4.6) * 1.7;

    // Animate particles streaming along the live cable curve.
    if (live > 0.02 && liveCable.geometry.attributes.position) {
      carPort.getWorldPosition(carWorldPort);
      const start = new THREE.Vector3(-0.43, PED_TOP + 0.78, 0.06);
      const mid = new THREE.Vector3()
        .addVectors(start, carWorldPort)
        .multiplyScalar(0.5);
      mid.y -= 0.55;
      const curve = new THREE.CatmullRomCurve3([start, mid, carWorldPort.clone()]);
      for (let i = 0; i < ENERGY_COUNT; i++) {
        const u = (i / ENERGY_COUNT + time * 0.25) % 1;
        const p = curve.getPoint(u);
        energyPos[i * 3] = p.x;
        energyPos[i * 3 + 1] = p.y;
        energyPos[i * 3 + 2] = p.z;
      }
      energyGeo.attributes.position.needsUpdate = true;
    } else {
      energyMat.opacity = 0;
    }

    drawScreen(t, time);
  }

  // -- Charger screen UI (canvas texture) ---------------------------------
  function drawScreen(t: number, time: number) {
    if (!screenCtx) return;
    const w = screenCanvas.width;
    const h = screenCanvas.height;
    const ctx = screenCtx;
    ctx.clearRect(0, 0, w, h);

    const on = win(t, 4.0, 4.5);
    // Backplate.
    ctx.fillStyle = on > 0.05 ? "#06120e" : "#0a0b0d";
    ctx.fillRect(0, 0, w, h);

    if (on < 0.05) {
      screenTex.needsUpdate = true;
      return;
    }

    ctx.globalAlpha = on;
    // Header.
    ctx.fillStyle = PRIMARY;
    ctx.font = "bold 30px 'Geist', system-ui, sans-serif";
    ctx.fillText("ORIN", 24, 56);
    ctx.fillStyle = "#5b7d72";
    ctx.font = "16px 'Geist', system-ui, sans-serif";
    ctx.fillText("EV CHARGER", 24, 80);

    const charging = t >= 4.45;
    const pct = charging ? Math.min(99, Math.floor(win(t, 4.45, 5.6) * 86 + 12)) : 0;

    // Status pill.
    const pulse = 0.6 + 0.4 * Math.sin(time * 4);
    ctx.fillStyle = charging ? `rgba(50,230,160,${pulse})` : "#caa84a";
    ctx.beginPath();
    ctx.arc(34, 116, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dfeee8";
    ctx.font = "bold 20px 'Geist', system-ui, sans-serif";
    ctx.fillText(charging ? "CHARGING" : "SELF-TEST", 52, 124);

    // Battery bar.
    const bx = 24;
    const by = 150;
    const bw = w - 48;
    const bh = 30;
    ctx.strokeStyle = "#244035";
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = PRIMARY;
    ctx.fillRect(bx + 3, by + 3, (bw - 6) * (pct / 100), bh - 6);

    // Big percentage.
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 76px 'Geist', system-ui, sans-serif";
    ctx.fillText(`${pct}`, 24, 270);
    ctx.font = "bold 30px 'Geist', system-ui, sans-serif";
    ctx.fillStyle = "#5b7d72";
    ctx.fillText("%", 24 + ctx.measureText(`${pct}`).width + 6, 270);

    // kW + session readouts.
    const kw = charging ? (148 + Math.sin(time * 3) * 4).toFixed(0) : "0";
    ctx.fillStyle = "#9fc6ba";
    ctx.font = "20px 'Geist', system-ui, sans-serif";
    ctx.fillText(`${kw} kW`, 24, 312);
    ctx.fillText(charging ? "12 min left" : "running checks", 24, 342);

    ctx.globalAlpha = 1;
    screenTex.needsUpdate = true;
  }

  // -- Timeline state ------------------------------------------------------
  let current = 0; // master t, animated toward target
  let target = 0;
  let playing = false;
  const MAX_T = STAGES.length; // 6

  const api: SceneApi = {
    setTarget: (v) => {
      target = Math.max(0, Math.min(MAX_T, v));
      playing = false;
    },
    setPlaying: (v) => {
      playing = v;
      if (v && current >= MAX_T - 0.001) {
        current = 0;
        target = 0;
      }
    },
    getTarget: () => target,
  };

  // -- Main loop -----------------------------------------------------------
  const clock = new THREE.Clock();
  let raf = 0;
  let lastEmit = -1;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    if (playing) {
      current += dt * 0.62; // ~10s for the full build
      if (current >= MAX_T) {
        current = MAX_T;
        playing = false;
      }
      target = current;
    } else {
      current += (target - current) * Math.min(1, dt * 4);
      if (Math.abs(target - current) < 0.0006) current = target;
    }

    for (const p of parts) p.update(current, dt, time);
    updateLive(current, time);

    // Re-enable gentle idle orbit a few seconds after the user lets go.
    if (!controls.autoRotate && performance.now() - lastInteract > 3500) {
      controls.autoRotate = true;
    }
    controls.update();
    composer.render();

    if (Math.abs(current - lastEmit) > 0.004 || playing) {
      lastEmit = current;
      onTick(current, playing);
    }
  }
  frame();

  // -- Resize --------------------------------------------------------------
  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // -- Dispose -------------------------------------------------------------
  const dispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    controls.dispose();
    composer.dispose();
    renderer.dispose();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = (mesh as THREE.Mesh).material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) (mat as THREE.Material).dispose();
    });
    screenTex.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { api, dispose };
}

// Fade a whole group by writing opacity onto every material. `extra` lets us
// also touch materials that aren't reached by traversal (shared refs).
function setGroupOpacity(
  group: THREE.Object3D,
  opacity: number,
  extra?: THREE.Material[],
) {
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const mat = mesh.material;
    if (!mat) return;
    const apply = (m: THREE.Material) => {
      m.transparent = true;
      m.opacity = opacity;
    };
    if (Array.isArray(mat)) mat.forEach(apply);
    else apply(mat);
  });
  extra?.forEach((m) => {
    m.transparent = true;
    m.opacity = opacity;
  });
}

// Radial studio backdrop baked to a texture.
function makeBackdrop(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 360, 80, 512, 512, 760);
  g.addColorStop(0, "#16203a");
  g.addColorStop(0.45, "#0a0f1c");
  g.addColorStop(1, "#04060b");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// React page: hosts the canvas and the control overlay.
// ---------------------------------------------------------------------------

export default function EvChargerBuild() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<SceneApi | null>(null);

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { api, dispose } = buildScene(mount, (tt, p) => {
      setT(tt);
      setPlaying(p);
    });
    apiRef.current = api;

    return () => {
      apiRef.current = null;
      dispose();
    };
  }, []);

  const stageIndex = Math.min(STAGES.length - 1, Math.max(0, Math.floor(t)));
  const stage = STAGES[stageIndex];
  const progress = t / STAGES.length;

  // Closeout photos pop in as t scrubs through the final stage.
  const photosShown = useMemo(() => {
    if (t < 5) return 0;
    return Math.min(CLOSEOUT_PHOTOS.length, Math.floor(win(t, 5, 6) * CLOSEOUT_PHOTOS.length) + 1);
  }, [t]);

  // White camera flash whenever a new photo is captured.
  const [flash, setFlash] = useState(false);
  const prevPhotos = useRef(0);
  useEffect(() => {
    if (photosShown > prevPhotos.current && photosShown > 0) {
      setFlash(true);
      const id = window.setTimeout(() => setFlash(false), 220);
      prevPhotos.current = photosShown;
      return () => window.clearTimeout(id);
    }
    prevPhotos.current = photosShown;
  }, [photosShown]);

  const goStage = (i: number) => apiRef.current?.setTarget(i + 0.85);
  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    apiRef.current?.setPlaying(next);
  };
  const replay = () => {
    apiRef.current?.setTarget(0);
    window.setTimeout(() => apiRef.current?.setPlaying(true), 60);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#04060b] font-['Geist',system-ui,sans-serif] text-white">
      <div ref={mountRef} className="absolute inset-0" />

      {/* Camera flash for closeout photos */}
      <div
        className="pointer-events-none absolute inset-0 bg-white transition-opacity duration-150"
        style={{ opacity: flash ? 0.7 : 0 }}
      />

      {/* Top-left title */}
      <div className="pointer-events-none absolute left-6 top-6 max-w-sm sm:left-8 sm:top-8">
        <div className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-white/50">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: PRIMARY }} />
          ORIN LABS · FIELD BUILD
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Building an EV charger
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-white/55">
          Pedestal to closeout, the full install — assembled live in 3D. Drag to
          orbit, scroll to zoom, or scrub the timeline.
        </p>
      </div>

      {/* Closeout photo strip (top-right) */}
      {photosShown > 0 && (
        <div
          className="absolute right-6 top-6 w-44 rounded-xl border border-white/20 bg-neutral-900/85 p-3 shadow-2xl ring-1 ring-black/40 backdrop-blur-md sm:right-8 sm:top-8"
        >
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-white/70">
            <span>Closeout</span>
            <span style={{ color: "#34e6a0" }}>
              {photosShown}/{CLOSEOUT_PHOTOS.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CLOSEOUT_PHOTOS.slice(0, photosShown).map((label) => (
              <div
                key={label}
                className="animate-[fadeIn_0.25s_ease] rounded-md border border-white/15 bg-white/[0.14] p-1.5"
              >
                <div
                  className="mb-1 flex h-9 items-center justify-center rounded-sm text-sm font-bold text-white"
                  style={{ background: "rgba(0,160,113,0.6)" }}
                >
                  ✓
                </div>
                <div className="truncate text-[9px] font-medium leading-tight text-white/80">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom control deck */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-4xl px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md sm:p-5">
            {/* Current stage label */}
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Step {stageIndex + 1} of {STAGES.length}
                </div>
                <div className="text-lg font-semibold leading-tight">
                  {stage.title}
                </div>
                <div className="text-sm text-white/55">{stage.detail}</div>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <button
                  onClick={replay}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Replay
                </button>
                <button
                  onClick={togglePlay}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                  style={{ background: PRIMARY }}
                >
                  {playing ? "Pause" : "Play"}
                </button>
              </div>
            </div>

            {/* Scrubber */}
            <input
              type="range"
              min={0}
              max={STAGES.length}
              step={0.001}
              value={t}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPlaying(false);
                apiRef.current?.setTarget(v);
              }}
              className="ev-scrubber w-full"
              style={{
                background: `linear-gradient(to right, ${PRIMARY} ${progress * 100}%, rgba(255,255,255,0.12) ${progress * 100}%)`,
              }}
            />

            {/* Stage chips */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {STAGES.map((s, i) => {
                const active = i === stageIndex;
                const done = i < stageIndex;
                return (
                  <button
                    key={s.title}
                    onClick={() => goStage(i)}
                    className="group flex flex-col items-start gap-1 rounded-lg border px-2.5 py-2 text-left transition"
                    style={{
                      borderColor: active
                        ? PRIMARY
                        : "rgba(255,255,255,0.08)",
                      background: active
                        ? "rgba(0,160,113,0.14)"
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: done || active ? PRIMARY : "rgba(255,255,255,0.4)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[11px] font-medium leading-tight"
                      style={{ color: active ? "#fff" : "rgba(255,255,255,0.6)" }}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile play controls */}
            <div className="mt-3 flex gap-2 sm:hidden">
              <button
                onClick={replay}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/80"
              >
                Replay
              </button>
              <button
                onClick={togglePlay}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-black"
                style={{ background: PRIMARY }}
              >
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .ev-scrubber { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 9999px; outline: none; cursor: pointer; }
        .ev-scrubber::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 9999px; background: #fff; border: 3px solid ${PRIMARY}; cursor: pointer; box-shadow: 0 0 0 4px rgba(0,160,113,0.18); }
        .ev-scrubber::-moz-range-thumb { width: 16px; height: 16px; border-radius: 9999px; background: #fff; border: 3px solid ${PRIMARY}; cursor: pointer; }
      `}</style>
    </div>
  );
}
