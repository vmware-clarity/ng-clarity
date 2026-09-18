/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ScreenshotOptions } from './helpers/screenshot-options.interface';

/**
 * This config is a rudimentary method of changing how the screenshots are taken for specific stories.
 * The only use, at the moment, is to enable the ability to take a full page screenshot,
 * as the default implementation only takes a screenshot of the body element and if the element being
 * tested extends beyond that element it will be clipped.
 *
 * Keys are derived from the story file's path under `.storybook/stories/`, not from the story's
 * `title` — see the comment in tests/visual-snapshots.spec.ts. There are two forms:
 *
 *   `<group>`                        the story file's directory; applies to every story in it
 *   `<group>/<file>--<story-name>`   one story
 *
 * For example, `.storybook/stories/components/forms/datepicker/datepicker-opened.stories.ts`
 * exporting `MonthView`:
 *
 *   `components/forms/datepicker`
 *       -> every story under stories/components/forms/datepicker/
 *   `components/forms/datepicker/datepicker-opened--month-view`
 *       -> that one story
 *
 * The matching snapshot lands at `tests/snapshots/<browser>/<key>-<theme>-<density>.png`, so a key
 * can be read straight off a snapshot path (and vice versa).
 */
export const screenshotOptions: ScreenshotOptions = {
  'components/overlays/popover/popover--popover': {
    // The popover overlay attaches asynchronously after the story renders; on slow machines
    // the screenshot occasionally caught the story before the overlay appeared.
    waitForSelectors: ['#hello_world'],
  },
  'addons/dialog/dialog--default': {
    fullPageScreenshot: true,
  },
  'addons/dialog/dialog--vertical-tabs': {
    fullPageScreenshot: true,
  },
  'addons/dialog/dialog--submit-default': {
    fullPageScreenshot: true,
  },
  // The old flat `dropdown/` directory is now two groups; both keep the full-page screenshot.
  'components/overlays/dropdown': {
    fullPageScreenshot: true,
  },
  'patterns/dropdown-combinations': {
    fullPageScreenshot: true,
  },
  'components/navigation/header/header-static--header-static': {
    fullPageScreenshot: true,
  },
  'components/forms/combobox/combobox--loading': {
    fullPageScreenshot: true,
  },
  'components/forms/combobox/combobox--no-results': {
    fullPageScreenshot: true,
  },
  'components/forms/combobox/combobox--opened': {
    fullPageScreenshot: true,
  },
  'components/forms/combobox/combobox--opened-multi-line-items': {
    fullPageScreenshot: true,
  },
  'components/navigation/header/header--collapsed': {
    viewport: { width: 500, height: 300 },
  },
  'components/timeline/timeline--horizontal-layout-with-long-text': {
    viewport: { width: 1000, height: 400 },
  },
  'components/navigation/header/header-responsive-nav--level-1-nav-open': {
    viewport: { width: 500, height: 400 },
    fullPageScreenshot: true,
  },
  'components/navigation/header/header-responsive-nav--level-2-nav-open': {
    viewport: { width: 500, height: 400 },
    fullPageScreenshot: true,
  },
  'patterns/application-layout/application-layout--default': {
    exclude: true,
  },
  'patterns/application-layout/application-layout--first-navigation-only': {
    fullPageScreenshot: true,
  },
  'patterns/application-layout/application-layout--no-navigations': {
    fullPageScreenshot: true,
  },
  'components/overlays/modal/modal--open-small-modal': {
    fullPageScreenshot: true,
  },
  'components/overlays/modal/modal--open-medium-modal': {
    fullPageScreenshot: true,
  },
  'components/overlays/modal/modal--open-large-modal': {
    fullPageScreenshot: true,
  },
  'components/overlays/modal/modal--open-extra-large-modal': {
    fullPageScreenshot: true,
  },
  'components/overlays/modal/modal--open-full-screen-modal': {
    fullPageScreenshot: true,
  },
  'components/signpost/signpost--opened': {
    fullPageScreenshot: true,
  },
  'components/alert/standard-alert--with-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  'components/alert/standard-alert--with-long-content-and-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  'components/flows/wizard': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--datepicker': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--default-date': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--min-date': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--max-date': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--action-buttons': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--month-view': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--year-view': {
    fullPageScreenshot: true,
  },
  'components/forms/datepicker/datepicker-opened--predefined-date-ranges-open': {
    fullPageScreenshot: true,
  },
};
