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
    '<path d="M24.9429 4.21837C24.5519 3.83153 23.9202 3.83375 23.5319 4.22333C23.1436 4.61291 23.1459 5.24232 23.5369 5.62916L29.0811 11.0836H16.118C10.9753 10.9771 6.44905 14.4455 5.2325 19.4252C4.01595 24.4049 6.4359 29.5579 11.0524 31.8183C11.5536 32.0734 12.1675 31.8755 12.4235 31.3762C12.6796 30.8768 12.481 30.2652 11.9798 30.0101C8.94571 28.5103 7.01747 25.4364 6.994 22.0619C7.03788 17.0913 11.1091 13.0927 16.0981 13.1203H29.0612L23.5369 18.5648C23.3055 18.9625 23.3782 19.4664 23.7127 19.7831C24.0471 20.0998 24.556 20.1465 24.9429 19.8961L32.9202 12.0373L24.9429 4.21837Z"/>',
};

export const redoIconName = 'redo';
export const redoIcon: IconShapeTuple = [redoIconName, renderIcon(icon)];
