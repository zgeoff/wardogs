import config from '@zgeoff/oxfmt-config';
import { defineConfig } from 'oxfmt';

export default defineConfig({
  ...config,
  ignorePatterns: [...config.ignorePatterns, '**/routeTree.gen.ts', '**/styled-system/**'],
});
