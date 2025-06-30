/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

type ScreenshotOptions = {
  [componentOrStoryName: string]: { fullPageScreenshot?: boolean; viewport?: { width: number; height: number } };
};

/**
 * This config is a rudimentary method of changing how the screenshots are taken for specific stories.
 * The only use, at the moment, is to enable the ability to take a full page screenshot,
 * as the default implementation only takes a screenshot of the body element and if the element being
 * tested extends beyond that element it will be clipped.
 *
 * Each key in the object below is either a component name or a story name. The case/spelling of the name
 * should come from the URL, see the examples below:
 *
 * /?path=/story/header-headers-static--header-static => component name: header, story name: headers-static--header-static
 * /?path=/story/datepicker-datepicker--datepicker => component name: datepicker, story name: datepicker--datepicker
 *
 * If a component name is used, all stories under that component name will use the options specified.
 */
export const screenshotOptions: ScreenshotOptions = {
  dropdown: {
    fullPageScreenshot: true,
  },
  'headers-static--header-static': {
    fullPageScreenshot: true,
  },
  'header--collapsed': {
    viewport: { width: 500, height: 300 },
  },
  'modal--open-small-modal': {
    fullPageScreenshot: true,
  },
  'modal--open-medium-modal': {
    fullPageScreenshot: true,
  },
  'modal--open-large-modal': {
    fullPageScreenshot: true,
  },
  'modal--open-extra-large-modal': {
    fullPageScreenshot: true,
  },
  'modal--open-full-screen-modal': {
    fullPageScreenshot: true,
  },
  'signpost--opened': {
    fullPageScreenshot: true,
  },
  'standard-alerts--with-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  'standard-alerts--with-long-content-and-open-actions-dropdown': {
    fullPageScreenshot: true,
  },
  wizard: {
    fullPageScreenshot: true,
  },
  'opened--datepicker': {
    fullPageScreenshot: true,
  },
  'opened--default-date': {
    fullPageScreenshot: true,
  },
  'opened--min-date': {
    fullPageScreenshot: true,
  },
  'opened--max-date': {
    fullPageScreenshot: true,
  },
  'opened--action-buttons': {
    fullPageScreenshot: true,
  },
  'opened--month-view': {
    fullPageScreenshot: true,
  },
  'opened--year-view': {
    fullPageScreenshot: true,
  },
  'opened--predefined-date-ranges-open': {
    fullPageScreenshot: true,
  },
};
