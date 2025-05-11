import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { GeometryService } from "../service/geometry/geometryService";
import { logger } from "../util/logger";
import { Warehouse } from "../warehouse/warehouse";
import { Observer, ShapeObserver, ShapeObservable, ShapeEventType, ShapeEvent } from "../observer/shapeObserver";
import { Specification, SortSpecification } from "../specification/specification";

export class ShapeRepository {
    private static instance: ShapeRepository;
    private shapes: Map<string, Shape> = new Map();
    private warehouse: Warehouse;
    private geometryService: GeometryService;
    private observable: ShapeObservable;

    private constructor(
        warehouse: Warehouse = Warehouse.getInstance(),
        geometryService: GeometryService = new GeometryService())
    {
        this.warehouse = warehouse;
        this.geometryService = geometryService;
        this.observable = new ShapeObservable();
        logger.info("ShapeRepository instance created.");
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

    add(shape: Shape): void {
        this.shapes.set(shape.id, shape);
        this.observable.notify({
            type: ShapeEventType.CREATED,
            shape
        });
        logger.info(`Shape ${shape.id} added to repository`);
    }

    updateShape(id: string, points: Point[]): void {
        const shape = this.shapes.get(id);
        if (!shape) {
            throw new Error(`Shape with id ${id} not found`);
        }

        const previousState = { ...shape, points: [...shape.points], type: shape.type };
        shape.points = points;

        this.observable.notify({
            type: ShapeEventType.UPDATED,
            shape,
            previousState
        });
        logger.info(`Shape ${id} updated in repository`);
    }

    remove(id: string): void {
        const shape = this.shapes.get(id);
        if (!shape) {
            throw new Error(`Shape with id ${id} not found`);
        }

        this.shapes.delete(id);
        this.observable.notify({
            type: ShapeEventType.DELETED,
            shape
        });
        logger.info(`Shape ${id} removed from repository`);
    }

    get(id: string): Shape | undefined {
        return this.shapes.get(id);
    }

    findByType(type: string): Shape[] {
        return Array.from(this.shapes.values())
            .filter(shape => shape.type === type);
    }

    findBySpecification(specification: Specification): Shape[] {
        return Array.from(this.shapes.values())
            .filter(shape => specification.isSatisfiedBy(shape));
    }

    sortBySpecification(specification: SortSpecification): Shape[] {
        return Array.from(this.shapes.values())
            .sort((a, b) => specification.compare(a, b));
    }

    attachObserver(observer: Observer<Shape>): void {
        this.observable.attach(observer);
    }

    detachObserver(observer: Observer<Shape>): void {
        this.observable.detach(observer);
    }

    findAll(): Shape[] {
        return Array.from(this.shapes.values());
    }

    findByCriteria(criteria: (item: Shape) => boolean): Shape[] {
        return Array.from(this.shapes.values()).filter(criteria);
    }

    sort(criteria: (a: Shape, b: Shape) => number): Shape[] {
        return Array.from(this.shapes.values()).sort(criteria);
    }
}