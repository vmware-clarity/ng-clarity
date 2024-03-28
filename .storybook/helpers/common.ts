/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryContext } from '@storybook/angular';

export const CommonModules = [CommonModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule];

export function removeFocusOutline({ canvasElement }: StoryContext) {
  // remove keyboard focus outline from focused element (modal title, etc.)
  canvasElement.querySelector<HTMLElement>(':focus')?.blur();
}
