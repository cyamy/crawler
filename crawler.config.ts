import { devices } from '@playwright/test';

// https://playwright.dev/docs/emulation#devices
export const emulate = devices['iPhone 12'];

export const imagePath = 'screenshot';

export const targets = [
  {
    title: 'google',
    local: 'https://www.google.com/',
    testUp: 'https://www.google.com/',
  },
  {
    title: 'yahoo',
    local: 'https://www.yahoo.co.jp/',
    testUp: 'https://www.yahoo.co.jp/',
  },
];
