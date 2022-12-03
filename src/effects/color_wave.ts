import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";
import {lerpGradient} from "../extensions/threejs_utils";

export class WaveColorAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly direction: Vector3;
    private readonly isSmooth: boolean;
    private readonly scale: number = 1;
    private readonly cycleLengthMillis: number = 2500;

    private gradientOrigin!: Vector3;
    private gradientVector!: Vector3;

    constructor(colors: [ColorRepresentation, ColorRepresentation, ...ColorRepresentation[]], direction: Vector3, cycleLengthMillis: number = 2500, scale: number = 1, isSmooth: boolean = false) {
        this.colors = colors.map(cr => new Color(cr));
        this.direction = direction.normalize();
        this.cycleLengthMillis = cycleLengthMillis;
        this.scale = scale;
        this.isSmooth = isSmooth;
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
        let alpha = (projectedPointVector.length() / this.gradientVector.length() + _context.timeMillis / this.cycleLengthMillis) * this.scale % 1;
        return lerpGradient(this.colors as [Color, Color, ...Color[]], alpha, this.isSmooth);
    }

}