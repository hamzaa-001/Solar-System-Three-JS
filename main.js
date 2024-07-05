import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import stars from "./assets/stars bg.jpg";
import sunTexture from "./assets/sun.jpg";
import MercuryTexture from "./assets/Mercury.jpg";
import VenusTexture from "./assets/venus.jpg";
import EarthTexture from "./assets/earth.jpg";
import MarsTexture from "./assets/mars.jpg";
import JupiterTexture from "./assets/jupiter.jpg";
import SaturnTexture from "./assets/saturn.jpg";
import SaturnRingTexture from "./assets/saturn ring.png";
import UranusTexture from "./assets/uranus.jpg";
import UranusRingTexture from "./assets/uranus ring.png";
import NeptuneTexture from "./assets/neptune.jpg";
import PlutoTexture from "./assets/pluto.jpg";

const canvas = document.body.querySelector("canvas.webGL");
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Load the background texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

const textureLoader = new THREE.TextureLoader();

// Geometries
const sunGeo = new THREE.SphereGeometry(30, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const Mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, Mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.set(position, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

const Mercury = createPlanet(3.2, MercuryTexture, 50);
const Venus = createPlanet(4.8, VenusTexture, 74);
const Earth = createPlanet(6, EarthTexture, 95);
const Mars = createPlanet(5.8, MarsTexture, 113);
const Jupiter = createPlanet(12, JupiterTexture, 150);
const Saturn = createPlanet(10, SaturnTexture, 188, {
  innerRadius: 10,
  outerRadius: 25,
  texture: SaturnRingTexture,
});
const Uranus = createPlanet(10, UranusTexture, 236, {
  innerRadius: 5,
  outerRadius: 15,
  texture: UranusRingTexture,
});
const Neptune = createPlanet(7, NeptuneTexture, 260);
const Pluto = createPlanet(2.8, PlutoTexture, 276);

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.set(-90, 140, 180);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.update();

// Lights
const pointLight = new THREE.PointLight(0xffffff, 100000, 10000);
scene.add(pointLight);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const loop = () => {
  // On-Axis Rotation
  sun.rotateY(0.004);
  Mercury.mesh.rotateY(0.004);
  Venus.mesh.rotateY(0.002);
  Earth.mesh.rotateY(0.002);
  Mars.mesh.rotateY(0.018);
  Jupiter.mesh.rotateY(0.04);
  Saturn.mesh.rotateY(0.038);
  Uranus.mesh.rotateY(0.03);
  Neptune.mesh.rotateY(0.032);
  Pluto.mesh.rotateY(0.008);

  // Around Sun Rotation
  Mercury.obj.rotateY(0.04);
  Venus.obj.rotateY(0.015);
  Earth.obj.rotateY(0.01);
  Mars.obj.rotateY(0.0084);
  Jupiter.obj.rotateY(0.007);
  Saturn.obj.rotateY(0.005);
  Uranus.obj.rotateY(0.004);
  Neptune.obj.rotateY(0.003);
  Pluto.obj.rotateY(0.002);

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

loop();
