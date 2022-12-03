import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";

export class MixedColorAnimator implements LightAnimator {

    private readonly colors: Color[];

    private lightColors: Color[] = [];

    constructor(colors: [ColorRepresentation, ColorRepresentation, ...ColorRepresentation[]]) {
        this.colors = colors.map(cr => new Color(cr));
    }

    prepareUpdate(context: Readonly<AnimatorContext>): void {
        if(context.hasLightCountChanged) {
            this.lightColors.resize(context.lightCount, () => {
                let colorIndex = Math.floor(Math.random() * this.colors.length);
                return this.colors[colorIndex].clone();
            });
        }
    }

    colorLight(_context: Readonly<AnimatorContext>, lightIndex: number, _lightPosition: Vector3): Color {
        return this.lightColors[lightIndex];
    }

}