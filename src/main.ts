import './style.css';
import {TreeVisualizationApp} from "./app";
import GUI from "lil-gui";
import {Vector3} from "three";
import {WaveColorAnimator} from "./effects/color_wave";

const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

const settings = {
    lightCount: 400
};

const app = new TreeVisualizationApp(TREE_HEIGHT, TREE_RADIUS, settings.lightCount);
app.setAnimator(new WaveColorAnimator(['blue', 'red'], new Vector3(0, 1, 0), 2500, 1, false));

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();

const gui = new GUI();
gui.add(settings, 'lightCount', 10, 1000, 1)
    .name('Light Count')
    .onChange((value: number) => app.setupLights(value));