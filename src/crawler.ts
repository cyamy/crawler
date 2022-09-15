import { devices, chromium } from '@playwright/test';
import fs from 'fs-extra';
import { imagePath } from '../targets.config';
import { deviceList, Targets, targets } from './util';

const getScreenShot = async (
  device: string,
  url: string,
  imagePath: string,
) => {
  const emulate = devices[device];
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

    deviceList.forEach(async (device) => {
      const currentDevicePath = currentPath + '/' + device;
      fs.mkdirSync(currentDevicePath);
      await getScreenShot(
        device,
        current.local,
        `${currentDevicePath}/local.png`,
      );
      await getScreenShot(
        device,
        current.stage,
        `${currentDevicePath}/stage.png`,
      );
      // eslint-disable-next-line no-console
      console.log(`save screenshot: ${current.title + ' ' + device}`);
    });
  });
};

crawler(targets);
