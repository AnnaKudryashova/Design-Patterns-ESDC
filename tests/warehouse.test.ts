import { ShapeMetrics } from "../src/types";
import { Warehouse } from "../src/warehouse/warehouse";

describe('Warehouse', () => {
  let warehouse: Warehouse;

  beforeEach(() => {
    warehouse = Warehouse.getInstance();
  });

  it('should store and retrieve shape metrics', () => {
    const metrics: ShapeMetrics = { area: 4, perimeter: 8 };
    warehouse.update('1', metrics);
    const retrieved = warehouse.get('1');
    expect(retrieved).toEqual(metrics);
  });

  it('should update existing metrics', () => {
    const initial: ShapeMetrics = { area: 4, perimeter: 8 };
    const updated: ShapeMetrics = { area: 6, perimeter: 10 };
    warehouse.update('1', initial);
    warehouse.update('1', updated);
    const retrieved = warehouse.get('1');
    expect(retrieved).toEqual(updated);
  });

  it('should return undefined for non-existent shape', () => {
    const result = warehouse.get('non-existent');
    expect(result).toBeUndefined();
  });

  it('should format metrics to two decimal places', () => {
    const metrics: ShapeMetrics = {
      area: 4.12345,
      perimeter: 8.98765,
      volume: 33.45678
    };
    warehouse.update('1', metrics);
    const retrieved = warehouse.get('1');
    expect(retrieved).toEqual({
      area: 4.12,
      perimeter: 8.99,
      volume: 33.46
    });
  });

  it('should remove shape metrics', () => {
    const metrics: ShapeMetrics = { area: 4, perimeter: 8 };
    warehouse.update('1', metrics);
    warehouse.remove('1');
    expect(warehouse.get('1')).toBeUndefined();
  });
});
