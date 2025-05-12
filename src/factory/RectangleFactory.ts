import { Point } from "../entity/point";
import { Rectangle } from "../entity/rectangle";
import { ShapeFactory } from "./shapeFactory";

export class RectangleFactory implements ShapeFactory<Point[]> {
    create(id: string, data: Point[]): Rectangle {
      const [p1, p2, p3, p4] = data;
      return new Rectangle(id, p1, p2, p3, p4);
  }
}