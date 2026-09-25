import { defineConfig } from '@pandacss/dev';
import { preset } from '@wardogs-love/panda-preset';

// extracts this package's own styles for Ladle; the app extracts them again for itself
export default defineConfig({
  exclude: [],
  include: ['./src/**/*.{ts,tsx}', './.ladle/**/*.tsx'],
  jsxFramework: 'react',
  outdir: 'src/styled-system',
  preflight: true,
  presets: [preset],
  shorthands: false,
  strictPropertyValues: true,
  strictTokens: true,
});
