import { Point } from "../entity/point";
import { Sphere } from "../entity/sphere";
import { SphereValidator } from "../validator/sphereValidator";
import { ShapeFactory } from "./shapeFactory";

export class SphereFactory implements ShapeFactory {
  private validator = new SphereValidator();

  create(id: string, data: string[]): Sphere {
    if (!this.validator.validate(data)) {
      throw new Error('Invalid sphere data');
    }

    const [x, y, z, radius] = data.map(Number);
    return new Sphere(id, new Point(x, y, z), radius);
  }
}