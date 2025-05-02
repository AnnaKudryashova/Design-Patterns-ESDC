import { ShapeFactory } from './ShapeFactory';
import { Rectangle } from '../entity/Rectangle';
import { Point } from '../entity/Point';

export class RectangleFactory extends ShapeFactory {
    createShape(data: number[]): Rectangle {
        const points = [
            new Point(data[0], data[1]),
            new Point(data[2], data[3]),
            new Point(data[4], data[5]),
            new Point(data[6], data[7]),
        ];
        const id = this.generateId('rect');
        return new Rectangle(id, points);
    }
}