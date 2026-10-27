/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrModalModule, ClrStackViewModule } from '@clr/angular';

interface StackViewItem {
  title: string;
  content: string;
  children?: StackViewItem[];
}

@Component({
  selector: 'clr-stack-view-modal-edit-example',
  templateUrl: './modal-edit.example.html',
  imports: [FormsModule, ClrModalModule, ClrStackViewModule],
})
export class StackViewModalEditExample {
  editModal = false;

  readonly blocks: StackViewItem[] = [
    { title: 'Label 1', content: 'Content 1' },
    {
      title: 'Label 2',
      content: 'Content 2',
      children: [
        { title: 'Sub-label 1', content: 'Sub-content 1' },
        { title: 'Sub-label 2', content: 'Sub-content 2' },
        { title: 'Sub-label 3', content: 'Sub-content 3' },
      ],
    },
    { title: 'Label 3', content: 'Content 3' },
  ];
}
