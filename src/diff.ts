import fs from 'fs-extra';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { imagePath } from '../targets.config';
import { targets } from './util';

const test = () => {
  targets.forEach((current) => {
    const currentPath = imagePath + '/' + current.title;

    const local = fs.existsSync(`${currentPath}/local-resize.png`)
      ? PNG.sync.read(fs.readFileSync(`${currentPath}/local-resize.png`))
      : PNG.sync.read(fs.readFileSync(`${currentPath}/local.png`));

    const stage = PNG.sync.read(fs.readFileSync(`${currentPath}/stage.png`));

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

      fs.writeFileSync(
        `${imagePath}/${current.title}/diff.png`,
        PNG.sync.write(diff),
      );

      console.log(`${current.title}'s diff: ${diffPixelPercentage}%`);
    } catch (error) {
      console.error(`${current.title} pixelmatch: image size are not equal`);
    }
  });
};

test();
