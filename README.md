# crawler

create image diff that local preview and staging.

## setup

1. `pnpm install`
2. `npx playwright install`
3. define `targets.yaml` for crawler targets

## exec

1. `pnpm run crawler` for get screenshot
2. if you need all pixel diff image, run `pnpm run resize`
3. `pnpm run diff` for create screenshot diff

## todo

- add parallel worker option.
- add callback option for playwright operation when take screenshot.
