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
    '<path d="M15.7545 14.4967H30.9673C31.517 14.4967 31.9668 14.0468 31.9668 13.4971C31.9668 12.9473 31.517 12.4975 30.9673 12.4975H17.7535L15.7545 14.4967ZM30.9873 20.4942H10.0172V22.4933H30.9873C31.537 22.4933 31.9868 22.0435 31.9868 21.4937C31.9868 20.944 31.537 20.4942 30.9873 20.4942ZM19.3328 7.61952C19.3328 7.31964 19.2128 7.02977 18.9929 6.81985C18.783 6.60994 18.5032 6.48999 18.2133 6.48999C17.9234 6.48999 17.6436 6.60994 17.4337 6.81985L9.3175 14.9665L5.90911 11.288C5.48931 10.8382 4.78964 10.8182 4.33985 11.228C3.89006 11.6478 3.87007 12.3475 4.27988 12.7974L9.25753 18.1451L19.0029 8.41919C19.2228 8.20927 19.3428 7.91939 19.3428 7.61952H19.3328ZM30.9873 28.4908H10.0172V30.49H30.9873C31.537 30.49 31.9868 30.0402 31.9868 29.4904C31.9868 28.9406 31.537 28.4908 30.9873 28.4908Z"/>',
};

export const checkboxListIconName = 'checkbox-list';
export const checkboxListIcon: IconShapeTuple = [checkboxListIconName, renderIcon(icon)];
