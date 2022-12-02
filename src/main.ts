import './style.css';
import {TreeVisualizationApp} from "./app";
import {BreathingColorAnimator} from "./effects/color_breathing";

const LIGHT_COUNT = 250;
const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

const app = new TreeVisualizationApp(TREE_HEIGHT, TREE_RADIUS, LIGHT_COUNT);
app.setAnimator(new BreathingColorAnimator(['orange', 'blue', 'cyan', 'red', 'white']));

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();