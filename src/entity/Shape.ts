import { Point } from "./point";

export abstract class Shape {
  protected constructor(
    public readonly id: string,
    public readonly name: string,
    public points: Point[]
  ) {}

  abstract get type(): string;
}