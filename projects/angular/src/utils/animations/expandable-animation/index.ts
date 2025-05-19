/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';

import { ClrExpandableAnimation } from './expandable-animation';
import { ClrExpandableAnimationDirective } from './expandable-animation.directive';

export * from './expandable-animation';

export const EXPANDABLE_ANIMATION_DIRECTIVES: Type<any>[] = [ClrExpandableAnimation, ClrExpandableAnimationDirective];
