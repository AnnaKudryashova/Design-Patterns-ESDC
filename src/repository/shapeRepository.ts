import { Point } from "../entity/point";
import { Shape } from "../entity/shape";
import { Sphere } from "../entity/sphere";
import { GeometryService } from "../service/geometry/geometryService";
import { logger } from "../util/logger";
import { Warehouse } from "../warehouse/warehouse";
import { Observer, ShapeObserver, ShapeObservable, ShapeEventType } from "../observer/shapeObserver";
import { Specification, SortSpecification } from "../specification/specification";
import { RectangleFactory } from "../factory/rectangleFactory";

export class ShapeRepository {
    private static instance: ShapeRepository;
    private shapes: Map<string, Shape> = new Map();
    private warehouse: Warehouse;
    private geometryService: GeometryService;
    private observable: ShapeObservable;
    private shapeObserver: ShapeObserver;
    private rectangleFactory: RectangleFactory;

    private constructor(
        warehouse: Warehouse = Warehouse.getInstance(),
        geometryService: GeometryService = new GeometryService())
    {
        this.warehouse = warehouse;
        this.geometryService = geometryService;
        this.observable = new ShapeObservable();
        this.shapeObserver = new ShapeObserver(geometryService, warehouse);
        this.observable.attach(this.shapeObserver);
        this.rectangleFactory = new RectangleFactory();
        logger.info("ShapeRepository instance created with observer attached.");
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

        if (shape.type === 'sphere') {
            const sphere = shape as Sphere;
            const newCenter = points[0];
            const newRadius = sphere.radius * 1.5; // Increase radius by 50%
            const newSphere = new Sphere(id, newCenter, newRadius);
            this.shapes.set(id, newSphere);
        } else {
            // For rectangles, use the factory to create a new instance
            const [p1, p2, p3, p4] = points;
            const newRectangle = this.rectangleFactory.create(id, [p1, p2, p3, p4]);
            this.shapes.set(id, newRectangle);
        }

        this.observable.notify({
            type: ShapeEventType.UPDATED,
            shape: this.shapes.get(id)!,
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
}