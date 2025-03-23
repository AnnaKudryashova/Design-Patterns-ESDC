import { SphereService } from '../src/services/SphereService';
import { Sphere } from '../src/entities/Sphere';
import { Point } from '../src/entities/Point';

describe('SphereService', () => {
    const validSphere = new Sphere('Sphere1', [new Point(0, 0, 0)], 5);

    test('calculateSurfaceArea', () => {
        expect(SphereService.calculateSurfaceArea(validSphere)).toBeCloseTo(314.16, 2);
    });

    test('calculateVolume', () => {
        expect(SphereService.calculateVolume(validSphere)).toBeCloseTo(523.6, 1);
    });

    test('isValid', () => {
        expect(SphereService.isValid(validSphere)).toBe(true);
    });

    test('touchesCoordinatePlane', () => {
        expect(SphereService.touchesCoordinatePlane(validSphere)).toBe(false);
    });
});