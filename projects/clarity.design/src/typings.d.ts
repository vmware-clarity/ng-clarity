/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

declare module '*.html' {
  let _: string;
  export default _;
}
declare module '!raw-loader!*' {
  const contents: string;
  export = contents;
}

interface Window {
  ClarityIcons: any;
  gtag: any;
  trackSurveyAlert(eventLabel: string, externalLink?: boolean): void;
  trackIconSearch(searchedIcon: string, numberOfMatches: number): void;
}
