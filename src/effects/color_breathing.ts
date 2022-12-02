import {LightAnimator} from "../app";
import {Color, ColorRepresentation} from "three";

export class BreathingColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly cycleLengthMillis: number;

    constructor(colors: [ColorRepresentation, ...ColorRepresentation[]], cycleLengthMillis: number = 4000) {
        this.colors = colors.map(cr => new Color(cr));
        this.cycleLengthMillis = cycleLengthMillis;
    }

    animate(timeMillis: number): Color {
        let colorIndex = Math.floor(timeMillis / this.cycleLengthMillis) % this.colors.length;
        let intensity = Math.cos((timeMillis / this.cycleLengthMillis) % 1 * Math.PI * 2 - Math.PI) / 2 + 0.5;
        return this.colors[colorIndex].clone().multiplyScalar(intensity);
    }

}