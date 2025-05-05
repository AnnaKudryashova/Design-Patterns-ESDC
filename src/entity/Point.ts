export class Point {
  constructor(
    private _x: number,
    private _y: number,
    private _z: number = 0
  ) {}

  get x(): number { return this._x; }
  get y(): number { return this._y; }
  get z(): number { return this._z; }

  get coordinates(): number[] {
    return [this._x, this._y, this._z];
  }

  distanceTo(other: Point): number {
    return Math.sqrt(
      Math.pow(this._x - other.x, 2) +
      Math.pow(this._y - other.y, 2) +
      Math.pow(this._z - other.z, 2)
    );
  }

  equals(other: Point): boolean {
    return this._x === other.x && this._y === other.y && this._z === other.z;
  }
}