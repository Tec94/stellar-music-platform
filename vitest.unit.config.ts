import { mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

export default mergeConfig(baseConfig, {
  test: {
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.unit.test.{ts,tsx}'],
    environment: 'node'
  }
});
