import {LightAnimator} from "../app";
import {Color, ColorRepresentation} from "three";

export class StaticColorAnimator implements LightAnimator {

    private readonly color: Color;

    constructor(color: ColorRepresentation) {
        this.color = new Color(color);
    }
    
    animate(_timeMillis: number): Color {
        return this.color;
    }

}