import { Shape } from "../entity/shape";
import { Warehouse } from "../warehouse/warehouse";
import { GeometryService } from "../service/geometry/geometryService";
import { logger } from "../util/logger";
import { ShapeMetrics } from "../types";

export interface Observer<T = any> {
    update(event: ShapeEvent): void;
}

export interface Subject<T = any> {
    attach(observer: Observer<T>): void;
    detach(observer: Observer<T>): void;
    notify(event: ShapeEvent): void;
}

export enum ShapeEventType {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED'
}

export interface ShapeEvent {
    type: ShapeEventType;
    shape: Shape;
}

export class ShapeObservable implements Subject<Shape> {
    private observers: Observer<Shape>[] = [];

    attach(observer: Observer<Shape>): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            logger.warn('Observer has been attached already.');
            return;
        }
        this.observers.push(observer);
        logger.info('Observer attached successfully.');
    }

    detach(observer: Observer<Shape>): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            logger.warn('Observer not found.');
            return;
        }
        this.observers.splice(observerIndex, 1);
        logger.info('Observer detached successfully.');
    }

    notify(event: ShapeEvent): void {
        for (const observer of this.observers) {
            observer.update(event);
        }
    }
}

export class ShapeObserver implements Observer<Shape> {
    private readonly geometryService: GeometryService;
    private readonly warehouse: Warehouse;

    constructor(
        geometryService: GeometryService = new GeometryService(),
        warehouse: Warehouse = Warehouse.getInstance()
    ) {
        this.geometryService = geometryService;
        this.warehouse = warehouse;
    }

    update(event: ShapeEvent): void {
        const { shape, type } = event;

        if (type === ShapeEventType.DELETED) {
            this.warehouse.remove(shape.id);
            return;
        }

        const metrics: ShapeMetrics = {
            area: this.geometryService.calculateArea(shape),
            perimeter: shape.type === 'rectangle'
                ? this.geometryService.calculatePerimeter(shape)
                : undefined,
            volume: shape.type === 'sphere'
                ? this.geometryService.calculateVolume(shape)
                : undefined
        };

        this.warehouse.update(shape.id, metrics);
        logger.info(`Shape ${shape.id} metrics updated after ${type.toLowerCase()}`);
    }
}