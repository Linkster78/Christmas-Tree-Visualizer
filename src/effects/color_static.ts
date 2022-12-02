import {LightAnimator, LightCountInformation, PositioningInformation, TimingInformation} from "../app";
import {Color, ColorRepresentation} from "three";

export class StaticColorAnimator implements LightAnimator {

    private readonly color: Color;

    constructor(color: ColorRepresentation) {
        this.color = new Color(color);
    }

    prepareUpdate(_timing: Readonly<TimingInformation>, _lightInformation: Readonly<LightCountInformation>) {}

    colorLight(_timing: Readonly<TimingInformation>, _lightIndex: number, _positioning: Readonly<PositioningInformation>): Color {
        return this.color;
    }

}