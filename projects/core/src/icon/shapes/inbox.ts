/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer.js';
import { IconShapeTuple } from '../interfaces/icon.interfaces.js';

const icon = {
  outline:
    '<path d="M12.29 12.95C11.91 13.33 11.91 13.95 12.29 14.34L18.02 20.05L23.77 14.35C24.11 13.96 24.08 13.38 23.72 13.01C23.35 12.65 22.77 12.62 22.37 12.96L19.02 16.28V2.98C19.02 2.44 18.58 2 18.03 2C17.48 2 17.04 2.44 17.04 2.98V16.3L13.69 12.97C13.31 12.59 12.7 12.58 12.31 12.94L12.29 12.95ZM28.5 6H22V8H28V22H22C22 24.21 20.21 26 18 26C15.79 26 14 24.21 14 22H8V8H14V6H7.5C6.67 6 6 6.67 6 7.5V32.5C6 33.33 6.67 34 7.5 34H28.5C29.33 34 30 33.33 30 32.5V7.5C30 6.67 29.33 6 28.5 6ZM28 31V32H8V24H12.35C13.18 26.33 15.39 28 18 28C20.61 28 22.82 26.33 23.65 24H28V31Z"/>',

  outlineBadged:
    '<path d="M30 11C32.7614 11 35 8.76142 35 6C35 3.23858 32.7614 1 30 1C27.2386 1 25 3.23858 25 6C25 8.76142 27.2386 11 30 11Z"/><path d="M23 6H22V8H23.2899C23.1013 7.36629 23 6.69497 23 6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M28 12.7101C28.6337 12.8987 29.305 13 30 13V32.5C30 33.33 29.33 34 28.5 34H7.5C6.67 34 6 33.33 6 32.5V7.5C6 6.67 6.67 6 7.5 6H14V8H8V22H14C14 24.21 15.79 26 18 26C20.21 26 22 24.21 22 22H28V12.7101ZM28 32V24H23.65C22.82 26.33 20.61 28 18 28C15.39 28 13.18 26.33 12.35 24H8V32H28Z"/><path d="M12.29 14.34C11.91 13.95 11.91 13.33 12.29 12.95L12.31 12.94C12.7 12.58 13.31 12.59 13.69 12.97L17.04 16.3V2.98C17.04 2.44 17.48 2 18.03 2C18.58 2 19.02 2.44 19.02 2.98V16.28L22.37 12.96C22.77 12.62 23.35 12.65 23.72 13.01C24.08 13.38 24.11 13.96 23.77 14.35L18.02 20.05L12.29 14.34Z"/>',
};

export const inboxIconName = 'inbox';
export const inboxIcon: IconShapeTuple = [inboxIconName, renderIcon(icon)];
