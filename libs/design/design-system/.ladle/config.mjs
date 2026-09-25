/** @type {import('@ladle/react').UserConfig} */
const config = {
  addons: {
    theme: { default: 'dark', enabled: false },
  },
  // resolved relative to this file, so a loader running from another directory finds it too
  viteConfig: new URL('../vite.config.ts', import.meta.url).pathname,
};

export default config;
