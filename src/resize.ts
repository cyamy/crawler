import fs from 'fs-extra';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import { imagePath } from '../targets.config';
import { emulateDevices, Targets, targets } from './util';

const resizeImage = (
  input: string,
  output: string,
  width: number,
  height: number,
) => {
  sharp(input)
    .resize(width, height, { position: 'top' })
    .toFile(output, (err) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
    });
};

const resize = (targets: Targets[]) => {
  targets.forEach((current) => {
    emulateDevices.forEach((device) => {
      const currentPath = imagePath + '/' + current.title;
      const currentDevicePath = currentPath + '/' + device;
      const local = PNG.sync.read(
        fs.readFileSync(`${currentDevicePath}/local.png`),
      );
      const stage = PNG.sync.read(
        fs.readFileSync(`${currentDevicePath}/stage.png`),
      );

      const { width, height } = stage;

      if (height !== local.height) {
        const file = `${currentDevicePath}/local.png`;
        const resize = `${currentDevicePath}/local-resize.png`;

        resizeImage(file, resize, width, height);
      }
    });
  });
};

resize(targets);
