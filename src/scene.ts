import { Project, Scene3D, PhysicsLoader, THREE, ExtendedMesh, ExtendedObject3D } from "enable3d";
import { Tween, Easing, update as updateTween } from "@tweenjs/tween.js";

class MainScene extends Scene3D {
  character: ExtendedObject3D = new ExtendedObject3D(); // reference to the green sphere
  isJumping: boolean = false;
  constructor() {
    //@ts-ignore
    super("MainScene");
  }

  init() {
    console.log("Init");
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  preload() {
    console.log("Preload");
  }

  create() {
    console.log("create");

    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    };

    window.onresize = resize;
    resize();

    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed();

    // enable physics debug
    this.physics.debug?.enable();

    // position camera
    this.camera.position.set(0, 10, 20);

    // Character
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32); // Parameters: radius, widthSegments, heightSegments
    const characterMesh = new ExtendedMesh(headGeometry, headMaterial);
    this.character.add(characterMesh);
    this.character.position.set(0,1,0);
    this.scene.add(this.character);

    // BOX
    const box = new ExtendedObject3D();
    box.position.set(3, 1, 0); // Adjust coordinates to place the box beside the character
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // Adjust dimensions as needed
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Adjust color as needed
    const boxMesh = new ExtendedMesh(boxGeometry, boxMaterial); 
    box.add(boxMesh);
    box.position.set(0, 0, 0);
    this.scene.add(box);
    const boxOptions = { shape: "box", width: 1, height: 1, depth: 1 }; // Adjust dimensions to match boxGeometry
    
    this.physics.add.existing(box, boxOptions);
    // Add keyboard controls
    this.addKeyboardControls();
  }

  update() {
    updateTween();
  }

  addKeyboardControls() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(event: KeyboardEvent) {
    const moveDistance = 1; // distance to move the sphere
    const jumpHeight = 3; // height to jump
    const jumpDuration = 250; // duration of the jump animation in milliseconds
    console.log(event.key.toString())
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
        this.character.position.z -= moveDistance;
        // run animation
        console.log('ArrowUp pressed');
        break;
      case 'ArrowDown':
      case 's':
        this.character.position.z += moveDistance;
        console.log('ArrowDown pressed');
        break;
      case 'ArrowLeft':
      case 'a':
        this.character.position.x -= moveDistance;
        console.log('ArrowLeft pressed');
        break;
      case 'ArrowRight':
      case 'd':
        this.character.position.x += moveDistance;
        console.log('ArrowRight pressed');
        break;
      case ' ': // Handle spacebar press for jump
       event.preventDefault();
        if (!this.isJumping) {
          this.isJumping = true;
          const initialY = this.character.position.y;
          const targetY = initialY + jumpHeight;

          // Use Tween.js to animate the jump
          new Tween(this.character.position)
            .to({ y: targetY }, jumpDuration)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {
              // Jump animation complete, now animate back down
              new Tween(this.character.position)
                .to({ y: initialY }, jumpDuration)
                .easing(Easing.Quadratic.In)
                .onComplete(() => {
                  this.isJumping = false; // Reset jumping flag
                })
                .start();
            })
            .start();
        }
        console.log('Spacebar pressed');
        break;
      default:
        break;
    }
  }
}

PhysicsLoader(
  "lib/ammo/kripken",
  () => new Project({ scenes: [MainScene], antialias: true })
);