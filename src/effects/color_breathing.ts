import {LightAnimator, LightCountInformation, PositioningInformation, TimingInformation} from "../app";
import {Color, ColorRepresentation} from "three";

export class BreathingColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly cycleLengthMillis: number;

    constructor(colors: [ColorRepresentation, ...ColorRepresentation[]], cycleLengthMillis: number = 4000) {
        this.colors = colors.map(cr => new Color(cr));
        this.cycleLengthMillis = cycleLengthMillis;
    }

    prepareUpdate(_timing: Readonly<TimingInformation>, _lightInformation: Readonly<LightCountInformation>) {}

    colorLight(timing: Readonly<TimingInformation>, _lightIndex: number, _positioning: Readonly<PositioningInformation>): Color {
        let colorIndex = Math.floor(timing.timeMillis / this.cycleLengthMillis) % this.colors.length;
        let intensity = Math.cos(timing.timeMillis / this.cycleLengthMillis % 1 * Math.PI * 2 - Math.PI) / 2 + 0.5;
        return this.colors[colorIndex].clone().multiplyScalar(intensity);
    }

}