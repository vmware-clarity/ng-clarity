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
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M22.1863 17.7197C23.8837 16.9491 24.9672 15.1914 24.9314 13.2664V13.2052C24.9594 11.9647 24.4949 10.7669 23.6471 9.89328C22.261 8.63724 20.4525 8.00331 18.6177 8.13029H11.755C11.2935 8.10779 10.8436 8.28423 10.5114 8.61795C10.1792 8.95168 9.99423 9.41311 10.0001 9.89328V26.341C9.99483 26.813 10.1728 27.2672 10.4939 27.6009C10.815 27.9347 11.252 28.1197 11.706 28.1142H18.8922C23.1765 28.1142 26 26.1984 26 22.6316V22.5705C26 19.8598 24.4412 18.5146 22.1863 17.7197ZM13.6079 11.4626H18.0589C20.0196 11.4626 21.1471 12.3696 21.1471 13.8371V13.8982C21.1471 15.6102 19.8138 16.4357 17.8334 16.4357H13.6079V11.4626ZM18.7353 24.7411C20.8432 24.7411 22.1275 23.8851 22.1275 22.2647V22.2545C22.1275 20.7361 20.951 19.8394 18.5098 19.8394H13.6079V24.7411H18.7353Z"/>',
};

export const boldIconName = 'bold';
export const boldIcon: IconShapeTuple = [boldIconName, renderIcon(icon)];
