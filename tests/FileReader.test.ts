import { FileReader } from '../src/utils/FileReader';
import { Logger } from '../src/utils/Logger';
import { CustomException } from '../src/exceptions/CustomException';
import fs from 'fs';
import path from 'path';

describe('FileReader', () => {
    const validFilePath = './data/valid.txt';
    const invalidFilePath = './data/invalid.txt';
    const nonExistentFilePath = './data/nonexistent.txt';

    const resolvedValidFilePath = path.resolve(__dirname, '..', validFilePath);
    const resolvedInvalidFilePath = path.resolve(__dirname, '..', invalidFilePath);
    const resolvedNonExistentFilePath = path.resolve(__dirname, '..', nonExistentFilePath);

    beforeEach(() => {
        jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();

        if (fs.existsSync(resolvedValidFilePath)) {
            fs.unlinkSync(resolvedValidFilePath);
        }
        if (fs.existsSync(resolvedInvalidFilePath)) {
            fs.unlinkSync(resolvedInvalidFilePath);
        }
    });

    test('read valid file', () => {
        fs.writeFileSync(resolvedValidFilePath, '1 2 3 4\n5 6 7 8');

        const data = FileReader.read(resolvedValidFilePath, 4);
        expect(data).toEqual([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
        ]);
    });

    test('read invalid file', () => {
        fs.writeFileSync(resolvedInvalidFilePath, '1 2 3 4\n5 6 a 8');

        const data = FileReader.read(resolvedInvalidFilePath, 4);
        expect(data).toEqual([
            [1, 2, 3, 4],
        ]);
        expect(Logger.error).toHaveBeenCalledWith('Invalid line 2: 5 6 a 8');
    });

    test('read non-existent file', () => {
        if (fs.existsSync(resolvedNonExistentFilePath)) {
            fs.unlinkSync(resolvedNonExistentFilePath);
        }

        expect(() => FileReader.read(resolvedNonExistentFilePath, 4)).toThrow(CustomException);
        expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to read file'));
    });
});