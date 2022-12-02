import {LightAnimator, LightCountInformation, PositioningInformation, TimingInformation} from "../app";
import {Color, ColorRepresentation} from "three";

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

    prepareUpdate(timing: Readonly<TimingInformation>, lightInformation: Readonly<LightCountInformation>) {
        if(lightInformation.hasChanged) {
            let starCount = this.starPercentage * lightInformation.lightCount;
            this.lightQueue.resize(starCount, () => this.createStarLight(lightInformation.lightCount));
        }

        this.timeAccumulatorMillis += timing.deltaTimeMillis;
        while(this.timeAccumulatorMillis >= this.lightInterval) {
            this.lightQueue.shift();
            this.lightQueue.push(this.createStarLight(lightInformation.lightCount));
            this.timeAccumulatorMillis -= this.lightInterval;
        }
    }

    colorLight(_timing: Readonly<TimingInformation>, lightIndex: number, _positioning: Readonly<PositioningInformation>): Color {
        let starLight = this.lightQueue.find(sl => sl.lightIndex == lightIndex);
        if(starLight == undefined) {
            return COLOR_BLACK;
        } else {
            return starLight.color;
        }
    }

}