import { GeometryService } from "../src/service/geometry/geometryService";
import { SphereGeometryService } from "../src/service/geometry/sphereGeometryService";
import { RectangleGeometryService } from "../src/service/geometry/rectangleGeometryService";
import { Rectangle } from "../src/entity/rectangle";
import { Point } from "../src/entity/point";
import { Sphere } from "../src/entity/sphere";
import { Shape } from "../src/entity/shape";

jest.mock('../src/service/geometry/rectangleGeometryService');
jest.mock('../src/service/geometry/sphereGeometryService');

describe('GeometryService', () => {
  let service: GeometryService;
  let mockRectangleService: jest.Mocked<RectangleGeometryService>;
  let mockSphereService: jest.Mocked<SphereGeometryService>;

  beforeEach(() => {
    mockRectangleService = new RectangleGeometryService() as jest.Mocked<RectangleGeometryService>;
    mockSphereService = new SphereGeometryService() as jest.Mocked<SphereGeometryService>;

    service = new GeometryService();
    (service as any).rectangleService = mockRectangleService;
    (service as any).sphereService = mockSphereService;
  });

  describe('calculateArea', () => {
    it('should calculate rectangle area', () => {
      const rectangle = new Rectangle('1', new Point(0,0), new Point(2,0), new Point(2,2), new Point(0,2));
      mockRectangleService.calculateArea.mockReturnValue(4);

      expect(service.calculateArea(rectangle)).toBe(4);
      expect(mockRectangleService.calculateArea).toHaveBeenCalledWith(rectangle);
    });

    it('should calculate sphere surface area', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      mockSphereService.calculateSurfaceArea.mockReturnValue(50.27);

      expect(service.calculateArea(sphere)).toBeCloseTo(50.27, 2);
    });

    it('should throw for unsupported shape', () => {
      const invalidShape = { type: 'invalid', points: [] } as unknown as Shape;
      expect(() => service.calculateArea(invalidShape)).toThrow('Unsupported shape type: invalid');
    });
  });

  describe('calculatePerimeter', () => {
    it('should calculate rectangle perimeter', () => {
      const rectangle = new Rectangle('1', new Point(0,0), new Point(2,0), new Point(2,2), new Point(0,2));
      mockRectangleService.calculatePerimeter.mockReturnValue(8);

      expect(service.calculatePerimeter(rectangle)).toBe(8);
    });

    it('should return 0 for non-rectangle', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      expect(service.calculatePerimeter(sphere)).toBe(0);
    });
  });

  describe('calculateVolume', () => {
    it('should calculate sphere volume', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      mockSphereService.calculateVolume.mockReturnValue(33.51);

      expect(service.calculateVolume(sphere)).toBeCloseTo(33.51, 2);
    });

    it('should return 0 for non-sphere', () => {
      const rectangle = new Rectangle('1', new Point(0,0), new Point(2,0), new Point(2,2), new Point(0,2));
      expect(service.calculateVolume(rectangle)).toBe(0);
    });
  });

  describe('isInFirstQuadrant', () => {
    it('should return true for rectangle in first quadrant', () => {
      const rectangle = new Rectangle('1',
        new Point(1,1), new Point(2,1),
        new Point(2,2), new Point(1,2)
      );
      expect(service.isInFirstQuadrant(rectangle)).toBe(true);
    });

    it('should return false for rectangle not in first quadrant', () => {
      const rectangle = new Rectangle('1',
        new Point(-1,1), new Point(2,1),
        new Point(2,2), new Point(-1,2)
      );
      expect(service.isInFirstQuadrant(rectangle)).toBe(false);
    });

    it('should check sphere center position', () => {
      const positiveSphere = new Sphere('1', new Point(1,1,1), 0.5);
      const negativeSphere = new Sphere('2', new Point(-1,1,1), 0.5);

      expect(service.isInFirstQuadrant(positiveSphere)).toBe(true);
      expect(service.isInFirstQuadrant(negativeSphere)).toBe(false);
    });
  });
});