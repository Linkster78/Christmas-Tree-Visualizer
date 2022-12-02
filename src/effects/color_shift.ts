import {LightAnimator, LightCountInformation, TimingInformation} from "../app";
import {Color, ColorRepresentation} from "three";

export class ShiftingColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly cycleLengthMillis: number;

    constructor(colors: [ColorRepresentation, ...ColorRepresentation[]], cycleLengthMillis: number = 4000) {
        this.colors = colors.map(cr => new Color(cr));
        this.cycleLengthMillis = cycleLengthMillis;
    }

    prepareUpdate(_timing: Readonly<TimingInformation>, _lightInformation: Readonly<LightCountInformation>) {}

    colorLight(timing: Readonly<TimingInformation>, _lightIndex: number): Color {
        let colorIndex = Math.floor(timing.timeMillis / this.cycleLengthMillis) % this.colors.length;
        let nextColorIndex = colorIndex == this.colors.length - 1 ? 0 : colorIndex + 1;
        let intensity = timing.timeMillis / this.cycleLengthMillis % 1;
        return this.colors[colorIndex].clone().lerp(this.colors[nextColorIndex], intensity);
    }

}