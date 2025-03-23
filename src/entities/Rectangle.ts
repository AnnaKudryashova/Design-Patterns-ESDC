import { Shape } from './Shape';
import { Point } from "./Point";


export class Rectangle implements Shape {
    constructor(public id: string, public points: Point[]) {}
}