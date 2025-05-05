import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { GeometryService } from "../service/geometry/geometryService";
import { logger } from "../util/logger";
import { Warehouse } from "../warehouse/warehouse";
import { Observer, ShapeObserver } from "../observer/shapeObserver";

export class ShapeRepository {
    private static instance: ShapeRepository;
    private items: Map<string, Shape> = new Map();
    private warehouse: Warehouse;
    private geometryService: GeometryService;
    private observer: Observer;

    private constructor(
        warehouse: Warehouse = Warehouse.getInstance(),
        geometryService: GeometryService = new GeometryService(),
        observer: Observer = new ShapeObserver(geometryService))
    {
        this.warehouse = warehouse;
        this.geometryService = geometryService;
        this.observer = observer;
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
        this.observer.update(item);
      }


    updateShape(id: string, newPoints: Point[]): void {
        const shape = this.findById(id);
        if (!shape) {
            logger.warn(`Shape with ID ${id} not found for update.`);
            return;
        }

        shape.points = newPoints; // Mutate the shape
        logger.info(`Shape ${id} points updated.`);

        this.observer.update(shape);
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