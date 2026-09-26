import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

// runs against the production build served by Bun, the way Fly serves it; turbo builds the app
// before this runs
export default defineConfig({
  forbidOnly: process.env['CI'] !== undefined,
  outputDir: '.test-results',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },

        // headless Chromium has no GPU; SwiftShader gives the planner's WebGL canvas a software one
        launchOptions: {
          args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
        },
      },
    },
  ],
  reporter: process.env['CI'] === undefined ? 'list' : [['list'], ['html', { open: 'never' }]],
  retries: 0,
  testDir: './specs',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'bun server.ts',
    cwd: '../web',
    env: { DATABASE_PATH: ':memory:', PORT: String(PORT) },
    reuseExistingServer: false,
    url: `http://localhost:${PORT}/health`,
  },
});
