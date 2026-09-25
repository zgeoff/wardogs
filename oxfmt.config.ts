import config from '@zgeoff/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...config,
  ignorePatterns: [
    ...config.ignorePatterns,
    '**/routeTree.gen.ts',
    'libs/design/styled-system/styled-system/**',
    '**/src/styled-system/**',
  ],
});
