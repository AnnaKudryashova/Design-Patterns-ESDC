import { Shape } from '../entities/Shape';
import { ShapeIdGenerator } from '../utils/ShapeIdGenerator';

export abstract class ShapeFactory {
    protected generateId(prefix: string): string {
        return ShapeIdGenerator.generateId(prefix);
    }

    abstract createShape(data: number[]): Shape;
}