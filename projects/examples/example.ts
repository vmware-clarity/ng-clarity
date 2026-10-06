/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';

/**
 * The apps that render an example: the documentation website, the demo app (playground) and Storybook (visual tests).
 */
export type ExampleTarget = 'website' | 'demo' | 'storybook';

/**
 * The source of an example, in the shape the website shows it and opens it in StackBlitz:
 * the component is renamed to `ExampleComponent` and its files to `example.component.*`.
 */
export interface ExampleSource {
  html: string;
  ts: string;
  scss?: string;
  /** Whether the component class has members, so that its source is worth showing next to the template. */
  hasLogic: boolean;
}

export interface Example {
  /** Unique id, `<component>/<example>`. */
  id: string;
  title: string;
  targets: ExampleTarget[];
  component: Type<unknown>;
  source: ExampleSource;
  /** Whether the website shows the styles tab. Styles that only frame the example can be hidden. */
  showStyles: boolean;
}
