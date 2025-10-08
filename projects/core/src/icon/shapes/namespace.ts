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
    '<path d="M27,4.18a1,1,0,1,0-1,1.73l6,3.47V26.62l-6,3.47a1,1,0,0,0-.37,1.36,1,1,0,0,0,1.37.37l7-4.05V8.23Z"/><path d="M9.68,29.9,4,26.62V9.38L9.68,6.1a1,1,0,1,0-1-1.73L2,8.23V27.77l6.68,3.86a1,1,0,0,0,1.37-.37A1,1,0,0,0,9.68,29.9Z"/><path d="M10,12V24a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2H12A2,2,0,0,0,10,12Zm7,0v5H12V12Zm-5,7h5v5H12Zm7,5V19h5v5Zm5-7H19V12h5Z"/>',

  outlineAlerted:
    '<path d="M9.68,29.9,4,26.62V9.38L9.68,6.1a1,1,0,1,0-.93-1.77l-.07,0L2,8.23V27.77l6.68,3.86a1,1,0,0,0,1.37-.36h0A1,1,0,0,0,9.68,29.9Z"/><path d="M26,15.4H24V17H19V13.46A3.69,3.69,0,0,1,19,10H12a2,2,0,0,0-2,2V24a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2ZM17,24H12V19h5Zm0-7H12V12h5Zm7,7H19V19h5Z"/><path d="M32,15.4V26.62l-6,3.47a1,1,0,1,0,1,1.73h0l7-4.05V15.38l-.32,0Z"/>',

  outlineBadged:
    '<path d="M9.68,29.9,4,26.62V9.38L9.68,6.1a1,1,0,1,0-.93-1.77l-.07,0L2,8.23V27.77l6.68,3.86a1,1,0,0,0,1.37-.36h0A1,1,0,0,0,9.68,29.9Z"/><path d="M26,12.34A7.68,7.68,0,0,1,23.66,10H12a2,2,0,0,0-2,2V24a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2ZM17,24H12V19h5Zm0-7H12V12h5Zm7,7H19V19h5Zm0-7H19V12h5Z"/><path d="M32,26.62l-6,3.47a1,1,0,1,0,1,1.73h0l7-4.05V12.34a7.65,7.65,0,0,1-2,.88Z"/>',
};

export const namespaceIconName = 'namespace';
export const namespaceIcon: IconShapeTuple = [namespaceIconName, renderIcon(icon)];
