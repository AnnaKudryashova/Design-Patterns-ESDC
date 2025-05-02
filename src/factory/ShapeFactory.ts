import { Shape } from '../entity/Shape';
import { ShapeIdGenerator } from '../util/ShapeIdGenerator';

export abstract class ShapeFactory {
    protected generateId(prefix: string): string {
        return ShapeIdGenerator.generateId(prefix);
    }

    abstract createShape(data: number[]): Shape;
}