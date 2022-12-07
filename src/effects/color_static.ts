import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";

export interface StaticColorAnimatorParameters {
    color: ColorRepresentation
}

export class StaticColorAnimator implements LightAnimator {

    private readonly color: Color;

    constructor(parameters: StaticColorAnimatorParameters) {
        this.color = new Color(parameters.color ?? 0);
    }

    prepareUpdate(_context: Readonly<AnimatorContext>) {}

    colorLight(_context: Readonly<AnimatorContext>, _lightIndex: number, _lightPosition: Vector3): Color {
        return this.color;
    }

}