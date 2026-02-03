/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken } from '@angular/core';

// Injectable service contract for app-specific code that can log and present error notifications
export const appfxDatagridErrorNotifiableToken = new InjectionToken<ErrorNotifiable>(
  'notifier service that presents errors whenever an unrecoverable event occurs within grid'
);

// Interface defining the contract for services that can dispatch error notifications.
export interface ErrorNotifiable {
  notifyError(title: string, message: string): void;
}
