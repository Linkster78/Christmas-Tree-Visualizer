import './style.css';
import {TreeVisualizationApp} from "./app";
import {StaticColorAnimator, StaticColorAnimatorParameters} from "./effects/color_static";
import {MixedColorAnimator, MixedColorAnimatorParameters} from "./effects/color_mixed";
import {Color, Vector3} from "three";
import {GradientColorAnimator, GradientColorAnimatorParameters} from "./effects/color_gradient";
import {WaveColorAnimator, WaveColorAnimatorParameters, WaveType} from "./effects/color_wave";
import {BreathingColorAnimator, BreathingColorAnimatorParameters} from "./effects/color_breathing";
import {ShiftingColorAnimator, ShiftingColorAnimatorParameters} from "./effects/color_shift";
import {BlinkingStarAnimatorParameters, BlinkingStarsAnimator} from "./effects/blinking_stars";
import {Pane} from "tweakpane";

enum AnimatorType {
    None,
    StaticColor,
    MixedColor,
    GradientColor,
    BreathingColor,
    ShiftingColor,
    WaveColor,
    BlinkingStars,
};

const settings = {
    lightCount: 400,
    treeRadius: 1.8,
    treeHeight: 4,
    animatorType: AnimatorType.None
};

const app = new TreeVisualizationApp(settings.treeHeight, settings.treeRadius, settings.lightCount);

function doFrame() {
    requestAnimationFrame(doFrame);
    app.update();
    app.render();
}
doFrame();

const pane = new Pane({
    title: 'Controls'
});

pane.addInput(settings, 'lightCount', { min: 10, max: 4000, step: 1, label: 'Light Count' })
    .on('change', ev => app.setupLights(ev.value));
pane.addInput(settings, 'treeRadius', { min: 1, max: 10, label: 'Tree Radius' })
    .on('change', ev => app.setTreeRadius(ev.value));
pane.addInput(settings, 'treeHeight', { min: 2, max: 20, label: 'Tree Height'})
    .on('change', ev => app.setTreeHeight(ev.value));

// generalFolder.add(settings, 'animatorType',
//     {
//         'None': AnimatorType.None,
//         'Static Color': AnimatorType.StaticColor,
//         'Mixed Color': AnimatorType.MixedColor,
//         'Color Gradient': AnimatorType.GradientColor,
//         'Breathing Colors': AnimatorType.BreathingColor,
//         'Shifting Colors': AnimatorType.ShiftingColor,
//         'Color Waves': AnimatorType.WaveColor,
//         'Blinking Stars': AnimatorType.BlinkingStars
//     })
//     .name('Animator Type')
//     .onChange((type: AnimatorType) => {
//         animators.forEach(folder => folder.hide());
//         switch(type) {
//             case AnimatorType.None:
//                 app.setAnimator(undefined);
//                 break;
//             case AnimatorType.StaticColor:
//                 staticColorFolder._onChange();
//                 staticColorFolder.show();
//                 break;
//             case AnimatorType.MixedColor:
//                 mixedColorFolder._onChange();
//                 mixedColorFolder.show();
//                 break;
//             case AnimatorType.GradientColor:
//                 gradientColorFolder._onChange();
//                 gradientColorFolder.show();
//                 break;
//             case AnimatorType.BreathingColor:
//                 breathingColorFolder._onChange();
//                 breathingColorFolder.show();
//                 break;
//             case AnimatorType.ShiftingColor:
//                 shiftingColorFolder._onChange();
//                 shiftingColorFolder.show();
//                 break;
//             case AnimatorType.WaveColor:
//                 waveColorFolder._onChange();
//                 waveColorFolder.show();
//                 break;
//             case AnimatorType.BlinkingStars:
//                 blinkingStarsFolder._onChange();
//                 blinkingStarsFolder.show();
//                 break;
//         }
//     });
//
// const staticColorParameters = { color: '#0FF' } as StaticColorAnimatorParameters;
// const staticColorFolder = gui.addFolder('Static Color')
//     .onChange(() => app.setAnimator(new StaticColorAnimator(staticColorParameters)));
// staticColorFolder.addColor(staticColorParameters, 'color').name('Color');
//
// const mixedColorParameters = {
//     colors: ['#F00', '#0F0', '#00F'],
//     addColor: function() {
//         this.colors.push(new Color('white'));
//         mixedColorFolder.addColor(mixedColorParameters, 'colors[2]');
//     }
// } as MixedColorAnimatorParameters;
// const mixedColorFolder = gui.addFolder('Mixed Color')
//     .onChange(() => app.setAnimator(new MixedColorAnimator(mixedColorParameters)));
// mixedColorFolder.add(mixedColorParameters, 'addColor');
//
// const gradientColorParameters = { colors: ['#F00', '#00F'], direction: new Vector3(0, 1, 0) } as GradientColorAnimatorParameters;
// const gradientColorFolder = gui.addFolder('Color Gradient')
//     .onChange(() => app.setAnimator(new GradientColorAnimator(gradientColorParameters)));
//
// const breathingColorParameters = { colors: ['#F00', '#FFA500', '#FF0'], cycleLengthMillis: 4000 } as BreathingColorAnimatorParameters;
// const breathingColorFolder = gui.addFolder('Breathing Colors')
//     .onChange(() => app.setAnimator(new BreathingColorAnimator(breathingColorParameters)));
//
// const shiftingColorParameters = { colors: ['#F00', '#0F0', '#00F', '#0FF'], cycleLengthMillis: 4000 } as ShiftingColorAnimatorParameters;
// const shiftingColorFolder = gui.addFolder('Shifting Colors')
//     .onChange(() => app.setAnimator(new ShiftingColorAnimator(shiftingColorParameters)));
//
// const waveColorParameters = { colors: ['#F00', '#FFA500'], direction: new Vector3(0, 1, 0), cycleLengthMillis: 2000, scale: 1, waveType: WaveType.SMOOTH } as WaveColorAnimatorParameters;
// const waveColorFolder = gui.addFolder('Color Waves')
//     .onChange(() => app.setAnimator(new WaveColorAnimator(waveColorParameters)));
//
// const blinkingStarsParameters = { colors: ['#FFF'], starPercentage: 0.2, lightInterval: 80 } as BlinkingStarAnimatorParameters;
// const blinkingStarsFolder = gui.addFolder('Blinking Stars')
//     .onChange(() => app.setAnimator(new BlinkingStarsAnimator(blinkingStarsParameters)));
//
// animators.push(staticColorFolder, mixedColorFolder, gradientColorFolder,
//     breathingColorFolder, shiftingColorFolder, waveColorFolder, blinkingStarsFolder);
// animators.forEach(folder => folder.hide());