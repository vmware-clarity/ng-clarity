/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule } from '@clr/angular';

@Component({
  selector: 'clr-combobox-multi-identity-fn-example',
  templateUrl: './multi-identity-fn.example.html',
  imports: [FormsModule, ClrComboboxModule],
})
export class ComboboxMultiIdentityFnExample {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];

  selection = [
    { id: 2, name: 'Bob' },
    { id: 4, name: 'Dave' },
  ];

  identityFn = (item: any) => {
    return item ? item.id : null;
  };
}
