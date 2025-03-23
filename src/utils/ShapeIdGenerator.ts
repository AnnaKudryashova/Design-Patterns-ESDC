export class ShapeIdGenerator {
    private static id: number = 0;

    static generateId(prefix: string): string {
        this.id++;
        return `${prefix}_${this.id}`;
    }
}