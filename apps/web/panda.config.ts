import { defineConfig } from '@pandacss/dev';
import { preset } from '@wardogs-love/panda-preset';

export default defineConfig({
  exclude: [],
  include: [
    '../../libs/design/design-system/src/**/*.{ts,tsx}',
    '../../libs/wardogs/fob-editor/src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  jsxFramework: 'react',
  outdir: 'src/styled-system',
  preflight: true,
  presets: [preset],
  shorthands: false,
  strictPropertyValues: true,
  strictTokens: true,
});
