/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  animationAnimate,
  animationStyle,
  animationTransition,
  animationTrigger,
  ClrAnimationTransitionMetadata,
  ClrAnimationTriggerMetadata,
  defaultAnimationTiming,
} from '@clr/angular/utils';

/**
 * @deprecated Clarity panels animate with native CSS; see the `CollapsiblePanel` documentation for the expected
 * template and the `clr-collapsible-panel-expanding` / `clr-collapsible-panel-collapsing` classes.
 */
export const skipInitialRenderTrigger: ClrAnimationTriggerMetadata = animationTrigger('skipInitialRender', [
  animationTransition(':enter', []),
]);

/** @deprecated see {@link skipInitialRenderTrigger} */
export const panelExpandTransition: ClrAnimationTransitionMetadata = animationTransition('void => *', [
  animationStyle({ display: 'block', height: 0 }),
  animationAnimate(defaultAnimationTiming, animationStyle({ height: '*' })),
]);

/** @deprecated see {@link skipInitialRenderTrigger} */
export const panelCollapseTransition: ClrAnimationTransitionMetadata = animationTransition('* => void', [
  animationStyle({ display: 'block' }),
  animationAnimate(defaultAnimationTiming, animationStyle({ height: 0, display: 'none' })),
]);

/** @deprecated see {@link skipInitialRenderTrigger} */
export const collapsiblePanelExpandAnimation: ClrAnimationTriggerMetadata[] = [
  skipInitialRenderTrigger,
  animationTrigger('toggle', [panelExpandTransition]),
];

/** @deprecated see {@link skipInitialRenderTrigger} */
export const collapsiblePanelAnimation: ClrAnimationTriggerMetadata[] = [
  skipInitialRenderTrigger,
  animationTrigger('toggle', [panelExpandTransition, panelCollapseTransition]),
];
