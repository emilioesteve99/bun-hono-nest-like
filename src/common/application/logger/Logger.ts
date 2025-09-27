import pino from 'pino';

export const LoggerSymbol: symbol = Symbol.for('Logger');

export const logger: pino.Logger = pino({
  level: 'debug',
  transport: {
    options: {
      colorize: true,
    },
    target: 'pino-pretty',
  },
});
