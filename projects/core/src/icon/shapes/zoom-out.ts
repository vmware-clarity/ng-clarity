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
    '<path d="M16.9942 4C9.8274 4 4 9.83208 4 17.0046C4 24.1772 9.8274 30.0093 16.9942 30.0093C24.161 30.0093 29.9884 24.1772 29.9884 17.0046C29.9884 9.83208 24.161 4 16.9942 4ZM16.9942 28.0086C10.9269 28.0086 5.99911 23.0768 5.99911 17.0046C5.99911 10.9325 10.9269 6.00071 16.9942 6.00071C23.0615 6.00071 27.9893 10.9325 27.9893 17.0046C27.9893 23.0768 23.0615 28.0086 16.9942 28.0086ZM22.9915 16.0043H10.9969C10.4471 16.0043 9.99732 16.4544 9.99732 17.0046C9.99732 17.5548 10.4471 18.005 10.9969 18.005H22.9915C23.5413 18.005 23.9911 17.5548 23.9911 17.0046C23.9911 16.4544 23.5413 16.0043 22.9915 16.0043ZM31.6976 30.2994L28.2692 26.8682C27.8294 27.3683 27.3596 27.8385 26.8598 28.2787L30.2883 31.7099C30.4882 31.91 30.7381 32 30.9979 32C31.2578 32 31.5077 31.9 31.7076 31.7099C32.0975 31.3198 32.0975 30.6895 31.7076 30.2994H31.6976Z"/>',
};

export const zoomOutIconName = 'zoom-out';
export const zoomOutIcon: IconShapeTuple = [zoomOutIconName, renderIcon(icon)];
