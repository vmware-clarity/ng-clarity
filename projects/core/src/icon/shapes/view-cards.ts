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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M32 17H21C19.8954 17 19 16.1046 19 15V8C19 6.89543 19.8954 6 21 6H32C33.1046 6 34 6.89543 34 8V15C34 16.1046 33.1046 17 32 17ZM15 30H4C2.89543 30 2 29.1046 2 28V21C2 19.8954 2.89543 19 4 19H15C16.1046 19 17 19.8954 17 21V28C17 29.1046 16.1046 30 15 30ZM21 30H32C33.1046 30 34 29.1046 34 28V21C34 19.8954 33.1046 19 32 19H21C19.8954 19 19 19.8954 19 21V28C19 29.1046 19.8954 30 21 30ZM21 28V21H32V28H21ZM4 28V21H15V28H4ZM21 15V8H32V15H21ZM15 17H4C2.89543 17 2 16.1046 2 15V8C2 6.89543 2.89543 6 4 6H15C16.1046 6 17 6.89543 17 8V15C17 16.1046 16.1046 17 15 17ZM4 15V8H15V15H4Z"/>',
};

export const viewCardsIconName = 'view-cards';
export const viewCardsIcon: IconShapeTuple = [viewCardsIconName, renderIcon(icon)];
