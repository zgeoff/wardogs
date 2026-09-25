import { defineConfig } from '@pandacss/dev';
import { preset } from '@wardogs-love/panda-preset';

// the one package that runs full codegen: every other package imports the generated css, jsx, and
// token helpers from here and only extracts its own styles with `panda cssgen`
export default defineConfig({
  exclude: [],
  include: [],
  jsxFramework: 'react',
  outdir: 'styled-system',
  preflight: true,
  presets: [preset],
  shorthands: false,
  strictPropertyValues: true,
  strictTokens: true,
});
