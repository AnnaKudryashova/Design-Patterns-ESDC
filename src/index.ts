import { RectangleFactory } from './factories/RectangleFactory';
import { SphereFactory } from './factories/SphereFactory';
import { FileReader } from './utils/FileReader';
import { Logger } from './utils/Logger';
import { RectangleService } from './services/RectangleService';
import { SphereService } from './services/SphereService';
import { CustomException } from './exceptions/CustomException';

try {
    const rectangleData = FileReader.read('./data/rectangles.txt', 8);
    const rectangleFactory = new RectangleFactory();

    rectangleData.forEach((data) => {
        try {
            const rectangle = rectangleFactory.createShape(data);
            Logger.info(`Rectangle Area: ${RectangleService.calculateArea(rectangle)}`);
            Logger.info(`Rectangle Perimeter: ${RectangleService.calculatePerimeter(rectangle)}`);
        } catch (error) {
            Logger.error('An error occurred:', error instanceof Error ? error.message : error);
        }
    });
} catch (error) {
    if (error instanceof CustomException) {
        Logger.error(`CustomException: ${error.message}`);
        if (error.cause) {
            Logger.error(`Caused by: ${error.cause.message}`);
        }
    } else {
        Logger.error('An error occurred:', error instanceof Error ? error.message : error);
    }
}

try {
    const sphereData = FileReader.read('./data/spheres.txt', 4);
    const sphereFactory = new SphereFactory();

    sphereData.forEach((data) => {
        try {
            const sphere = sphereFactory.createShape(data);
            Logger.info(`Sphere Surface Area: ${SphereService.calculateSurfaceArea(sphere)}`);
            Logger.info(`Sphere Volume: ${SphereService.calculateVolume(sphere)}`);
        } catch (error) {
            Logger.error('An error occurred:', error instanceof Error ? error.message : error);
        }
    });
} catch (error) {
    if (error instanceof CustomException) {
        Logger.error(`CustomException: ${error.message}`);
        if (error.cause) {
            Logger.error(`Caused by: ${error.cause.message}`);
        }
    } else {
        Logger.error('An error occurred:', error instanceof Error ? error.message : error);
    }
}