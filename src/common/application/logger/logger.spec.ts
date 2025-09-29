import { describe, expect, it } from 'vitest';

import { logger } from './logger';

describe('logger', () => {
  describe('when created', () => {
    it('should be of type pino.Logger', () => {
      // pino loggers have info, error, debug methods
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});
