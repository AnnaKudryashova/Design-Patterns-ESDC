import { Shape } from "../src/entity/shape";
import { ShapeRepository } from "../src/repository/shapeRepository";
import { GeometryService } from "../src/service/geometry/geometryService";
import { ShapeProcessor } from "../src/service/shapeProcessor";
import { ValidatorProvider } from "../src/validator/validatorProvider";
import { RectangleFactory } from "../src/factory/rectangleFactory";
import { SphereFactory } from "../src/factory/sphereFactory";

jest.mock('../src/factory/rectangleFactory');
jest.mock('../src/factory/sphereFactory');
jest.mock('../src/validator/validatorProvider');
jest.mock('../src/repository/shapeRepository');
jest.mock('../src/service/geometry/geometryService');

describe('ShapeProcessor', () => {
  let processor: ShapeProcessor;
  let mockValidator: any;
  let mockShape: Shape;

  beforeEach(() => {
    mockValidator = { validate: jest.fn().mockReturnValue(true) };
    mockShape = { id: '123', type: 'rectangle' } as unknown as Shape;

    (ValidatorProvider.prototype.getValidator as jest.Mock).mockReturnValue(mockValidator);
    (ShapeRepository.getInstance as jest.Mock).mockReturnValue({
      add: jest.fn(),
    });
    (RectangleFactory.prototype.create as jest.Mock).mockReturnValue(mockShape);
    (SphereFactory.prototype.create as jest.Mock).mockReturnValue(mockShape);
    (GeometryService.prototype.calculateArea as jest.Mock).mockReturnValue(4);
    (GeometryService.prototype.calculatePerimeter as jest.Mock).mockReturnValue(8);
    (GeometryService.prototype.calculateDistanceFromOrigin as jest.Mock).mockReturnValue(2);

    processor = new ShapeProcessor();
  });

  it('should process a valid rectangle shape', () => {
    const data = {
      type: 'rectangle',
      rawCoordinates: ['0', '0', '2', '0', '2', '2', '0', '2'],
    };

    const result = processor.process(data);

    expect(result.shape).toBeDefined();
    expect(result.shape.type).toBe('rectangle');
    expect(result.basic.area).toBe(4);
    expect(result.basic.perimeter).toBe(8);
    expect(result.extended.distance).toBe(2);
  });

  it('should process a valid sphere shape', () => {
    const data = {
      type: 'sphere',
      rawCoordinates: ['0', '0', '0', '2'],
    };

    const result = processor.process(data);

    expect(result.shape).toBeDefined();
    expect(result.shape.type).toBe('rectangle'); // Mock returns rectangle
    expect(result.basic.area).toBe(4);
    expect(result.basic.volume).toBeUndefined(); // Rectangle doesn't have volume
    expect(result.extended.distance).toBe(2);
  });

  it('should throw if validation fails', () => {
    mockValidator.validate.mockReturnValue(false);
    const data = {
      type: 'rectangle',
      rawCoordinates: ['0', '0', '2', '0'],
    };
    expect(() => processor.process(data)).toThrow();
  });

  it('should throw for invalid data format', () => {
    const data = {
      type: 'rectangle',
      rawCoordinates: null,
    };
    expect(() => processor.process(data)).toThrow('Invalid data format');
  });
});