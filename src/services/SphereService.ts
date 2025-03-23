import { Sphere } from '../entities/Sphere';
import { SphereValidator } from '../validators/SphereValidator';

export class SphereService {
    static calculateSurfaceArea(sphere: Sphere): number {
        const surfaceArea = 4 * Math.PI * sphere.radius ** 2;
        return parseFloat(surfaceArea.toFixed(2));
    }

    static calculateVolume(sphere: Sphere): number {
        const volume = (4 / 3) * Math.PI * sphere.radius ** 3;
        return parseFloat(volume.toFixed(2));
    }

    static isValid(sphere: Sphere): boolean {
        return SphereValidator.isSphere(sphere);
    }

    static touchesCoordinatePlane(sphere: Sphere): boolean {
        return SphereValidator.touchesCoordinatePlane(sphere);
    }
}