/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

/**
 * Close handler for Dialog and Wizard.
 */
export interface CloseHandler {
  /**
   * Invoked when Dialog/Wizard is closed by clicking OK/Finish button
   * Dialog/Wizard will wait for the result of the Observable, then the dialog will be closed.
   */
  onSubmit: () => Observable<any>;

  /**
   * Invoked when Dialog/Wizard is closed by clicking Cancel button
   */
  onCancel?: () => Observable<any>;
}
