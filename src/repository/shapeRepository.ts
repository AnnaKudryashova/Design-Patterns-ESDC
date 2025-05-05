import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { GeometryService } from "../service/geometry/geometryService";
import { logger } from "../util/logger";
import { Warehouse } from "../warehouse/warehouse";

export class ShapeRepository {
  private static instance: ShapeRepository;
  private items: Map<string, Shape> = new Map();
  private warehouse: Warehouse;
  private geometryService: GeometryService;


  private constructor(
    warehouse: Warehouse = Warehouse.getInstance(),
    geometryService: GeometryService = new GeometryService()
  ) {
    this.warehouse = warehouse;
    this.geometryService = geometryService;
  }

  public static getInstance(): ShapeRepository {
    if (!ShapeRepository.instance) {
      ShapeRepository.instance = new ShapeRepository();
    }
    return ShapeRepository.instance;
  }

  public getWarehouse(): Warehouse {
    return this.warehouse;
  }

  add(item: Shape): void {
    this.items.set(item.id, item);
    const metrics = {
      area: this.geometryService.calculateArea(item),
      perimeter: item.type === 'rectangle'
        ? this.geometryService.calculatePerimeter(item)
        : undefined,
      volume: item.type === 'sphere'
        ? this.geometryService.calculateVolume(item)
        : undefined
    };
  }

  updateShape(id: string, newPoints: Point[]): void {
    const shape = this.findById(id);
    if (!shape) {
      logger.warn(`Shape with ID ${id} not found for update.`);
      return;
    }

    shape.points = newPoints; // Mutate the shape
    logger.info(`Shape ${id} points updated.`);

    // Recalculate metrics and conditionally update warehouse
    const metrics = {
      area: this.geometryService.calculateArea(shape),
      perimeter: shape.type === 'rectangle'
        ? this.geometryService.calculatePerimeter(shape)
        : undefined,
      volume: shape.type === 'sphere'
        ? this.geometryService.calculateVolume(shape)
        : undefined
    };

    this.warehouse.update(id, metrics);
  }

  remove(id: string): void {
    this.items.delete(id);
    this.warehouse.remove(id);
  }


  findById(id: string): Shape | undefined {
    return this.items.get(id);
  }

  findByType(type: string): Shape[] {
    return this.findAll().filter(shape => shape.type === type);
  }

  findByCriteria(criteria: (item: Shape) => boolean): Shape[] {
      return Array.from(this.items.values()).filter(criteria);
  }

  findAll(): Shape[] {
    console.log('findAll', this.items);
      return Array.from(this.items.values());
  }

  sort(criteria: (a: Shape, b: Shape) => number): Shape[] {
      return Array.from(this.items.values()).sort(criteria);
  }
}