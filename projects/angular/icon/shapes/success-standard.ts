/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from '../icon.renderer';
import { IconShapeTuple } from '../interfaces/icon.interfaces';

const icon = {
  outline:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM18 32C10.268 32 4 25.732 4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18C32 21.713 30.525 25.274 27.8995 27.8995C25.274 30.525 21.713 32 18 32ZM26.59 12.1C26.98 11.7123 27.61 11.7123 28 12.1C28.1893 12.2878 28.2958 12.5434 28.2958 12.81C28.2958 13.0766 28.1893 13.3322 28 13.52L15.49 26L8 18.53C7.61892 18.1185 7.64355 17.4761 8.055 17.095C8.46645 16.7139 9.10892 16.7385 9.49 17.15L15.49 23.15L26.59 12.1Z"/>',
  solid:
    '<path d="M29.31 6.69C26.31 3.69 22.24 2 18 2C9.16 2 2 9.16 2 18C2 26.84 9.16 34 18 34C26.84 34 34 26.84 34 18C34 13.76 32.31 9.69 29.31 6.69ZM28.14 13.64L15.63 26.12L15.49 26.26L15.35 26.12L7.85 18.64C7.39 18.15 7.42 17.38 7.92 16.92C8.15 16.71 8.44 16.6 8.75 16.6C9.09 16.6 9.41 16.74 9.64 16.98L15.5 22.84L26.46 11.93C26.69 11.7 26.99 11.58 27.31 11.58C27.63 11.58 27.93 11.7 28.16 11.93C28.39 12.15 28.51 12.46 28.51 12.78C28.51 13.1 28.38 13.41 28.16 13.63L28.14 13.64Z"/>',
};

export const successStandardIconName = 'success-standard';
export const successStandardIcon: IconShapeTuple = [successStandardIconName, renderIcon(icon)];
