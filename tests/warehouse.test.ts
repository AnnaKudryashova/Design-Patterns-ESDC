import { ShapeMetrics } from "../src/warehouse/shapeMetrics";
import { Warehouse } from "../src/warehouse/warehouse";


describe('Warehouse', () => {
  it('should store and retrieve shape metrics', () => {
    const wh = Warehouse.getInstance();
    const metrics: ShapeMetrics = { area: 100, perimeter: 40, volume: 0 };

    wh.update('shape-1', metrics);
    expect(wh.get('shape-1')).toEqual(metrics);
  });

  it('should skip update if metrics are unchanged', () => {
    const wh = Warehouse.getInstance();
    const metrics: ShapeMetrics = { area: 100, perimeter: 40, volume: 0 };

    wh.update('shape-2', metrics);
    const spy = jest.spyOn(console, 'log');
    wh.update('shape-2', metrics);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should remove a shape\'s metrics', () => {
    const wh = Warehouse.getInstance();
    const metrics: ShapeMetrics = { area: 50, perimeter: 20, volume: 10 };

    wh.update('shape-3', metrics);
    wh.remove('shape-3');
    expect(wh.get('shape-3')).toBeUndefined();
  });
});
