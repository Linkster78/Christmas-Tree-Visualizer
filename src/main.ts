import './style.css';
import {TreeVisualizationApp} from "./app";
import GUI from "lil-gui";
import {Vector3} from "three";
import {WaveColorAnimator, WaveType} from "./effects/color_wave";

const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

const settings = {
    lightCount: 400,
    treeRadius: 1.8,
    treeHeight: 4
};

const app = new TreeVisualizationApp(TREE_HEIGHT, TREE_RADIUS, settings.lightCount);
app.setAnimator(new WaveColorAnimator(['blue', 'red', 'green'], new Vector3(0, 1, 0), 2500, 1, WaveType.SOFT_SEPARATED));

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();

const gui = new GUI();

const generalFolder = gui.addFolder('General Settings');
generalFolder.add(settings, 'lightCount', 10, 4000, 1)
    .name('Light Count')
    .onChange((value: number) => app.setupLights(value));
generalFolder.add(settings, 'treeRadius', 1, 10)
    .name('Tree Radius')
    .onChange((value: number) => app.setTreeRadius(value));
generalFolder.add(settings, 'treeHeight', 2, 20)
    .name('Tree Height')
    .onChange((value: number) => app.setTreeHeight(value));