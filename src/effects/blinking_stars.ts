import {AnimatorContext, LightAnimator} from "../app";
import {Color, ColorRepresentation, Vector3} from "three";

type StarLight = {
    lightIndex: number,
    color: Color
};

const COLOR_BLACK = new Color(0);

export class BlinkingStarsAnimator implements LightAnimator {

    private readonly colors: Color[];
    private readonly starPercentage: number;
    private readonly lightInterval: number;

    private timeAccumulatorMillis: number = 0;
    private lightQueue: StarLight[] = [];

    constructor(colors: [ColorRepresentation, ...ColorRepresentation[]] = ['white'], starPercentage: number = 0.2, lightInterval: number = 80) {
        this.colors = colors.map(c => new Color(c));
        this.starPercentage = starPercentage;
        this.lightInterval = lightInterval;
    }

    private createStarLight(lightCount: number): StarLight {
        let colorIndex = Math.floor(Math.random() * this.colors.length);
        let lightIndex: number;
        do {
            lightIndex = Math.floor(Math.random() * lightCount);
        } while(this.lightQueue.some(sl => sl.lightIndex == lightIndex));

        return { lightIndex: lightIndex, color: this.colors[colorIndex] };
    }

    prepareUpdate(context: Readonly<AnimatorContext>) {
        if(context.hasLightCountChanged) {
            let starCount = this.starPercentage * context.lightCount;
            this.lightQueue.resize(starCount, () => this.createStarLight(context.lightCount));
        }

        this.timeAccumulatorMillis += context.deltaTimeMillis;
        while(this.timeAccumulatorMillis >= this.lightInterval) {
            this.lightQueue.shift();
            this.lightQueue.push(this.createStarLight(context.lightCount));
            this.timeAccumulatorMillis -= this.lightInterval;
        }
    }

    colorLight(_context: Readonly<AnimatorContext>, lightIndex: number, _lightPosition: Vector3): Color {
        let starLight = this.lightQueue.find(sl => sl.lightIndex == lightIndex);
        if(starLight == undefined) {
            return COLOR_BLACK;
        } else {
            return starLight.color;
        }
    }

}