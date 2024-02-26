/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

type ScreenshotOptionsT = {
  [key: string]: { fullPageScreenshot: boolean };
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
export const ScreenshotOptions: ScreenshotOptionsT = {
  dropdown: {
    fullPageScreenshot: true,
  },
  'headers-static--variants': {
    fullPageScreenshot: true,
  },
  'signpost--opened': {
    fullPageScreenshot: true,
  },
  wizard: {
    fullPageScreenshot: true,
  },
};
