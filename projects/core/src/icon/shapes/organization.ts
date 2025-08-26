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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M13 13H23C24.1046 13 25 12.1046 25 11V5C25 3.89543 24.1046 3 23 3H13C11.8954 3 11 3.89543 11 5V11C11 12.1046 11.8954 13 13 13ZM13 5H23V11H13V5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22 23H32C33.1046 23 34 23.8954 34 25V31C34 32.1046 33.1046 33 32 33H22C20.8954 33 20 32.1046 20 31V25C20 23.8954 20.8954 23 22 23ZM22 31V25H32V31H22Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4 23H14C15.1046 23 16 23.8954 16 25V31C16 32.1046 15.1046 33 14 33H4C2.89543 33 2 32.1046 2 31V25C2 23.8954 2.89543 23 4 23ZM4 31V25H14V31H4Z"/><path d="M26.2 18.8H9.8V21.88H8.2V17.2H17.2V14H18.8V17.2H27.8V21.88H26.2V18.8Z"/>',

  solid:
    '<path d="M13 3C11.8954 3 11 3.89543 11 5V11C11 12.1046 11.8954 13 13 13H23C24.1046 13 25 12.1046 25 11V5C25 3.89543 24.1046 3 23 3H13Z"/><path d="M22 23C20.8954 23 20 23.8954 20 25V31C20 32.1046 20.8954 33 22 33H32C33.1046 33 34 32.1046 34 31V25C34 23.8954 33.1046 23 32 23H22Z"/><path d="M2 25C2 23.8954 2.89543 23 4 23H14C15.1046 23 16 23.8954 16 25V31C16 32.1046 15.1046 33 14 33H4C2.89543 33 2 32.1046 2 31V25Z"/><path d="M26.2 18.8H9.8V21.88H8.2V17.2H17.2V14H18.8V17.2H27.8V21.88H26.2V18.8Z"/>',
};

export const organizationIconName = 'organization';
export const organizationIcon: IconShapeTuple = [organizationIconName, renderIcon(icon)];
