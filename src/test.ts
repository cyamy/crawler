import fs from 'fs-extra';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync } from 'fs';
import sharp from 'sharp';

const targets = JSON.parse(fs.readFileSync('config.json', 'utf-8')).targets as {
  title: string;
  local: string;
  testUp: string;
}[];

const imagePath = 'screenshot';

const resizeImage = (
  input: string,
  output: string,
  width: number,
  height: number,
) => {
  sharp(input)
    .resize(width, height, {})
    .toFile(output, (err) => {
      // eslint-disable-next-line no-console
      if (err) console.error(err);
    });
};

const test = () => {
  targets.forEach((current) => {
    const currentPath = imagePath + '/' + current.title;

    const local = PNG.sync.read(readFileSync(currentPath + '/' + 'local.png'));
    const testUp = PNG.sync.read(
      readFileSync(currentPath + '/' + 'testUp.png'),
    );

    const { width, height } = testUp;

    if (height !== local.height) {
      const file = currentPath + '/' + 'local.png';
      const temp = currentPath + '/' + 'temp.png';

      resizeImage(file, temp, width, height);
      fs.rmSync(file);
      fs.moveSync(temp, file);
    }

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
      console.error(`${current.title} pixelmatch error`);
    }
  });
};

test();
