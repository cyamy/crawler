import { chromium } from '@playwright/test';
import fs from 'fs-extra';
import { targets, imagePath, emulate } from '../crawler.config';
import { Targets } from './util';

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

const crawler = async (targets: Targets[]) => {
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
