import { ShapeFactory } from './ShapeFactory';
import { Sphere } from '../entities/Sphere';
import { Point } from '../entities/Point';

export class SphereFactory extends ShapeFactory {
    createShape(data: number[]): Sphere {
        const center = new Point(data[0], data[1], data[2]);
        const radius = data[3];
        const id = this.generateId('sphere');
        return new Sphere(id, [center], radius);
    }
}