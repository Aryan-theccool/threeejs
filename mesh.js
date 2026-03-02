import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

// Renderer 
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Load PBR Textures
const colorMap = textureLoader.load('paper_0025_color_1k.jpg');
const normalMap = textureLoader.load('paper_0025_normal_opengl_1k.png');
const roughnessMap = textureLoader.load('paper_0025_roughness_1k.jpg');
const aoMap = textureLoader.load('paper_0025_ao_1k.jpg');
const heightMap = textureLoader.load('paper_0025_height_1k.png');

// Set texture repeat and wrapping
[colorMap, normalMap, roughnessMap, aoMap, heightMap].forEach(texture => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
});

// Studio Lighting Setup
// Key Light - Main directional light
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
scene.add(keyLight);

// High Intensity Directional Light
const highIntensityLight = new THREE.DirectionalLight(0xffffff, 3.0);
highIntensityLight.position.set(10, 10, 5);
highIntensityLight.castShadow = true;
scene.add(highIntensityLight);

// Fill Light - Softer light to reduce shadows
const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
fillLight.position.set(-5, 0, 2);
scene.add(fillLight);

// Rim Light - Back light for edge highlights
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(0, -5, -5);
scene.add(rimLight);

// Ambient Light - Base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Light Helpers
const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 2);
scene.add(keyLightHelper);

const highIntensityLightHelper = new THREE.DirectionalLightHelper(highIntensityLight, 3);
scene.add(highIntensityLightHelper);

const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 1.5);
scene.add(fillLightHelper);

const rimLightHelper = new THREE.DirectionalLightHelper(rimLight, 2);
scene.add(rimLightHelper);

// Geometry - Cardboard Box
const geometry = new THREE.BoxGeometry( 2, 2, 2 );
const material = new THREE.MeshStandardMaterial( { 
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  aoMap: aoMap,
  metalness: 0.0,
  roughness: 0.8,
  color: 0xcccccc // Fallback color
} );
const sphere = new THREE.Mesh( geometry, material );
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add( sphere );

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
