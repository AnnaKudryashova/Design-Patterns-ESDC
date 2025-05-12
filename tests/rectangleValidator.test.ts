import { GeometryHelper } from "../src/service/geometry/geometryHelper";
import { RectangleValidator } from "../src/validator/rectangleValidator";

jest.mock('../src/service/geometry/geometryHelper');

describe('RectangleValidator', () => {
  let validator: RectangleValidator;

  beforeEach(() => {
    validator = new RectangleValidator();
    jest.clearAllMocks();
    
    // Mock GeometryHelper methods
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(true);
    (GeometryHelper.arePointsEqual as jest.Mock).mockReturnValue(false);
    (GeometryHelper.distance as jest.Mock).mockReturnValue(2);
    (GeometryHelper.areEqual as jest.Mock).mockReturnValue(true);
    (GeometryHelper.isRightAngle as jest.Mock).mockReturnValue(true);
    (GeometryHelper.areCollinear as jest.Mock).mockReturnValue(false);
  });

  it('should validate correct rectangle coordinates', () => {
    const coords = ['0', '0', '2', '0', '2', '2', '0', '2'];
    expect(validator.validate(coords)).toBe(true);
  });

  it('should reject invalid number of coordinates', () => {
    const coords = ['0', '0', '2', '0', '2', '2'];
    expect(validator.validate(coords)).toBe(false);
  });

  it('should reject non-numeric coordinates', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(false);
    const coords = ['0', '0', '2', '0', '2', '2', '0', 'abc'];
    expect(validator.validate(coords)).toBe(false);
  });

  it('should reject duplicate points', () => {
    (GeometryHelper.arePointsEqual as jest.Mock).mockReturnValue(true);
    const coords = ['0', '0', '0', '0', '2', '2', '0', '2'];
    expect(validator.validate(coords)).toBe(false);
  });

  it('should validate a correct rectangle', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(true);
    (GeometryHelper.arePointsEqual as jest.Mock).mockReturnValue(false);
    (GeometryHelper.distance as jest.Mock).mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValueOnce(1).mockReturnValueOnce(2)
      .mockReturnValueOnce(2.24).mockReturnValueOnce(2.24);
    (GeometryHelper.areEqual as jest.Mock).mockReturnValue(true);
    (GeometryHelper.isRightAngle as jest.Mock).mockReturnValue(true);
    (GeometryHelper.areCollinear as jest.Mock).mockReturnValue(false);

    const result = validator.validate(['0', '0', '1', '0', '1', '1', '0', '1']);
    expect(result).toBe(true);
  });

  it('should return false for rectangles with invalid coordinates', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(false);
    const result = validator.validate(['0', '0', 'a', '0', '1', '1', '0', '1']);
    expect(result).toBe(false);
  });
});
