/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

export abstract class FocusableItem {
  id: string;
  disabled?: boolean;

  up?: FocusableItem | Observable<FocusableItem>;
  down?: FocusableItem | Observable<FocusableItem>;
  left?: FocusableItem | Observable<FocusableItem>;
  right?: FocusableItem | Observable<FocusableItem>;

  abstract focus(): void;
  abstract blur(): void;
  abstract activate?(): void;
}
