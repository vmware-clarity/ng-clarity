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
    '<path d="M24.8546 8.00489H17.8524C17.4523 7.96489 17.0722 8.16489 16.8621 8.52489C16.652 8.88489 16.652 9.32489 16.8621 9.68489C17.0722 10.0449 17.4623 10.2349 17.8524 10.1949H19.893L13.6811 25.8049H11.1503C10.7502 25.7649 10.3701 25.9649 10.16 26.3249C9.94993 26.6849 9.94993 27.1249 10.16 27.4849C10.3701 27.8449 10.7602 28.0349 11.1503 27.9949H18.1625C18.5626 28.0349 18.9427 27.8349 19.1528 27.4849C19.3629 27.1249 19.3629 26.6849 19.1528 26.3249C18.9427 25.9649 18.5526 25.7749 18.1625 25.8049H15.9718L22.1938 10.2049H24.8546C25.2547 10.2449 25.6348 10.0449 25.8449 9.69489C26.055 9.33489 26.055 8.89489 25.8449 8.53489C25.6348 8.17489 25.2447 7.98489 24.8546 8.01489V8.00489Z"/>',
};

export const italicIconName = 'italic';
export const italicIcon: IconShapeTuple = [italicIconName, renderIcon(icon)];
