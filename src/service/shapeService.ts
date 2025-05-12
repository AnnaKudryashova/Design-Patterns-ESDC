import { Shape } from '../entity/shape';
import { ProcessingResult } from '../types';

export interface IShapeService {
    processFile(filePath: string): Promise<ProcessingResult>;
    findInFirstQuadrant(): Shape[];
    findShapesInAreaRange(min: number, max: number): Shape[];
    findShapesNearOrigin(maxDistance: number): Shape[];
    sortByX(): Shape[];
    sortByY(): Shape[];
} 