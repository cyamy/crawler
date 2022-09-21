# crawldiffer

create image diff that local preview and staging.

## setup

1. `pnpm install`
2. `npx playwright install`
3. define `targets.yaml` for crawler targets

## exec

1. `pnpm run crawler` for get screenshot
2. if you need all pixel diff image, run `pnpm run resize`
3. `pnpm run diff` for create screenshot diff

## faq

Q. What emulate devices are available? 

A. https://stackoverflow.com/questions/68361792/what-devices-are-available-using-playwright-devices-api

Q. The element is not displayed because the class is given in the scroll trigger. Is it possible to add the class before the screenshot? 

A. add this code for crawler.ts (will be adding an option to handle　this code.)
```ts
// add this function
const activeAnimationItem = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      const targets = document.querySelectorAll('.js-targetElement');
      targets.forEach((target) => {
        target.classList.add('is-active');
      });
      resolve('ok');
    });
  });
};

const getScreenShot = async (
~~~
  await page.goto(url);
  await activeAnimationItem(page); // add this
  await page.screenshot({
~~~
```

## todo

- add parallel worker option.
- add callback option for playwright operation when take screenshot.
