import fs from 'fs';
import path from 'path';
import { Logger } from './Logger';
import { CustomException } from '../exceptions/CustomException';

import { ShapeValidator } from '../validators/ShapeValidator';

export class FileReader {

    static read(filePath: string, expectedLength: number): number[][] {
        const data: number[][] = [];

        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const lines = fileContent.split('\n');

            lines.forEach((line, index) => {
                const values = line.trim().split(' ').map(Number);

                if (ShapeValidator.validateShapeData(values, expectedLength)) {
                    data.push(values);
                } else {
                    Logger.error(`Invalid line ${index + 1}: ${line}`);
                }
            });
        } catch (error) {
            Logger.error(`Failed to read file: ${filePath}`);
            throw new CustomException(`Failed to read file: ${filePath}`, error instanceof Error ? error : undefined);
        }

        return data;
    }
}