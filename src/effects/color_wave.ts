import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";
import {lerpGradient} from "../extensions/threejs_utils";

export enum WaveType {
    HARD_SEPARATED,
    SOFT_SEPARATED,
    SMOOTH
}

export interface WaveColorAnimatorParameters {
    colors: [ColorRepresentation, ColorRepresentation, ...ColorRepresentation[]],
    direction?: Vector3,
    cycleLengthMillis?: number,
    scale?: number
    waveType?: WaveType
}

export class WaveColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly direction: Vector3;
    private readonly cycleLengthMillis: number;
    private readonly scale: number;
    private readonly waveType: WaveType;

    private gradientOrigin!: Vector3;
    private gradientVector!: Vector3;

    constructor(parameters: WaveColorAnimatorParameters) {
        this.colors = parameters.colors.map(cr => new Color(cr));
        this.direction = parameters.direction?.normalize() ?? new Vector3(0, 1, 0);
        this.cycleLengthMillis = parameters.cycleLengthMillis ?? 2500;
        this.scale = parameters.scale ?? 1;
        this.waveType = parameters.waveType ?? WaveType.SMOOTH;
    }

    prepareUpdate(context: Readonly<AnimatorContext>): void {
        if(context.hasBoundingBoxChanged) {
            let boxSize = context.boundingBox.getSize(new Vector3());
            let cornerVector = new Vector3(
                Math.sign(this.direction.x) * boxSize.x / 2,
                Math.sign(this.direction.y) * boxSize.y / 2,
                Math.sign(this.direction.z) * boxSize.z / 2);
            this.gradientVector = cornerVector.projectOnVector(this.direction);
            this.gradientOrigin = context.boundingBox.getCenter(new Vector3()).sub(this.gradientVector);
            this.gradientVector.multiplyScalar(2);
        }
    }

    colorLight(_context: Readonly<AnimatorContext>, _lightIndex: number, lightPosition: Vector3): Color {
        let pointVector = lightPosition.clone().sub(this.gradientOrigin);
        let projectedPointVector = pointVector.projectOnVector(this.gradientVector);
        let alpha = -(projectedPointVector.length() / this.gradientVector.length() - _context.timeMillis / this.cycleLengthMillis) * this.scale % 1;
        if(alpha < 0) alpha += 1;

        if(this.waveType == WaveType.HARD_SEPARATED) {
            let colorIndex = alpha == 1 ? 0 : Math.floor(alpha * this.colors.length);
            return this.colors[colorIndex];
        } else {
            return lerpGradient(this.colors as [Color, Color, ...Color[]], alpha, this.waveType == WaveType.SMOOTH);
        }
    }

}