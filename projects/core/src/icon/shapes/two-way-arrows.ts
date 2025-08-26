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
    '<path d="M6.69971 11.7151L12.5973 17.7189C12.7872 17.919 13.0371 18.0091 13.297 18.0091C13.5569 18.0091 13.7968 17.909 13.9967 17.7189C14.3765 17.3286 14.3765 16.6982 13.9967 16.308L9.77843 12.0153H29.0204C29.5602 12.0153 30 11.565 30 11.0147C30 10.4643 29.5602 10.0141 29.0204 10.0141H9.75843L13.9767 5.71138C14.3565 5.32113 14.3565 4.69074 13.9767 4.3005C13.5968 3.91025 12.9671 3.91025 12.5873 4.3005L6.69971 10.2942L6.01 11.0047L6.69971 11.7151ZM29.3003 24.313L23.4027 18.3093C23.0229 17.919 22.3932 17.919 22.0133 18.3093C21.6335 18.6995 21.6335 19.3299 22.0133 19.7201L26.2316 24.0128H6.97959C6.43982 24.0128 6 24.4631 6 25.0134C6 25.5638 6.43982 26.0141 6.97959 26.0141H26.2216L22.0033 30.3067C21.6235 30.697 21.6235 31.3274 22.0033 31.7176C22.1933 31.9178 22.4431 32.0078 22.703 32.0078C22.9629 32.0078 23.2028 31.9078 23.4027 31.7176L29.3003 25.7139L29.99 25.0034L29.3003 24.293V24.313Z"/>',
};

export const twoWayArrowsIconName = 'two-way-arrows';
export const twoWayArrowsIcon: IconShapeTuple = [twoWayArrowsIconName, renderIcon(icon)];
