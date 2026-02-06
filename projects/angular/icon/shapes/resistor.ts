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
    '<path d="M28.7284 28C28.2682 28 27.8581 27.68 27.758 27.23L24.447 13.32L21.136 27.23C21.0259 27.68 20.6258 28 20.1657 28C19.7055 28 19.2954 27.68 19.1954 27.23L15.8843 13.32L12.5733 27.23C12.4633 27.68 12.0631 28 11.603 28C11.1429 28 10.7327 27.68 10.6327 27.23L7.27165 13.12C6.88153 14.64 6.43138 16.45 6.00125 18.23C5.89122 18.68 5.49109 19 5.03095 19H3.00031C2.45014 19 2 18.55 2 18C2 17.45 2.45014 17 3.00031 17H4.21069C5.22101 12.83 6.31135 8.78 6.32135 8.74C6.44139 8.3 6.85152 8.01 7.30166 8C7.7618 8 8.15192 8.32 8.26196 8.77L11.583 22.69L14.894 8.77C15.0041 8.32 15.4042 8 15.8643 8C16.3245 8 16.7346 8.32 16.8346 8.77L20.1457 22.68L23.4667 8.77C23.5767 8.32 23.9769 8 24.437 8C24.8972 8 25.3073 8.32 25.4073 8.77L28.7183 22.68L29.8987 17.71C30.0088 17.26 30.4089 16.94 30.869 16.94H32.9997C33.5499 16.94 34 17.39 34 17.94C34 18.49 33.5499 18.94 32.9997 18.94H31.6593L29.6887 27.23C29.5786 27.68 29.1785 28 28.7183 28H28.7284Z"/>',
};

export const resistorIconName = 'resistor';
export const resistorIcon: IconShapeTuple = [resistorIconName, renderIcon(icon)];
