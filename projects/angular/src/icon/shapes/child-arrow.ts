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
    '<path d="M31.6976 24.2973L25.7003 18.2951C25.3105 17.905 24.6808 17.905 24.2909 18.2951C23.9011 18.6852 23.9011 19.3155 24.2909 19.7056L28.579 23.9971H8.99777C7.34851 23.9971 5.99911 22.7367 5.99911 21.1861V5.00036C5.99911 4.45016 5.54931 4 4.99955 4C4.4498 4 4 4.45016 4 5.00036V21.1961C4 23.8471 6.239 26.0079 8.99777 26.0079H28.579L24.2909 30.2994C23.9011 30.6895 23.9011 31.3198 24.2909 31.7099C24.4909 31.91 24.7407 32 25.0006 32C25.2605 32 25.5104 31.9 25.7103 31.7099L31.7076 25.7078C32.0975 25.3176 32.0975 24.6874 31.7076 24.2973H31.6976Z"/>',
};

export const childArrowIconName = 'child-arrow';
export const childArrowIcon: IconShapeTuple = [childArrowIconName, renderIcon(icon)];
