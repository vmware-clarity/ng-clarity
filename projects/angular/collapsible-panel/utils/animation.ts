/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrAnimationTransitionMetadata,
  ClrAnimationTriggerMetadata,
  defaultAnimationTiming,
} from '@clr/angular/utils';

// The objects below are the ones `trigger()`, `transition()`, `style()` and `animate()` of `@angular/animations`
// return (see `ClrAnimationStyles`), written out so that Clarity does not need that package.

/**
 * @deprecated Clarity panels animate with native CSS; see the `CollapsiblePanel` documentation for the expected
 * template and the `clr-collapsible-panel-collapsing` class.
 */
export const skipInitialRenderTrigger: ClrAnimationTriggerMetadata = {
  type: 7,
  name: 'skipInitialRender',
  definitions: [{ type: 1, expr: ':enter', animation: [], options: null }],
  options: {},
};

/** @deprecated see {@link skipInitialRenderTrigger} */
export const panelExpandTransition: ClrAnimationTransitionMetadata = {
  type: 1,
  expr: 'void => *',
  animation: [
    { type: 6, styles: { display: 'block', height: 0 }, offset: null },
    { type: 4, timings: defaultAnimationTiming, styles: { type: 6, styles: { height: '*' }, offset: null } },
  ],
  options: null,
};

/** @deprecated see {@link skipInitialRenderTrigger} */
export const panelCollapseTransition: ClrAnimationTransitionMetadata = {
  type: 1,
  expr: '* => void',
  animation: [
    { type: 6, styles: { display: 'block' }, offset: null },
    {
      type: 4,
      timings: defaultAnimationTiming,
      styles: { type: 6, styles: { height: 0, display: 'none' }, offset: null },
    },
  ],
  options: null,
};

/** @deprecated see {@link skipInitialRenderTrigger} */
export const collapsiblePanelExpandAnimation: ClrAnimationTriggerMetadata[] = [
  skipInitialRenderTrigger,
  { type: 7, name: 'toggle', definitions: [panelExpandTransition], options: {} },
];

/** @deprecated see {@link skipInitialRenderTrigger} */
export const collapsiblePanelAnimation: ClrAnimationTriggerMetadata[] = [
  skipInitialRenderTrigger,
  { type: 7, name: 'toggle', definitions: [panelExpandTransition, panelCollapseTransition], options: {} },
];
