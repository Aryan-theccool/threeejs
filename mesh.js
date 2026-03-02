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

// Geometry - Sphere
const geometry = new THREE.BoxGeometry( 2, 2, 2 );
const material = new THREE.MeshStandardMaterial( { color: "red" } );
const sphere = new THREE.Mesh( geometry, material );
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
