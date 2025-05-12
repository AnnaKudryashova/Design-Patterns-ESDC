import { GeometryHelper } from "../src/service/geometry/geometryHelper";
import { SphereValidator } from "../src/validator/sphereValidator";

jest.mock('../src/service/geometry/geometryHelper');

describe('SphereValidator', () => {
  let validator: SphereValidator;

  beforeEach(() => {
    validator = new SphereValidator();
    jest.clearAllMocks();
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(true);
  });

  it('should validate correct sphere coordinates', () => {
    const coords = ['0', '0', '0', '2'];
    expect(validator.validate(coords)).toBe(true);
  });

  it('should reject invalid number of coordinates', () => {
    const coords = ['0', '0', '0'];
    expect(validator.validate(coords)).toBe(false);
  });

  it('should reject non-numeric coordinates', () => {
    (GeometryHelper.areAllNumbers as jest.Mock).mockReturnValue(false);
    const coords = ['0', '0', '0', 'abc'];
    expect(validator.validate(coords)).toBe(false);
  });

  it('should reject negative radius', () => {
    const coords = ['0', '0', '0', '-2'];
    expect(validator.validate(coords)).toBe(false);
  });
});
