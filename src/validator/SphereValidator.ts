import { GeometryHelper } from "../service/geometry/geometryHelper";

export class SphereValidator {
  validate(coords: string[]): boolean {

    if (coords.length !== 4) return false;

    if (!GeometryHelper.areAllNumbers(coords)) return false;

    const nums = coords.map(Number);
    const radius = nums[3];

    return radius > 0;
  }
}