import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests', 
  timeout: 30000,
  retries: 1,
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
  },
});
