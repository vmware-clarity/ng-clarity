/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, style, transition, trigger } from '@angular/animations';
import { defaultAnimationTiming } from '@clr/angular/utils';

export const skipInitialRenderTrigger = trigger('skipInitialRender', [transition(':enter', [])]);

export const panelExpandTransition = transition('void => *', [
  style({ display: 'block', height: 0 }),
  animate(defaultAnimationTiming, style({ height: '*' })),
]);

export const panelCollapseTransition = transition('* => void', [
  style({ display: 'block' }),
  animate(defaultAnimationTiming, style({ height: 0, display: 'none' })),
]);

export const collapsiblePanelExpandAnimation = [skipInitialRenderTrigger, trigger('toggle', [panelExpandTransition])];

export const collapsiblePanelAnimation = [
  skipInitialRenderTrigger,
  trigger('toggle', [panelExpandTransition, panelCollapseTransition]),
];
