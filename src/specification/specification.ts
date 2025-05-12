import { Shape } from "../entity/shape";
import { GeometryService } from "../service/geometry/geometryService";

export interface Specification {
    isSatisfiedBy(shape: Shape): boolean;
}

export interface SortSpecification {
    compare(a: Shape, b: Shape): number;
}

export class FirstQuadrantSpecification implements Specification {
    constructor(private geometryService: GeometryService) {}

    isSatisfiedBy(shape: Shape): boolean {
        return this.geometryService.isInFirstQuadrant(shape);
    }
}

export class AreaRangeSpecification implements Specification {
    constructor(
        private min: number,
        private max: number,
        private geometryService: GeometryService
    ) {}

    isSatisfiedBy(shape: Shape): boolean {
        const area = this.geometryService.calculateArea(shape);
        return area >= this.min && area <= this.max;
    }
}

export class DistanceFromOriginSpecification implements Specification {
    constructor(
        private maxDistance: number,
        private geometryService: GeometryService
    ) {}

    isSatisfiedBy(shape: Shape): boolean {
        const distance = this.geometryService.calculateDistanceFromOrigin(shape);
        return distance <= this.maxDistance;
    }
}

export class SortByXSpecification implements SortSpecification {
    constructor(private geometryService: GeometryService) {}

    compare(a: Shape, b: Shape): number {
        return this.geometryService.getFirstPointX(a) - this.geometryService.getFirstPointX(b);
    }
}

export class SortByYSpecification implements SortSpecification {
    constructor(private geometryService: GeometryService) {}

    compare(a: Shape, b: Shape): number {
        return this.geometryService.getFirstPointY(a) - this.geometryService.getFirstPointY(b);
    }
}

export class SpecificationFactory {
    static byFirstQuadrant(geometryService: GeometryService): Specification {
        return new FirstQuadrantSpecification(geometryService);
    }

    static byAreaRange(min: number, max: number, geometryService: GeometryService): Specification {
        return new AreaRangeSpecification(min, max, geometryService);
    }

    static byDistanceFromOrigin(maxDistance: number, geometryService: GeometryService): Specification {
        return new DistanceFromOriginSpecification(maxDistance, geometryService);
    }

    static sortByX(geometryService: GeometryService): SortSpecification {
        return new SortByXSpecification(geometryService);
    }

    static sortByY(geometryService: GeometryService): SortSpecification {
        return new SortByYSpecification(geometryService);
    }
}