import { definePreset } from '@pandacss/dev';
import presetBase from '@pandacss/preset-base';
import presetPanda from '@pandacss/preset-panda';

// a field-kit palette: olive-grey ink for surfaces and text, amber for the one thing that matters
// on screen, sand for borders
export const preset = definePreset({
  name: 'wardogs-preset',
  presets: [
    presetBase,

    // @ts-expect-error - pandacss's bundled default preset doesn't satisfy its own Preset type
    // under exactOptionalPropertyTypes
    presetPanda,
  ],
  globalCss: {
    html: {
      '--global-color-border': 'colors.border',
      '--global-color-placeholder': 'colors.text.faint',
      '--global-font-body': 'fonts.sans',
      '--global-font-mono': 'fonts.mono',
      backgroundColor: 'bg.canvas',
      colorScheme: 'dark',
    },
    body: {
      color: 'text.primary',
      fontFamily: 'sans',
      WebkitFontSmoothing: 'antialiased',
    },
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          ink: {
            50: { value: '#f0efe6' },
            100: { value: '#dedcce' },
            200: { value: '#c6c4b2' },
            300: { value: '#a6a590' },
            400: { value: '#888771' },
            500: { value: '#6c6b57' },
            600: { value: '#535343' },
            700: { value: '#3b3c31' },
            800: { value: '#272822' },
            900: { value: '#1a1b16' },
            950: { value: '#10110d' },
          },
          amber: {
            300: { value: '#ffc978' },
            400: { value: '#f5b04a' },
            500: { value: '#e59a2b' },
          },
          sand: {
            400: { value: '#d9c28c' },
          },
          signal: {
            danger: { value: '#e5584f' },
            ok: { value: '#86b86a' },
            warning: { value: '#e8c547' },
          },
        },
        fonts: {
          display: { value: "'Chakra Petch', sans-serif" },
          mono: { value: "'IBM Plex Mono', ui-monospace, monospace" },
          sans: { value: "'IBM Plex Sans', system-ui, sans-serif" },
        },
        sizes: {
          sidebar: { value: '18rem' },
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            canvas: { value: '{colors.ink.950}' },
            panel: { value: '{colors.ink.900}' },
            raised: { value: '{colors.ink.800}' },
            hover: { value: '{colors.ink.700}' },
            accentMuted: { value: 'rgba(245, 176, 74, 0.14)' },
          },
          border: {
            DEFAULT: { value: 'rgba(217, 194, 140, 0.14)' },
            subtle: { value: 'rgba(217, 194, 140, 0.07)' },
            strong: { value: 'rgba(217, 194, 140, 0.28)' },
            accent: { value: '{colors.amber.400}' },
          },
          text: {
            heading: { value: '{colors.ink.50}' },
            primary: { value: '{colors.ink.100}' },
            muted: { value: '{colors.ink.400}' },
            faint: { value: '{colors.ink.600}' },
            accent: { value: '{colors.amber.400}' },
            danger: { value: '{colors.signal.danger}' },
            warning: { value: '{colors.signal.warning}' },
            onAccent: { value: '{colors.ink.950}' },
          },
        },
      },
    },
  },
});
