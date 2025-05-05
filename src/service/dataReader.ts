import { logger } from "../util/logger";
import fs from 'fs/promises';

export interface ShapeFileData {
  type: 'rectangle' | 'sphere';
  rawCoordinates: string[];
  lineNumber: number;
}

export class DataReader {
  static async read(filePath: string): Promise<ShapeFileData[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseLines(content);
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`);
      throw new Error(`File read failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private static parseLines(content: string): ShapeFileData[] {
    return content.split('\n')
      .map((line, index) => this.parseLine(line, index + 1))
      .filter((entry): entry is ShapeFileData => entry !== null);
  }

  private static parseLine(line: string, lineNumber: number): ShapeFileData | null {
    const lineWithoutInlineComment = line.split('#')[0].trim();

    if (!lineWithoutInlineComment) {
      return null;
    }

    const parts = lineWithoutInlineComment.split(/\s+/).filter(part => part.length > 0);

    if (parts.length < 1) {
      return null;
    }

    const [typeRaw, ...coords] = parts;
    const type = typeRaw.toLowerCase();

    if (!['rectangle', 'sphere'].includes(type)) {
      logger.warn(`Line ${lineNumber}: Skipping unsupported shape type "${typeRaw}"`);
      return null;
    }

    if (type === 'rectangle' && coords.length !== 8) {
      logger.warn(`Line ${lineNumber}: Rectangle needs exactly 8 coordinates (got ${coords.length})`);
      return null;
    }

    if (type === 'sphere' && coords.length !== 4) {
      logger.warn(`Line ${lineNumber}: Sphere needs exactly 4 values (got ${coords.length})`);
      return null;
    }

    return {
      type: type as 'rectangle' | 'sphere',
      rawCoordinates: coords,
      lineNumber
    };
  }
}