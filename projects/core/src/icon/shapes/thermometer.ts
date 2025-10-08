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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M25 15C25.55 15 26 14.55 26 14C26 13.45 25.55 13 25 13H23.91V11H25C25.55 11 26 10.55 26 10C26 9.45 25.55 9 25 9H23.91V8C23.91 4.69 21.22 2 17.91 2C14.6 2 11.91 4.69 11.91 8V20.81C9.12997 24.07 9.40997 28.95 12.56 31.87C15.7 34.79 20.59 34.7 23.63 31.69C26.68 28.67 26.8 23.79 23.91 20.62V19.01H25C25.55 19.01 26 18.56 26 18.01C26 17.46 25.55 17.01 25 17.01H23.91V15.01H25V15ZM23.99 26C23.99 28.69 22.19 31.06 19.6 31.78C17 32.5 14.24 31.4 12.85 29.1C11.46 26.79 11.78 23.84 13.63 21.88L13.9 21.59V8C13.9 5.79 15.69 4 17.9 4C20.11 4 21.9 5.79 21.9 8V21.44L22.2 21.73C23.34 22.86 23.99 24.39 23.99 26ZM18.99 11.46V23.2C20.37 23.69 21.19 25.1 20.95 26.54C20.7 27.98 19.45 29.03 17.99 29.03C16.53 29.03 15.28 27.98 15.03 26.54C14.78 25.1 15.61 23.69 16.99 23.2V11.46H18.99Z"/>',
};

export const thermometerIconName = 'thermometer';
export const thermometerIcon: IconShapeTuple = [thermometerIconName, renderIcon(icon)];
