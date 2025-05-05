import { ShapeLogger } from "../src/service/shapeLogger";
import { logger } from "../src/util/logger";

jest.mock('../src/util/logger');

describe('ShapeLogger', () => {
  const shapeLogger = new ShapeLogger();

  it('should log correct metrics for a rectangle', () => {
    const shape = { type: 'rectangle' } as any;
    const basic = { area: 50, perimeter: 30 } as any;
    const extended = { distance: 5, isSquare: true, isRhombus: false, isTrapezoid: true } as any;

    shapeLogger.log(shape, basic, extended, 3);

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Perimeter=30.00'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('IsSquare=true'));
  });

  it('should log correct metrics for a sphere', () => {
    const shape = { type: 'sphere' } as any;
    const basic = { area: 100, volume: 200 } as any;
    const extended = { distance: 7, touchesPlane: true, planeSplitRatio: 0.33 } as any;

    shapeLogger.log(shape, basic, extended, 7);

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Volume=200.00'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('TouchesPlane=true'));
  });
});
