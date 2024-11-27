import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { join } from 'path';

const { combine, timestamp, printf, colorize } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// 로그 저장 경로
const logDir = join(__dirname, '../../logs');
// 로그 포맷 정의
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${message} ${stack || ''}`;
});

const consoleFormat = printf(({ level, message, timestamp, context }) => {
  const contextColored = context ? `\x1b[33m[${context}]\x1b[0m` : '[App]';
  return `[Nest] ${process.pid}  - ${timestamp}  ${level} ${contextColored} ${message}`;
});

export const winstonConfig = {
	levels,
	transports: [
		// 콘솔 출력
		new winston.transports.Console({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			format: combine(
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				utilities.format.nestLike('CorinEE'),
			),
		}),

    // info 레벨 로그 파일
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'info'),
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),

    // warn 레벨 로그 파일
    new winstonDaily({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'warn'),
      filename: `%DATE%.warn.log`,
      maxFiles: 30,
      zippedArchive: true,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),

    // error 레벨 로그 파일
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'error'),
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),
  ],
};
