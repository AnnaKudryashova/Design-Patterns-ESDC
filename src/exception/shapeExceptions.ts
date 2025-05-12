export class ShapeValidationError extends Error {
    constructor(message: string, public shapeId: string) {
        super(message);
        this.name = 'ShapeValidationError';
    }
}

export class FileNotFoundError extends Error {
    constructor(filePath: string) {
        super(`File not found: ${filePath}`);
        this.name = 'FileNotFoundError';
    }
}

export class ShapeNotFoundError extends Error {
    constructor(shapeId: string) {
        super(`Shape with id ${shapeId} not found`);
        this.name = 'ShapeNotFoundError';
    }
}

export class InvalidShapeTypeError extends Error {
    constructor(type: string) {
        super(`Invalid shape type: ${type}`);
        this.name = 'InvalidShapeTypeError';
    }
} 