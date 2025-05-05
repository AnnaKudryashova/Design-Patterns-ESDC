import { GeometryHelper } from "../src/service/geometry/geometryHelper";
import { SphereValidator } from "../src/validator/sphereValidator";

jest.mock('../src/service/geometry/geometryHelper');

describe('SphereValidator', () => {
  const validator = new SphereValidator();

  it('should validate a correct sphere', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(true);
    const result = validator.validate(['1', '2', '3', '5']);
    expect(result).toBe(true);
  });

  it('should return false for negative radius', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(true);
    const result = validator.validate(['1', '2', '3', '-5']);
    expect(result).toBe(false);
  });

  it('should return false for non-numeric input', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(false);
    const result = validator.validate(['1', 'x', '3', '5']);
    expect(result).toBe(false);
  });
});
