/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

interface ChartsAccessibilityExample {
  type: 'do' | 'dont';
  heading: string;
  caption: string;
  imageFilename: string;
  imageAlt: string;
}

@Component({
  selector: 'app-charts-accessibility',
  templateUrl: './charts-accessibility.html',
  styleUrl: './charts-accessibility.scss',
  standalone: false,
})
export class ChartsAccessibility {
  readonly patternsTexturesExamples: ChartsAccessibilityExample[] = [
    {
      type: 'do',
      heading: 'Textures, Shapes and Line Styles',
      caption:
        'Use textures to ensure differentiation between segments, explore the use of different line styles and shapes.',
      imageFilename: 'charts-accessibility-patterns-textures.svg',
      imageAlt: 'example of using both color and textures to convey information',
    },
    {
      type: 'dont',
      heading: "Don't Rely Solely on Color",
      caption: 'Avoid using color as the only means of conveying information.',
      imageFilename: 'charts-accessibility-only-color.svg',
      imageAlt: 'example of an accessibility violation by using only color to convey information',
    },
  ];

  readonly highContrastExamples: ChartsAccessibilityExample[] = [
    {
      type: 'do',
      heading: 'Check Contrast',
      caption:
        'Ensure different segments meet the contrast requirements of 3:1 ratio with the background. Use Clarity palettes in the provided order, as colors are ordered for optimal contrast and tested for different types of color blindness.',
      imageFilename: 'charts-accessibility-color-contrast-pass.svg',
      imageAlt: 'example of a passing color contrast test',
    },
    {
      type: 'do',
      heading: 'Stroke Contrast',
      caption:
        'Use the provided chart border tokens to ensure stroke usage has adequate contrast against the background.',
      imageFilename: 'charts-accessibility-stroke-contrast.svg',
      imageAlt: 'example of a stroke contrast',
    },
    {
      type: 'dont',
      heading: "Don't Use Problematic Color Pairs",
      caption:
        'Avoid colors that do not meet contrast requirements, and combinations that are difficult for color blind users to distinguish, such as red-green or blue-purple.',
      imageFilename: 'charts-accessibility-color-contrast-fail.svg',
      imageAlt: 'example of a failing color contrast test',
    },
  ];

  readonly informationOverloadExamples: ChartsAccessibilityExample[] = [
    {
      type: 'do',
      heading: 'Limit Colors',
      caption: 'Limit colors to 8 for optimal readability; avoid exceeding 16 colors.',
      imageFilename: 'charts-accessibility-color-limit.svg',
      imageAlt: 'example of using an "other" slice in a pie chart to limit the number of colors',
    },
    {
      type: 'dont',
      heading: "Don't Overload with Colors",
      caption:
        'Limit the number of colors used in a single visualization to avoid overwhelming users and ensure clarity.',
      imageFilename: 'charts-accessibility-color-overload.svg',
      imageAlt: 'example of using too many colors in a pie chart',
    },
  ];
}
