import { RectangleValidator } from "./rectangleValidator";
import { SphereValidator } from "./sphereValidator";

export class ValidatorProvider {
  getValidator(type: string) {
    switch (type) {
      case 'rectangle': return new RectangleValidator();
      case 'sphere': return new SphereValidator();
      default: throw new Error(`Unsupported shape type: ${type}`);
    }
  }
}