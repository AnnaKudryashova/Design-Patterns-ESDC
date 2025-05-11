import { ShapeDemo } from './service/shapeDemo';

async function main() {
  const demo = new ShapeDemo();
  await demo.run();
}

main();