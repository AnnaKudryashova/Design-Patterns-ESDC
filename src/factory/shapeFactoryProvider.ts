import { RectangleFactory } from "./rectangleFactory";
import { ShapeFactory } from "./shapeFactory";
import { SphereFactory } from "./sphereFactory";


export class ShapeFactoryProvider {
  private static instance: ShapeFactoryProvider;
  private factories: Map<string, ShapeFactory>;

  private constructor() {
    this.factories = new Map();
    this.registerDefaultFactories();
  }

  static getInstance(): ShapeFactoryProvider {
    if (!ShapeFactoryProvider.instance) {
      ShapeFactoryProvider.instance = new ShapeFactoryProvider();
    }
    return ShapeFactoryProvider.instance;
  }

  private registerDefaultFactories(): void {
    this.registerFactory('rectangle', new RectangleFactory());
    this.registerFactory('sphere', new SphereFactory());
  }

  registerFactory(type: string, factory: ShapeFactory): void {
    if (this.factories.has(type.toLowerCase())) {
      throw new Error(`Factory for type '${type}' already registered`);
    }
    this.factories.set(type.toLowerCase(), factory);
  }

  getFactory(type: string): ShapeFactory {
    const factory = this.factories.get(type.toLowerCase());
    if (!factory) {
      throw new Error(`No factory registered for type: ${type}`);
    }
    return factory;
  }

  hasFactory(type: string): boolean {
    return this.factories.has(type.toLowerCase());
  }
}