import { logger } from "../util/logger";
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { SHAPE_TYPES } from "../constants";
import { FileNotFoundError } from "../exception/shapeExceptions";
import path from 'path';

export type ShapeType = 'rectangle' | 'sphere';

export interface ShapeFileData {
  type: ShapeType;
  rawCoordinates: string[];
  lineNumber: number;
}

export interface IDataReader {
  read(): Promise<ShapeFileData[]>;
}

export class DataReader implements IDataReader {
  private static readonly RECTANGLE_COORDINATES = 8;
  private static readonly SPHERE_COORDINATES = 4;
  private readonly resolvedPath: string;

  constructor(
    private readonly filePath: string,
    private readonly supportedShapes: ShapeType[] = [SHAPE_TYPES.RECTANGLE, SHAPE_TYPES.SPHERE]
  ) {
    this.resolvedPath = this.validateAndResolvePath(filePath);
  }

  private validateAndResolvePath(filePath: string): string {
    const resolvedPath = path.resolve(filePath);
    if (!existsSync(resolvedPath)) {
      throw new FileNotFoundError(filePath);
    }
    return resolvedPath;
  }

  async read(): Promise<ShapeFileData[]> {
    try {
      logger.info(`Reading file: ${this.resolvedPath}`);
      const content = await fs.readFile(this.resolvedPath, 'utf-8');
      return this.parseLines(content);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to read file: ${this.resolvedPath}`, { error: errorMessage });
      throw new FileNotFoundError(this.resolvedPath);
    }
  }

  private parseLines(content: string): ShapeFileData[] {
    return content
      .split('\n')
      .map((line, index) => this.parseLine(line, index + 1))
      .filter((entry): entry is ShapeFileData => entry !== null);
  }

  private parseLine(line: string, lineNumber: number): ShapeFileData | null {
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

    if (!this.supportedShapes.includes(type)) {
      logger.warn(`Line ${lineNumber}: Skipping unsupported shape type "${typeRaw}"`);
      return null;
    }

    const expectedCoordinates = type === SHAPE_TYPES.RECTANGLE
      ? DataReader.RECTANGLE_COORDINATES
      : DataReader.SPHERE_COORDINATES;

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