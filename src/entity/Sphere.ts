import { Shape } from './Shape';
import { Point } from './Point';


export class Sphere implements Shape {
    constructor(public id: string, public points: Point[], public radius: number) {}
}