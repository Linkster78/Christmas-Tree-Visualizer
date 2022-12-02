import {
    Camera,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer
} from "three";
import {BloomEffect, EffectComposer, EffectPass, RenderPass} from "postprocessing";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {StaticColorAnimator} from "./effects/color_static";

const LIGHT_OFF_COLOR = new Color(0x101010);
const LIGHT_ON_DELTA = new Color(0xFFFFFF).sub(LIGHT_OFF_COLOR);

export type TimingInformation = {
    deltaTimeMillis: number,
    timeMillis: number
};

export interface LightAnimator {
    animate(timing: TimingInformation) : Color;
}

class TreeLight {
    private readonly mesh: Mesh;
    private lastColor?: Color;

    constructor(position: Vector3, radius: number) {
        const lightGeometry = new SphereGeometry(radius, 6, 4);
        const lightMaterial = new MeshBasicMaterial({color: LIGHT_OFF_COLOR});
        this.mesh = new Mesh(lightGeometry, lightMaterial);
        this.mesh.position.set(position.x, position.y, position.z);
    }

    setColor(color: Color) {
        if(this.lastColor == color) {
            return;
        }
        this.lastColor = color;

        let cappedColor = color.clone().multiply(LIGHT_ON_DELTA).add(LIGHT_OFF_COLOR);

        let material = this.mesh.material as MeshBasicMaterial;
        material.color = cappedColor;
    }

    addToScene(scene: Scene) {
        scene.add(this.mesh);
    }

    removeFromScene(scene: Scene) {
        scene.remove(this.mesh);
    }

    getPosition() : Readonly<Vector3> {
        return this.mesh.position;
    }
}

export class TreeVisualizationApp {
    private readonly treeHeight: number;
    private readonly treeRadius: number;
    private renderer!: WebGLRenderer;
    private composer!: EffectComposer;
    private camera!: Camera;
    private controls!: OrbitControls;
    private scene!: Scene;

    private lights: TreeLight[] = [];
    private animator: LightAnimator = new StaticColorAnimator(0);
    private lastTimeMillis: number = Date.now();

    constructor(treeHeight: number, treeRadius: number, initialLightCount: number) {
        this.treeHeight = treeHeight;
        this.treeRadius = treeRadius;

        this.setupRenderer();
        this.setupCamera();
        this.setupScene();
        this.setupLights(initialLightCount);
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
        this.camera.position.set(0, this.treeHeight / 2, 10);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new Vector3(0, this.treeHeight / 2, 0);
        this.controls.update();
    }

    private setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new EffectPass(this.camera, new BloomEffect({luminanceThreshold:0})));
    }

    private setupScene() {
        this.scene = new Scene();
    }

    private setupLights(count: number) {
        if(count > this.lights.length) {
            for(let i = 0; i < count - this.lights.length; i++) {
                this.addLight();
            }
        } else if(count < this.lights.length) {
            for(let i = 0; i < this.lights.length - count; i++) {
                let light = this.lights[this.lights.length - 1 - i];
                light.removeFromScene(this.scene);
                this.lights.pop();
            }
        }
    }

    private addLight() {
        const heightPercent = Math.pow(Math.random(), 2);
        const angle = Math.random() * 2 * Math.PI;
        const radiusDistance = Math.sqrt(Math.random());
        const position = new Vector3(
            Math.cos(angle) * radiusDistance * this.treeRadius * (1-heightPercent),
            heightPercent * this.treeHeight,
            Math.sin(angle) * radiusDistance * this.treeRadius * (1-heightPercent));

        const light = new TreeLight(position, 0.04);
        light.addToScene(this.scene);
        this.lights.push(light);
    }

    update() {
        let timeMillis = Date.now();
        let timing = {
            timeMillis,
            deltaTimeMillis: timeMillis - this.lastTimeMillis
        };
        this.lastTimeMillis = timeMillis;

        for(let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            light.setColor(this.animator.animate(timing));
        }

        this.controls.update();
    }

    render() {
        this.composer.render();
    }

    setAnimator(animator: LightAnimator) {
        this.animator = animator;
    }
}