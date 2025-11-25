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
    '<path d="M28.3491 17.8996C28.5384 18.0837 28.7945 18.1863 29.061 18.1848C29.464 18.1831 29.8268 17.9451 29.9821 17.5805C30.1374 17.2158 30.055 16.7955 29.7729 16.5133L18.0318 5L6.30067 16.5133C5.95999 16.9034 5.98289 17.4849 6.35325 17.8481C6.7236 18.2112 7.3166 18.2337 7.71442 17.8996L18.0318 7.78246L28.3491 17.8996Z"/><path d="M28.3491 28.7149C28.5384 28.8989 28.7945 29.0015 29.061 29C29.464 28.9984 29.8268 28.7603 29.9821 28.3957C30.1374 28.0311 30.055 27.6107 29.7729 27.3285L18.0318 15.8152L6.30067 27.3285C5.95999 27.7186 5.98289 28.3001 6.35325 28.6633C6.7236 29.0265 7.3166 29.0489 7.71442 28.7149L18.0318 18.5977L28.3491 28.7149Z"/>',
};

export const angleDoubleIconName = 'angle-double';
export const angleDoubleIcon: IconShapeTuple = [angleDoubleIconName, renderIcon(icon)];
