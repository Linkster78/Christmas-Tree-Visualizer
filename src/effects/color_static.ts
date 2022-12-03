import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";

export class StaticColorAnimator implements LightAnimator {

    private readonly color: Color;

    constructor(color: ColorRepresentation) {
        this.color = new Color(color);
    }

    prepareUpdate(_context: Readonly<AnimatorContext>) {}

    colorLight(_context: Readonly<AnimatorContext>, _lightIndex: number, _lightPosition: Vector3): Color {
        return this.color;
    }

}