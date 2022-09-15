import fs from 'fs-extra';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { imagePath } from '../targets.config';
import { deviceList, targets } from './util';

const test = () => {
  targets.forEach((current) => {
    deviceList.forEach((device) => {
      const currentPath = imagePath + '/' + current.title;
      const currentDevicePath = currentPath + '/' + device;

      const local = fs.existsSync(`${currentDevicePath}/local-resize.png`)
        ? PNG.sync.read(
            fs.readFileSync(`${currentDevicePath}/local-resize.png`),
          )
        : PNG.sync.read(fs.readFileSync(`${currentDevicePath}/local.png`));

      const stage = PNG.sync.read(
        fs.readFileSync(`${currentDevicePath}/stage.png`),
      );

      const { width, height } = stage;
      const diff = new PNG({ width, height });

      try {
        const result = pixelmatch(
          local.data,
          stage.data,
          diff.data,
          width,
          height,
          {
            threshold: 0.1,
          },
        );

        const diffPixelPercentage = (
          (result / (stage.width * stage.height)) *
          100
        ).toFixed(2);

        fs.writeFileSync(`${currentDevicePath}/diff.png`, PNG.sync.write(diff));
        // eslint-disable-next-line no-console
        console.log(
          `${current.title} ${device}'s diff: ${diffPixelPercentage}%`,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `${current.title} ${device} pixelmatch: image size are not equal`,
        );
      }
    });
  });
};

test();
