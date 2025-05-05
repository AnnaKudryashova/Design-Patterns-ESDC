import { Shape } from "../entity/shape";

export interface ShapeFactory<T = any> {
  create(id: string, data: T): Shape;
}