import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import WebGL from "three/addons/capabilities/WebGL.js";

// Check if WebGL is available
if (WebGL.isWebGLAvailable()) {
  let container, camera, scene, renderer, effect, object;

  init();
  animate();

  function init() {
    // Set the dimensions of the container
    const width = 500;
    const height = 500;

    // Create and append the container div
    container = document.createElement("div");
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    document.body.appendChild(container);

    // Camera
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 2;

    // Scene
    scene = new THREE.Scene();

    // Lights
    const light1 = new THREE.PointLight(0xffffff);
    light1.position.set(500, 500, 500);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 0.25);
    light2.position.set(-500, -500, -500);
    scene.add(light2);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1); // Set clear color to white with full opacity

    // ASCII Effect
    const asciiCharacters = " .:-=+*#%@"; // More intricate set of characters
    effect = new AsciiEffect(renderer, asciiCharacters, {
      invert: false,
      resolution: 0.25,
    });
    effect.setSize(width, height);
    effect.domElement.style.color = "black";
    effect.domElement.style.backgroundColor = "white"; // Set background to white
    container.appendChild(effect.domElement);

    // Set styles to control full-page coverage issue
    effect.domElement.style.position = "relative";
    effect.domElement.style.width = "100%";
    effect.domElement.style.height = "100%";

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      "./scene.gltf",
      function (gltf) {
        console.log("GLTF loaded successfully");
        object = gltf.scene;
        object.rotation.x = Math.PI / 12; // Slightly tilt back the object
        scene.add(object);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("An error happened while loading the GLTF model:", error);
      }
    );

    // Resize event
    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    const width = 500;
    const height = 500;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (object) {
      // Rotate the object
      object.rotation.y += 0.01; // Adjust the speed as necessary
    }

    effect.render(scene, camera);
  }
} else {
  // If WebGL is not available, show an error message
  const warning = WebGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}
