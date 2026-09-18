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
 * For example, `.storybook/stories/datepicker/datepicker-opened.stories.ts` exporting `MonthView`:
 *
 *   `datepicker`                                -> every story under stories/datepicker/
 *   `datepicker/datepicker-opened--month-view`  -> that one story
 *
 * The matching snapshot lands at `tests/snapshots/<browser>/<key>-<theme>-<density>.png`, so a key
 * can be read straight off a snapshot path (and vice versa).
 */
export const screenshotOptions: ScreenshotOptions = {
  'popover/popover--popover': {
    // The popover overlay attaches asynchronously after the story renders; on slow machines
    // the screenshot occasionally caught the story before the overlay appeared.
    waitForSelectors: ['#hello_world'],
  },
  'addons/dialog--default': {
    fullPageScreenshot: true,
  },
  'addons/dialog--vertical-tabs': {
    fullPageScreenshot: true,
  },
  'addons/dialog--submit-default': {
    fullPageScreenshot: true,
  },
  dropdown: {
    fullPageScreenshot: true,
  },
  'header/header-static--header-static': {
    fullPageScreenshot: true,
  },
  'combobox/combobox--loading': {
    fullPageScreenshot: true,
  },
  'combobox/combobox--no-results': {
    fullPageScreenshot: true,
  },
  'combobox/combobox--opened': {
    fullPageScreenshot: true,
  },
  'combobox/combobox--opened-multi-line-items': {
    fullPageScreenshot: true,
  },
  'header/header--collapsed': {
    viewport: { width: 500, height: 300 },
  },
  'timeline/timeline--horizontal-layout-with-long-text': {
    viewport: { width: 1000, height: 400 },
  },
  'header/header-responsive-nav--level-1-nav-open': {
    viewport: { width: 500, height: 400 },
    fullPageScreenshot: true,
  },
  'header/header-responsive-nav--level-2-nav-open': {
    viewport: { width: 500, height: 400 },
    fullPageScreenshot: true,
  },
  'layout/application-layout--default': {
    exclude: true,
  },
  'layout/application-layout--first-navigation-only': {
    fullPageScreenshot: true,
  },
  'layout/application-layout--no-navigations': {
    fullPageScreenshot: true,
  },
  'modal/modal--open-small-modal': {
    fullPageScreenshot: true,
  },
  'modal/modal--open-medium-modal': {
    fullPageScreenshot: true,
  },
  'modal/modal--open-large-modal': {
    fullPageScreenshot: true,
  },
  'modal/modal--open-extra-large-modal': {
    fullPageScreenshot: true,
  },
  'modal/modal--open-full-screen-modal': {
    fullPageScreenshot: true,
  },
  'signpost/signpost--opened': {
    fullPageScreenshot: true,
  },
  'alert/standard-alert--with-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  'alert/standard-alert--with-long-content-and-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  wizard: {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--datepicker': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--default-date': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--min-date': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--max-date': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--action-buttons': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--month-view': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--year-view': {
    fullPageScreenshot: true,
  },
  'datepicker/datepicker-opened--predefined-date-ranges-open': {
    fullPageScreenshot: true,
  },
};
