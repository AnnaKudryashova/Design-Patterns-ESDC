import { Shape } from '../entity/shape';
import { Specification } from '../specification/specification';
import { SortSpecification } from '../specification/specification';

export interface IRepository<T> {
    add(item: T): void;
    update(id: string, item: T): void;
    remove(id: string): void;
    get(id: string): T | undefined;
    findAll(): T[];
    findBySpecification(specification: Specification): T[];
    sortBySpecification(specification: SortSpecification): T[];
} 