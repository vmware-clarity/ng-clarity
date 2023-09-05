/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

type ScreenshotOptionsT = {
  [key: string]: { fullPageScreenshot: boolean };
};

export const ScreenshotOptions: ScreenshotOptionsT = {
  dropdown: {
    fullPageScreenshot: true,
  },
  'headers-static--variants': {
    fullPageScreenshot: true,
  },
  wizard: {
    fullPageScreenshot: true,
  },
};
