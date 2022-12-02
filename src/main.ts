import './style.css';
import {TreeVisualizationApp} from "./app";
import {BlinkingStarsAnimator} from "./effects/blinking_stars";
import GUI from "lil-gui";

const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

const settings = {
    lightCount: 400
};

const app = new TreeVisualizationApp(TREE_HEIGHT, TREE_RADIUS, settings.lightCount);
app.setAnimator(new BlinkingStarsAnimator());

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