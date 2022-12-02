import './style.css';
import {TreeVisualizationApp} from "./app";
import {BlinkingStarsAnimator} from "./effects/blinking_stars";

const LIGHT_COUNT = 400;
const TREE_RADIUS = 1.8;
const TREE_HEIGHT = 4;

const app = new TreeVisualizationApp(TREE_HEIGHT, TREE_RADIUS, LIGHT_COUNT);
app.setAnimator(new BlinkingStarsAnimator());

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();