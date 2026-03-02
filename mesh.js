import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

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
const geometry = new THREE.BoxGeometry( 2, 2, 2,100,100 );
const material = new THREE.MeshStandardMaterial( { 
  map: colorMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  aoMap: aoMap,
  metalness: 0.0,
  roughness: 0.8,
  displacementMap: heightMap,
  displacementScale: 0.01,
  color: 0xcccccc // Fallback color
} );
const sphere = new THREE.Mesh( geometry, material );
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add( sphere );

// GUI Setup
const gui = new GUI();

// Material Settings
const materialFolder = gui.addFolder('Material Settings');
materialFolder.addColor(material, 'color').name('Color');
materialFolder.add(material, 'metalness', 0, 1, 0.01).name('Metalness');
materialFolder.add(material, 'roughness', 0, 1, 0.01).name('Roughness');
materialFolder.add(material, 'displacementScale', 0, 0.1, 0.001).name('Displacement Scale');
materialFolder.add(material, 'normalScale', { x: 0, y: 0 }, -2, 2, 0.1).name('Normal Scale');
materialFolder.open();

// Mesh Settings
const meshFolder = gui.addFolder('Mesh Settings');
meshFolder.add(sphere.scale, 'x', 0.1, 5, 0.1).name('Scale X');
meshFolder.add(sphere.scale, 'y', 0.1, 5, 0.1).name('Scale Y');
meshFolder.add(sphere.scale, 'z', 0.1, 5, 0.1).name('Scale Z');
meshFolder.add(sphere.rotation, 'x', 0, Math.PI * 2, 0.01).name('Rotation X');
meshFolder.add(sphere.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation Y');
meshFolder.add(sphere.rotation, 'z', 0, Math.PI * 2, 0.01).name('Rotation Z');
meshFolder.add(sphere.position, 'x', -5, 5, 0.1).name('Position X');
meshFolder.add(sphere.position, 'y', -5, 5, 0.1).name('Position Y');
meshFolder.add(sphere.position, 'z', -5, 5, 0.1).name('Position Z');
meshFolder.open();

// Texture Settings
const textureFolder = gui.addFolder('Texture Settings');
const textureSettings = {
  repeatX: 1,
  repeatY: 1,
  colorMapIntensity: 1,
  normalMapIntensity: 1,
  roughnessMapIntensity: 1,
  aoMapIntensity: 1,
  heightMapIntensity: 1
};

textureFolder.add(textureSettings, 'repeatX', 0.1, 10, 0.1).name('Repeat X').onChange(() => {
  [colorMap, normalMap, roughnessMap, aoMap, heightMap].forEach(texture => {
    texture.repeat.x = textureSettings.repeatX;
    texture.needsUpdate = true;
  });
});

textureFolder.add(textureSettings, 'repeatY', 0.1, 10, 0.1).name('Repeat Y').onChange(() => {
  [colorMap, normalMap, roughnessMap, aoMap, heightMap].forEach(texture => {
    texture.repeat.y = textureSettings.repeatY;
    texture.needsUpdate = true;
  });
});

textureFolder.add(textureSettings, 'colorMapIntensity', 0, 2, 0.1).name('Color Map Intensity').onChange(() => {
  material.color.setHex(0xcccccc).multiplyScalar(textureSettings.colorMapIntensity);
});

textureFolder.add(textureSettings, 'normalMapIntensity', 0, 2, 0.1).name('Normal Map Intensity').onChange(() => {
  material.normalScale.set(textureSettings.normalMapIntensity, textureSettings.normalMapIntensity);
});

textureFolder.add(textureSettings, 'roughnessMapIntensity', 0, 2, 0.1).name('Roughness Map Intensity').onChange(() => {
  material.roughness = 0.8 * textureSettings.roughnessMapIntensity;
});

textureFolder.add(textureSettings, 'aoMapIntensity', 0, 2, 0.1).name('AO Map Intensity').onChange(() => {
  material.aoMapIntensity = textureSettings.aoMapIntensity;
});

textureFolder.add(textureSettings, 'heightMapIntensity', 0, 0.1, 0.001).name('Height Map Intensity').onChange(() => {
  material.displacementScale = textureSettings.heightMapIntensity;
});

textureFolder.open();

// Geometry Settings
const geometryFolder = gui.addFolder('Geometry Settings');
const geometrySettings = {
  width: 2,
  height: 2,
  depth: 2,
  widthSegments: 100,
  heightSegments: 100,
  depthSegments: 1
};

geometryFolder.add(geometrySettings, 'width', 0.1, 5, 0.1).name('Width').onChange(updateGeometry);
geometryFolder.add(geometrySettings, 'height', 0.1, 5, 0.1).name('Height').onChange(updateGeometry);
geometryFolder.add(geometrySettings, 'depth', 0.1, 5, 0.1).name('Depth').onChange(updateGeometry);
geometryFolder.add(geometrySettings, 'widthSegments', 1, 200, 1).name('Width Segments').onChange(updateGeometry);
geometryFolder.add(geometrySettings, 'heightSegments', 1, 200, 1).name('Height Segments').onChange(updateGeometry);
geometryFolder.add(geometrySettings, 'depthSegments', 1, 200, 1).name('Depth Segments').onChange(updateGeometry);

function updateGeometry() {
  const newGeometry = new THREE.BoxGeometry(
    geometrySettings.width,
    geometrySettings.height,
    geometrySettings.depth,
    geometrySettings.widthSegments,
    geometrySettings.heightSegments,
    geometrySettings.depthSegments
  );
  sphere.geometry.dispose();
  sphere.geometry = newGeometry;
}

geometryFolder.open();

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
