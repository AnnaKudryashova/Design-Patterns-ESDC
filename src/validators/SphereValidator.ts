import { Sphere } from '../entities/Sphere';

export class SphereValidator {
    static isSphere(sphere: Sphere): boolean {
        return sphere.radius > 0;
    }

    static touchesCoordinatePlane(sphere: Sphere): boolean {
        const { x, y, z } = sphere.points[0];
        return (
            Math.abs(x) === sphere.radius ||
            Math.abs(y) === sphere.radius ||
            Math.abs(z) === sphere.radius
        );
    }
}