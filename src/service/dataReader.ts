import { logger } from "../util/logger";
import fs from 'fs/promises';

export type ShapeType = 'rectangle' | 'sphere';

export interface ShapeFileData {
  type: ShapeType;
  rawCoordinates: string[];
  lineNumber: number;
}

export class DataReader {
  private static readonly SUPPORTED_SHAPES: ShapeType[] = ['rectangle', 'sphere'];
  private static readonly RECTANGLE_COORDINATES = 8;
  private static readonly SPHERE_COORDINATES = 4;

  static async read(filePath: string): Promise<ShapeFileData[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseLines(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to read file: ${filePath}`, { error: errorMessage });
      throw new Error(`File read failed: ${errorMessage}`);
    }
  }

  private static parseLines(content: string): ShapeFileData[] {
    return content
      .split('\n')
      .map((line, index) => this.parseLine(line, index + 1))
      .filter((entry): entry is ShapeFileData => entry !== null);
  }

  private static parseLine(line: string, lineNumber: number): ShapeFileData | null {
    const lineWithoutInlineComment = line.split('#')[0].trim();

    if (!lineWithoutInlineComment) {
      return null;
    }

    const parts = lineWithoutInlineComment.split(/\s+/).filter(Boolean);

    if (parts.length < 1) {
      return null;
    }

    const [typeRaw, ...coords] = parts;
    const type = typeRaw.toLowerCase() as ShapeType;

    if (!this.SUPPORTED_SHAPES.includes(type)) {
      logger.warn(`Line ${lineNumber}: Skipping unsupported shape type "${typeRaw}"`);
      return null;
    }

    const expectedCoordinates = type === 'rectangle' 
      ? this.RECTANGLE_COORDINATES 
      : this.SPHERE_COORDINATES;

    if (coords.length !== expectedCoordinates) {
      logger.warn(
        `Line ${lineNumber}: ${type} needs exactly ${expectedCoordinates} coordinates (got ${coords.length})`
      );
      return null;
    }

    return {
      type,
      rawCoordinates: coords,
      lineNumber
    };
  }
}