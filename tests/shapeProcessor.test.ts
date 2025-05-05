import { Shape } from "../src/entity/shape";
import { ShapeFactoryProvider } from "../src/factory/shapeFactoryProvider";
import { ShapeRepository } from "../src/repository/shapeRepository";
import { GeometryService } from "../src/service/geometry/geometryService";
import { ShapeProcessor } from "../src/service/shapeProcessor";
import { ValidatorProvider } from "../src/validator/validatorProvider";

jest.mock('../src/factory/shapeFactoryProvider');
jest.mock('../src/validator/validatorProvider');
jest.mock('../src/repository/shapeRepository');
jest.mock('../src/service/geometry/geometryService');

describe('ShapeProcessor', () => {
  let processor: ShapeProcessor;
  let mockValidator: any;
  let mockFactory: any;
  let mockShape: Shape;

  beforeEach(() => {
    mockValidator = { validate: jest.fn().mockReturnValue(true) };
    mockFactory = { create: jest.fn() };
    mockShape = { id: '123', type: 'sphere' } as unknown as Shape;

    (ValidatorProvider.prototype.getValidator as jest.Mock).mockReturnValue(mockValidator);
    (ShapeFactoryProvider.getInstance as jest.Mock).mockReturnValue({
      getFactory: jest.fn().mockReturnValue(mockFactory),
    });
    (ShapeRepository.getInstance as jest.Mock).mockReturnValue({
      add: jest.fn(),
      getWarehouse: jest.fn().mockReturnValue({ update: jest.fn() }),
    });
    (mockFactory.create as jest.Mock).mockReturnValue(mockShape);
    (GeometryService.prototype.calculateArea as jest.Mock).mockReturnValue(100);
    (GeometryService.prototype.calculateVolume as jest.Mock).mockReturnValue(200);
    (GeometryService.prototype.calculateDistanceFromOrigin as jest.Mock).mockReturnValue(10);
    (GeometryService.prototype.touchesCoordinatePlane as jest.Mock).mockReturnValue(true);
    (GeometryService.prototype.getPlaneSplitVolumeRatio as jest.Mock).mockReturnValue(0.5);

    processor = new ShapeProcessor();
  });

  it('should process a valid sphere shape and return metrics', () => {
    const data = {
      type: 'sphere',
      rawCoordinates: [1, 2, 3],
    };

    const result = processor.process(data);

    expect(result.shape).toEqual(mockShape);
    expect(result.basic.area).toBe(100);
    expect(result.basic.volume).toBe(200);
    expect(result.extended.distance).toBe(10);
    expect(result.extended.touchesPlane).toBe(true);
    expect(result.extended.planeSplitRatio).toBe(0.5);
  });

  it('should throw if validation fails', () => {
    mockValidator.validate.mockReturnValue(false);
    const data = {
      type: 'sphere',
      rawCoordinates: [],
    };
    expect(() => processor.process(data)).toThrow();
  });
});