/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoryContext } from '@storybook/angular';

export const CommonModules = [CommonModule, FormsModule, ReactiveFormsModule];

export function removeFocusOutline({ canvasElement }: Pick<StoryContext, 'canvasElement'>) {
  // remove keyboard focus outline from focused element (e.g. modal title)
  canvasElement.querySelector<HTMLElement>(':focus')?.blur();
}

export function createArray(n: number): any[] {
  return new Array(n);
}
