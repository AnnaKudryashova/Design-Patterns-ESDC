export const SHAPE_TYPES = {
    RECTANGLE: 'rectangle',
    SPHERE: 'sphere'
} as const;

export const ERROR_MESSAGES = {
    FILE_NOT_FOUND: 'File not found: %s',
    INVALID_SHAPE: 'Invalid shape type: %s',
    SHAPE_NOT_FOUND: 'Shape with id %s not found',
    PROCESSING_ERROR: 'Error processing shape at line %d: %s'
} as const;

export const CONFIG = {
    shapes: {
        defaultPath: '../../data/shapes.txt',
        supportedTypes: [SHAPE_TYPES.RECTANGLE, SHAPE_TYPES.SPHERE]
    },
    logging: {
        level: 'info',
        file: 'app.log'
    }
} as const;