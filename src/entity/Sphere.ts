import { Point } from "./point";
import { Shape } from "./shape";

export class Sphere extends Shape {
  constructor(
    id: string,
    public readonly center: Point,
    public readonly radius: number
  ) {
    super(id, 'sphere', [center]);
  }

  get type(): string { return 'sphere'; }
}
