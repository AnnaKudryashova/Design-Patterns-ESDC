import { ShapeLogger } from "../src/service/shapeLogger";
import { Rectangle } from "../src/entity/rectangle";
import { Sphere } from "../src/entity/sphere";
import { Point } from "../src/entity/point";
import { logger } from "../src/util/logger";
import { ExtendedMetrics, ShapeMetrics } from "../src/types";

jest.mock('../src/util/logger', () => ({
  logger: {
    info: jest.fn()
  }
}));

describe('ShapeLogger', () => {
  let shapeLogger: ShapeLogger;

  beforeEach(() => {
    shapeLogger = new ShapeLogger();
    jest.clearAllMocks();
  });

  it('should log rectangle metrics', () => {
    const rectangle = new Rectangle('1',
      new Point(0,0,0), new Point(2,0,0),
      new Point(2,2,0), new Point(0,2,0));
    const basic: ShapeMetrics = { area: 4, perimeter: 8 };
    const extended: ExtendedMetrics = {
      distance: 2,
      isSquare: true,
      isRhombus: false,
      isTrapezoid: false
    };

    shapeLogger.log(rectangle, basic, extended, 1);
    expect(logger.info).toHaveBeenCalled();
  });

  it('should log sphere metrics', () => {
    const sphere = new Sphere('1', new Point(0,0,0), 2);
    const basic: ShapeMetrics = { area: 50.27, volume: 33.51 };
    const extended: ExtendedMetrics = {
      distance: 0,
      touchesPlane: true,
      planeSplitRatio: 0.5
    };

    shapeLogger.log(sphere, basic, extended, 1);
    expect(logger.info).toHaveBeenCalled();
  });
});
