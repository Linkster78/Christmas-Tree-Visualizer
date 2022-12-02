import './style.css';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
    Camera,
    Color,
    ColorRepresentation,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer
} from "three";
import {BloomEffect, EffectComposer, EffectPass, RenderPass} from 'postprocessing';

const LIGHT_COUNT = 250;
const LIGHT_OFF_COLOR = 0x101010;
const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

class TreeLight {
    private readonly mesh: Mesh;

    constructor(position: Vector3, radius: number) {
        const lightGeometry = new SphereGeometry(radius, 6, 4);
        const lightMaterial = new MeshBasicMaterial({color: LIGHT_OFF_COLOR});
        this.mesh = new Mesh(lightGeometry, lightMaterial);
        this.mesh.position.set(position.x, position.y, position.z);
    }

    setColor(color: ColorRepresentation, intensity: number) {
        let newColor = new Color(LIGHT_OFF_COLOR).lerp(new Color(color), intensity);
        let material = this.mesh.material as MeshBasicMaterial;
        material.color = newColor;
    }

    addToScene(scene: Scene) {
        scene.add(this.mesh);
    }

    getPosition() : Readonly<Vector3> {
        return this.mesh.position;
    }
}

class TreeVisualizationApp {
    renderer!: WebGLRenderer;
    composer!: EffectComposer;
    camera!: Camera;
    controls!: OrbitControls;
    scene!: Scene;
    lights!: TreeLight[];

    constructor() {
        this.setupRenderer();
        this.setupCamera();
        this.setupScene();
        this.setupLights();
        this.setupPostProcessing();
    }

    private setupRenderer() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            antialias: false,
            stencil: false,
            depth: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    private setupCamera() {
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .5, 500);
        this.camera.position.set(0, TREE_HEIGHT / 2, 10);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new Vector3(0, TREE_HEIGHT / 2, 0);
        this.controls.update();
    }

    private setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new EffectPass(this.camera, new BloomEffect({luminanceThreshold:0.05})));
    }

    private setupScene() {
        this.scene = new Scene();
    }

    private setupLights() {
        this.lights = [];
        for(let i = 0; i < LIGHT_COUNT; i++) {
            const heightPercent = Math.pow(Math.random(), 2);
            const angle = Math.random() * 2 * Math.PI;
            const radiusDistance = Math.sqrt(Math.random());
            const position = new Vector3(
                Math.cos(angle) * radiusDistance * TREE_RADIUS * (1-heightPercent),
                heightPercent * TREE_HEIGHT,
                Math.sin(angle) * radiusDistance * TREE_RADIUS * (1-heightPercent));

            const light = new TreeLight(position, 0.04);
            light.addToScene(this.scene);
            this.lights.push(light);
        }
    }

    update() {
        this.controls.update();
    }

    render() {
        this.composer.render();
    }
}

const app = new TreeVisualizationApp();

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();