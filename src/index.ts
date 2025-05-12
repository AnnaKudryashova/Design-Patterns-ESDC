import { ShapeDemo } from './demo/shapeDemo';
import { logger } from './util/logger';

async function main() {
    try {
        const demo = new ShapeDemo();
        await demo.run();
    } catch (error) {
        logger.error('Error running demo:', error);
        process.exit(1);
    }
}

main();