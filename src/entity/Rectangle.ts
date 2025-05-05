import { Point } from "./point";
import { Shape } from "./shape";

export class Rectangle extends Shape {
    constructor(id: string, public p1:Point, public p2:Point, public p3:Point, public p4:Point) {
    const points = [p1, p2, p3, p4];
    super(id, 'rectangle', points);
  }

  get type(): string { return 'rectangle'; }
}