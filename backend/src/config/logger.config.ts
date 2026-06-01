import 'winston-daily-rotate-file';

import winston from 'winston';

type WinstonInfo = {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  stack?: string;
  [key: string]: unknown;
};

const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

const fileFormat = winston.format.combine(
  timestampFormat,
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, context, stack, ...meta } =
      info as WinstonInfo;
    const ctx = context ? `[${context}] ` : '';

    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => !IGNORED_META_KEYS.includes(key)),
    );

    const metaStr = Object.keys(cleanMeta).length
      ? ` | ${JSON.stringify(cleanMeta)}`
      : '';

    const stackStr = stack ? `\n${stack}` : '';

    return `[${timestamp}] ${level.toUpperCase()} ${ctx}${message}${metaStr}${stackStr}`;
  }),
);

const IGNORED_META_KEYS = [
  'service',
  'environment',
  'context',
  'method',
  'url',
  'statusCode',
  'duration',
  'ip',
  'userAgent',
];

export const consoleFormat = winston.format.combine(
  timestampFormat,
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, context, ...meta } = info as WinstonInfo;
    const ctx = context ? `[${context}] ` : '';
    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => !IGNORED_META_KEYS.includes(key)),
    );
    const metaStr = Object.keys(cleanMeta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : '';

    return `[${timestamp}] ${level} ${ctx}${message}${metaStr}`;
  }),
);

export const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: consoleFormat,
});

export const combinedFileTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
});

export const errorFileTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '30d',
  format: fileFormat,
});
