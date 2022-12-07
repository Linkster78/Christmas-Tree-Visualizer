import {
    Box3,
    Camera,
    Color, Frustum, Matrix4,
    Mesh,
    MeshBasicMaterial, Object3D,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer
} from "three";
import {BloomEffect, EffectComposer, EffectPass, RenderPass} from "postprocessing";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {StaticColorAnimator} from "./effects/color_static";
import {ResizeOperation} from "./extensions/array_extensions";

const LIGHT_OFF_COLOR = new Color(0x101010);
const LIGHT_ON_DELTA = new Color(0xFFFFFF).sub(LIGHT_OFF_COLOR);
const OFF_ANIMATOR = new StaticColorAnimator({color: 0});

export type AnimatorContext = {
    timeMillis: number
    deltaTimeMillis: number,
    lightCount: number,
    hasLightCountChanged: boolean,
    boundingBox: Box3,
    hasBoundingBoxChanged : boolean
};

export interface LightAnimator {
    prepareUpdate(context: Readonly<AnimatorContext>) : void;
    colorLight(context: Readonly<AnimatorContext>, lightIndex: number, lightPosition: Vector3) : Color;
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

    getPosition() : Vector3 {
        return this.mesh.position;
    }

    getNode() : Object3D {
        return this.mesh;
    }

    isVisible() : boolean {
        return this.mesh.visible;
    }
}

export class TreeVisualizationApp {
    private treeHeight: number;
    private treeRadius: number;
    private renderer!: WebGLRenderer;
    private composer!: EffectComposer;
    private camera!: Camera;
    private controls!: OrbitControls;
    private scene!: Scene;

    private lights: TreeLight[] = [];
    private animator: LightAnimator = OFF_ANIMATOR;
    private lastTimeMillis: number = Date.now();
    private hasLightCountChanged: boolean = false;
    private boundingBox: Box3 = new Box3();
    private hasBoundingBoxChanged: boolean = false;

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
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);
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

    public setupLights(count: number) {
        if(this.lights.length != count) {
            this.hasLightCountChanged = true;
            this.hasBoundingBoxChanged = true;
        }

        let resizeResult = this.lights.resize(count, () => this.createLight());
        if(resizeResult.operation == ResizeOperation.Shrunk) {
            resizeResult.delta.forEach(tl => tl.removeFromScene(this.scene));
        } else if(resizeResult.operation == ResizeOperation.Expanded) {
            resizeResult.delta.forEach(tl => tl.addToScene(this.scene));
        }

        this.boundingBox.setFromPoints(this.lights.map(tl => tl.getPosition()));
    }

    private createLight(): TreeLight {
        const heightPercent = Math.pow(Math.random(), 2);
        const angle = Math.random() * 2 * Math.PI;
        const radiusDistance = Math.sqrt(Math.random());
        const position = new Vector3(
            Math.cos(angle) * radiusDistance * this.treeRadius * (1-heightPercent),
            heightPercent * this.treeHeight,
            Math.sin(angle) * radiusDistance * this.treeRadius * (1-heightPercent));

        const light = new TreeLight(position, 0.04);
        return light;
    }

    update() {
        let timeMillis = Date.now();

        let animatorContext = {
            timeMillis,
            deltaTimeMillis: timeMillis - this.lastTimeMillis,
            lightCount: this.lights.length,
            hasLightCountChanged: this.hasLightCountChanged,
            boundingBox: this.boundingBox.clone(),
            hasBoundingBoxChanged: this.hasBoundingBoxChanged
        };

        this.lastTimeMillis = timeMillis;
        this.hasLightCountChanged = false;
        this.hasBoundingBoxChanged = false;

        let frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

        this.animator.prepareUpdate(animatorContext);
        for(let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            if(frustum.containsPoint(light.getPosition()) || frustum.intersectsObject(light.getNode())) {
                light.setColor(this.animator.colorLight(animatorContext, i, light.getPosition()));
            }
        }

        this.controls.update();
    }

    render() {
        this.composer.render();
    }

    setAnimator(animator: LightAnimator | undefined) {
        this.animator = animator ?? OFF_ANIMATOR;
        // Resends light count change to the new animator
        this.hasLightCountChanged = true;
    }

    setTreeRadius(radius: number) {
        let transformationVector = new Vector3(radius / this.treeRadius, 1, radius / this.treeRadius);

        this.boundingBox.min.multiply(transformationVector);
        this.boundingBox.max.multiply(transformationVector);

        for(let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            light.getPosition().multiply(transformationVector);
        }

        this.hasBoundingBoxChanged = true;
        this.treeRadius = radius;
    }

    setTreeHeight(height: number) {
        let transformationVector = new Vector3(1, height / this.treeHeight, 1);

        this.boundingBox.min.multiply(transformationVector);
        this.boundingBox.max.multiply(transformationVector);

        for(let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            light.getPosition().multiply(transformationVector);
        }

        this.hasBoundingBoxChanged = true;
        this.treeHeight = height;
    }
}