import { Shape } from "../entity/shape";
import { ExtendedMetrics, ShapeMetrics } from "../types";
import { logger } from "../util/logger";

export class ShapeLogger {
    log(shape: Shape, basic: ShapeMetrics, extended: ExtendedMetrics, line: number) {
      const metrics = [
        `Area=${basic.area.toFixed(2)}`,
        `Distance=${extended.distance.toFixed(2)}`,
        ...(shape.type === 'rectangle'
          ? [
              `Perimeter=${basic.perimeter?.toFixed(2)}`,
              `IsSquare=${extended.isSquare}`,
              `IsRhombus=${extended.isRhombus}`,
              `IsTrapezoid=${extended.isTrapezoid}`
            ]
          : [
              `Volume=${basic.volume?.toFixed(2)}`,
              `TouchesPlane=${extended.touchesPlane}`,
              `PlaneSplitRatio=${extended.planeSplitRatio?.toFixed(2)}`
            ])
      ].filter(Boolean).join(', ');

      logger.info(`Created ${shape.type} at line ${line}. Metrics: ${metrics}`);
    }
  }
