import pino from 'pino';
import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
            },
        },
        {
            target: 'pino/file',
            options: {
                destination: path.join(logDirectory, 'app.log'),
                mkdir: true,
            },
        },
    ],
});

export const Logger = pino(transport);