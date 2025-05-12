import { SHAPE_TYPES } from './constants';
import { Shape } from './entity/shape';
import { Point } from './entity/point';
import { ShapeMetrics } from './warehouse/shapeMetrics';
import { ExtendedMetrics } from './warehouse/extendedMetrics';

export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];
export type ShapeEventType = 'created' | 'updated' | 'deleted';

export interface ShapeEvent {
    type: ShapeEventType;
    shape: Shape;
}

export interface ProcessingResult {
    success: number;
    errors: number;
}

export interface IShapeProcessor {
    process(data: any): { shape: Shape; basic: ShapeMetrics; extended: ExtendedMetrics };
}

export interface IShapeLogger {
    log(shape: Shape, basic: ShapeMetrics, extended: ExtendedMetrics, line: number): void;
}

export interface IShapeManager {
    processFile(filePath: string): Promise<ProcessingResult>;
    findInFirstQuadrant(): Shape[];
    findShapesInAreaRange(min: number, max: number): Shape[];
    findShapesNearOrigin(maxDistance: number): Shape[];
    sortByX(): Shape[];
    findByType(type: string): Shape[];
    updateShape(id: string, points: Point[]): void;
    getShapeMetrics(id: string): ShapeMetrics;
}