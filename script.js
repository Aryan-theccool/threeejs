import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// const canvas = document.querySelector('canvas');
// const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild( renderer.domElement );

// function animate( time ) {
//   renderer.render( scene, camera );
//   cube.rotation.x = time / 2000;
//   cube.rotation.y = time / 1000; 
// }
// renderer.setAnimationLoop( animate );
let scene = new THREE.Scene();

// FIXED: correct window.innerWidth syntax
let camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// Move camera back
camera.position.z = 5;

// Geometry
let box = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let mesh = new THREE.Mesh(box, material);

// Keep cube at center (default is 0,0,0)
scene.add(mesh);

// Renderer 
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
// Animation loop
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();