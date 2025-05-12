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

    // Set up default mock return values
    mockRectangleService.calculateArea.mockReturnValue(4);
    mockRectangleService.calculatePerimeter.mockReturnValue(8);
    mockSphereService.calculateSurfaceArea.mockReturnValue(50.27);
    mockSphereService.calculateVolume.mockReturnValue(33.51);
  });

  describe('calculateArea', () => {
    it('should calculate rectangle area', () => {
      const rectangle = new Rectangle('1', 
        new Point(0,0,0), new Point(2,0,0), 
        new Point(2,2,0), new Point(0,2,0));
      expect(service.calculateArea(rectangle)).toBe(4);
    });

    it('should calculate sphere surface area', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      expect(service.calculateArea(sphere)).toBe(50.27);
    });

    it('should throw for unsupported shape', () => {
      const invalidShape = { type: 'invalid', points: [] } as unknown as Shape;
      expect(() => service.calculateArea(invalidShape)).toThrow('Unsupported shape type: invalid');
    });

    it('should calculate area for rectangle', () => {
      const p1 = new Point(0, 0, 0);
      const p2 = new Point(2, 0, 0);
      const p3 = new Point(2, 2, 0);
      const p4 = new Point(0, 2, 0);
      const rectangle = new Rectangle('1', p1, p2, p3, p4);
      const result = service.calculateArea(rectangle);
      expect(result).toBe(4);
    });

    it('should calculate area for sphere', () => {
      const center = new Point(0, 0, 0);
      const sphere = new Sphere('1', center, 2);
      const result = service.calculateArea(sphere);
      expect(result).toBe(50.27);
    });
  });

  describe('calculatePerimeter', () => {
    it('should calculate rectangle perimeter', () => {
      const rectangle = new Rectangle('1', 
        new Point(0,0,0), new Point(2,0,0), 
        new Point(2,2,0), new Point(0,2,0));
      expect(service.calculatePerimeter(rectangle)).toBe(8);
    });

    it('should return 0 for sphere', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      expect(service.calculatePerimeter(sphere)).toBe(0);
    });

    it('should calculate perimeter for rectangle', () => {
      const p1 = new Point(0, 0, 0);
      const p2 = new Point(2, 0, 0);
      const p3 = new Point(2, 2, 0);
      const p4 = new Point(0, 2, 0);
      const rectangle = new Rectangle('1', p1, p2, p3, p4);
      const result = service.calculatePerimeter(rectangle);
      expect(result).toBe(8);
    });

    it('should calculate perimeter for sphere', () => {
      const center = new Point(0, 0, 0);
      const sphere = new Sphere('1', center, 2);
      const result = service.calculatePerimeter(sphere);
      expect(result).toBe(0);
    });
  });

  describe('calculateVolume', () => {
    it('should calculate sphere volume', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      expect(service.calculateVolume(sphere)).toBe(33.51);
    });

    it('should return 0 for rectangle', () => {
      const rectangle = new Rectangle('1', 
        new Point(0,0,0), new Point(2,0,0), 
        new Point(2,2,0), new Point(0,2,0));
      expect(service.calculateVolume(rectangle)).toBe(0);
    });

    it('should calculate volume for sphere', () => {
      const center = new Point(0, 0, 0);
      const sphere = new Sphere('1', center, 2);
      const result = service.calculateVolume(sphere);
      expect(result).toBe(33.51);
    });
  });

  describe('isInFirstQuadrant', () => {
    it('should return true for shape in first quadrant', () => {
      const rectangle = new Rectangle('1',
        new Point(1,1,0), new Point(2,1,0),
        new Point(2,2,0), new Point(1,2,0)
      );
      expect(service.isInFirstQuadrant(rectangle)).toBe(true);
    });

    it('should return false for shape not in first quadrant', () => {
      const rectangle = new Rectangle('1',
        new Point(-1,1,0), new Point(2,1,0),
        new Point(2,2,0), new Point(-1,2,0)
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

  describe('isSquare', () => {
    it('should identify a square', () => {
      const square = new Rectangle('1',
        new Point(0,0,0), new Point(2,0,0),
        new Point(2,2,0), new Point(0,2,0)
      );
      mockRectangleService.isSquare.mockReturnValue(true);
      expect(service.isSquare(square)).toBe(true);
    });

    it('should identify a non-square rectangle', () => {
      const rectangle = new Rectangle('1',
        new Point(0,0,0), new Point(3,0,0),
        new Point(3,2,0), new Point(0,2,0)
      );
      mockRectangleService.isSquare.mockReturnValue(false);
      expect(service.isSquare(rectangle)).toBe(false);
    });
  });

  describe('isRhombus', () => {
    it('should identify a rhombus', () => {
      const rhombus = new Rectangle('1',
        new Point(0,0,0), new Point(2,1,0),
        new Point(4,0,0), new Point(2,-1,0)
      );
      mockRectangleService.isRhombus.mockReturnValue(true);
      expect(service.isRhombus(rhombus)).toBe(true);
    });

    it('should identify a non-rhombus rectangle', () => {
      const rectangle = new Rectangle('1',
        new Point(0,0,0), new Point(3,0,0),
        new Point(3,2,0), new Point(0,2,0)
      );
      mockRectangleService.isRhombus.mockReturnValue(false);
      expect(service.isRhombus(rectangle)).toBe(false);
    });
  });

  describe('isTrapezoid', () => {
    it('should identify a trapezoid', () => {
      const trapezoid = new Rectangle('1',
        new Point(0,0,0), new Point(4,0,0),
        new Point(3,2,0), new Point(1,2,0)
      );
      mockRectangleService.isTrapezoid.mockReturnValue(true);
      expect(service.isTrapezoid(trapezoid)).toBe(true);
    });

    it('should identify a non-trapezoid rectangle', () => {
      const rectangle = new Rectangle('1',
        new Point(0,0,0), new Point(2,0,0),
        new Point(2,2,0), new Point(0,2,0)
      );
      mockRectangleService.isTrapezoid.mockReturnValue(false);
      expect(service.isTrapezoid(rectangle)).toBe(false);
    });
  });

  describe('touchesCoordinatePlane', () => {
    it('should return false for rectangle', () => {
      const rectangle = new Rectangle('1',
        new Point(0,0,0), new Point(2,0,0),
        new Point(2,2,0), new Point(0,2,0)
      );
      expect(service.touchesCoordinatePlane(rectangle)).toBe(false);
    });

    it('should detect sphere touching XY plane', () => {
      const sphere = new Sphere('1', new Point(0,0,2), 2);
      mockSphereService.touchesCoordinatePlane.mockReturnValue(true);
      expect(service.touchesCoordinatePlane(sphere)).toBe(true);
    });

    it('should detect shape not touching any plane', () => {
      const sphere = new Sphere('1', new Point(1,1,1), 0.5);
      mockSphereService.touchesCoordinatePlane.mockReturnValue(false);
      expect(service.touchesCoordinatePlane(sphere)).toBe(false);
    });

    it('should return false for touchesCoordinatePlane for rectangle', () => {
      const p1 = new Point(0, 0, 0);
      const p2 = new Point(2, 0, 0);
      const p3 = new Point(2, 2, 0);
      const p4 = new Point(0, 2, 0);
      const rectangle = new Rectangle('1', p1, p2, p3, p4);
      const result = service.touchesCoordinatePlane(rectangle);
      expect(result).toBe(false);
    });

    it('should return true for touchesCoordinatePlane for sphere touching plane', () => {
      const center = new Point(0, 0, 0);
      const sphere = new Sphere('1', center, 2);
      (mockSphereService.touchesCoordinatePlane as jest.Mock).mockReturnValue(true);
      const result = service.touchesCoordinatePlane(sphere);
      expect(result).toBe(true);
    });

    it('should return false for touchesCoordinatePlane for sphere not touching plane', () => {
      const center = new Point(0, 0, 0);
      const sphere = new Sphere('1', center, 2);
      (mockSphereService.touchesCoordinatePlane as jest.Mock).mockReturnValue(false);
      const result = service.touchesCoordinatePlane(sphere);
      expect(result).toBe(false);
    });
  });

  describe('getPlaneSplitVolumeRatio', () => {
    it('should calculate XY plane split ratio for sphere', () => {
      const sphere = new Sphere('1', new Point(0,0,0), 2);
      mockSphereService.getPlaneSplitVolumeRatio.mockReturnValue(0.5);
      expect(service.getPlaneSplitVolumeRatio(sphere, 'xy')).toBe(0.5);
    });

    it('should return 0 for non-sphere shapes', () => {
      const rectangle = new Rectangle('1',
        new Point(0,0,0), new Point(2,0,0),
        new Point(2,2,0), new Point(0,2,0)
      );
      expect(service.getPlaneSplitVolumeRatio(rectangle, 'xy')).toBe(0);
    });
  });
});