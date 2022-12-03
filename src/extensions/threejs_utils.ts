import {Box3, Color, Vector3} from "three";

export function toLocalPoint(box: Box3, point: Vector3): Vector3 | undefined {
    if(!box.containsPoint(point)) {
        return undefined;
    }

    let size = box.getSize(new Vector3());
    return new Vector3(
        (point.x - box.min.x) / size.x,
        (point.y - box.min.y) / size.y,
        (point.z - box.min.z) / size.z);
}

export function lerpGradient(colors: [Color, Color, ...Color[]], alpha: number, isSmooth: boolean): Color {
    if(isSmooth) {
        if(alpha == 1) return colors[0];
        let colorDelta = 1 / colors.length;
        let colorIndex = Math.floor(alpha / colorDelta);
        let nextColorIndex = colorIndex == colors.length - 1 ? 0 : colorIndex + 1;
        return colors[colorIndex].clone().lerp(colors[nextColorIndex], alpha % colorDelta / colorDelta);
    } else {
        if(alpha == 1) return colors[colors.length - 1];
        let colorDelta = 1 / (colors.length - 1);
        let colorIndex = Math.floor(alpha / colorDelta);
        return colors[colorIndex].clone().lerp(colors[colorIndex + 1], alpha % colorDelta / colorDelta);
    }
}