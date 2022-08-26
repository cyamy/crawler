import fs from 'fs-extra';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { targets, imagePath } from '../crawler.config';

const test = () => {
  targets.forEach((current) => {
    const currentPath = imagePath + '/' + current.title;

    const local = fs.existsSync(currentPath + '/' + 'local-resize.png')
      ? PNG.sync.read(fs.readFileSync(currentPath + '/' + 'local-resize.png'))
      : PNG.sync.read(fs.readFileSync(currentPath + '/' + 'local.png'));

    const testUp = PNG.sync.read(
      fs.readFileSync(currentPath + '/' + 'testUp.png'),
    );

    const { width, height } = testUp;
    const diff = new PNG({ width, height });

    try {
      const result = pixelmatch(
        local.data,
        testUp.data,
        diff.data,
        width,
        height,
        {
          threshold: 0.1,
        },
      );

      const diffPixelPercentage = (
        (result / (testUp.width * testUp.height)) *
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
