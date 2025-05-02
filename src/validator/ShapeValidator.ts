export class ShapeValidator {
    static validateShapeData(data: number[], expectedLength: number): boolean {
        if (data.length !== expectedLength) return false;
        if (data.some((value) => isNaN(value))) return false;
        return true;
    }
}