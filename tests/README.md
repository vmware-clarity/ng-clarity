# Screenshot tests within Clarity Angular

## Summary

This repo leverages screenshot testing to help validate all changes to the codebase. This gives the team
a pixel by pixel comparison of changes before and after a prospective PR is landed. The system works by
leveraging the existing Storybook implementation to both gather the stories to be tested (by scraping the
links in the side nav), and then navigating to the URL to take the screenshot.

_NOTE: Storybook stories should not name an exported story "Default". This name is excluded from screenshot
tests until all the stories are converted to CSFv3._

### Options

There is a [`screenshot-options.ts`](./screenshot-options.ts) file that can be used to force certain
behaviors during the screenshot test.

| Param                | Description                                                                                                                                                                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fullPageScreenshot` | Causes the screenshot test to manipulate the `body` element on the storybook preview page to match the `html` height. In some instances (dropdowns especially), some elements may appear outside of the `body` tag, so for this small subset of tests we can force the `body` tag to be as large as the `html` page. |
