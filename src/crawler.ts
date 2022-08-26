import { devices, chromium } from '@playwright/test';
import fs from 'fs-extra';

const targets = JSON.parse(fs.readFileSync('config.json', 'utf-8')).targets as {
  title: string;
  local: string;
  testUp: string;
}[];

// https://playwright.dev/docs/emulation#devices
const emulate = devices['iPhone 12'];
const imagePath = 'screenshot';

const getScreenShot = async (url: string, imagePath: string) => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...emulate,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  await page.goto(url);
  await page.screenshot({
    animations: 'disabled',
    path: imagePath,
    fullPage: true,
  });
  await browser.close();
};

const crawler = async (
  targets: {
    title: string;
    local: string;
    testUp: string;
  }[],
) => {
  fs.removeSync(imagePath);
  fs.mkdirSync(imagePath);

  targets.forEach(async (current) => {
    const currentPath = imagePath + '/' + current.title;
    fs.mkdirSync(currentPath);

    await getScreenShot(current.local, `${currentPath}/local.png`);
    await getScreenShot(current.testUp, `${currentPath}/testUp.png`);

    console.log(`save screenshot: ${current.title}`);
  });
};

crawler(targets);
