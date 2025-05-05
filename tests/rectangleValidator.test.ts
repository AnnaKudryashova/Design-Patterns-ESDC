import { GeometryHelper } from "../src/service/geometry/geometryHelper";
import { RectangleValidator } from "../src/validator/rectangleValidator";

jest.mock('../src/service/geometry/geometryHelper');

describe('RectangleValidator', () => {
  const validator = new RectangleValidator();

  beforeEach(() => {
    jest.clearAllMocks();
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
