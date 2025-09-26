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
    '<path d="M27.6504 15.6341L17.9951 6L8.33981 15.6341C8.02869 15.8717 7.88432 16.2695 7.9703 16.6521C8.05629 17.0347 8.35685 17.3319 8.73952 17.4127C9.12219 17.4935 9.51667 17.343 9.74912 17.0276L16.9956 9.81955V28.9975C16.9956 29.5512 17.4431 30 17.9951 30C18.5471 30 18.9946 29.5512 18.9946 28.9975V9.81955L26.2411 17.0276C26.633 17.4179 27.2662 17.4157 27.6554 17.0226C28.0445 16.6295 28.0423 15.9943 27.6504 15.604V15.6341Z"/>',
};

export const arrowIconName = 'arrow';
export const arrowIcon: IconShapeTuple = [arrowIconName, renderIcon(icon)];
