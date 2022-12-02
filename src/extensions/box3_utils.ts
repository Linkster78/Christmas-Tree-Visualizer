import {Box3, Vector3} from "three";

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