import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";

export class ShiftingColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly cycleLengthMillis: number;

    constructor(colors: [ColorRepresentation, ColorRepresentation, ...ColorRepresentation[]], cycleLengthMillis: number = 4000) {
        this.colors = colors.map(cr => new Color(cr));
        this.cycleLengthMillis = cycleLengthMillis;
    }

    prepareUpdate(_context: Readonly<AnimatorContext>) {}

    colorLight(context: Readonly<AnimatorContext>, _lightIndex: number, _lightPosition: Vector3): Color {
        let colorIndex = Math.floor(context.timeMillis / this.cycleLengthMillis) % this.colors.length;
        let nextColorIndex = colorIndex == this.colors.length - 1 ? 0 : colorIndex + 1;
        let intensity = context.timeMillis / this.cycleLengthMillis % 1;
        return this.colors[colorIndex].clone().lerp(this.colors[nextColorIndex], intensity);
    }

}