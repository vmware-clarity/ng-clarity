/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DefaultButton } from '@clr/addons/dialog';
import { CloseHandler, ModelChange, Step, TabLayout, WorkflowModel } from '@clr/addons/var';

@Component({
  selector: 'appfx-dialog',
  standalone: false,
  template: '',
})
export class MockAppfxDialogComponent {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() size: string;
  @Input() height: string;
  @Input() defaultButton: DefaultButton;
  @Input() cancelButtonLabel: string;
  @Input() okButtonLabel: string;
  @Input() tabLayout: TabLayout;
  @Input() disableTabsContent: boolean;
  @Input() loading: boolean;
  @Input() steps: Step[];
  @Input() model: WorkflowModel;
  @Input() closeHandler: CloseHandler;
  @Input() showTabLinks: boolean;
  @Input() opened: boolean;

  @Output() readonly onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() openedChange = new EventEmitter<boolean>();
}

@Component({
  selector: 'appfx-dialog',
  standalone: true,
  template: '',
})
export class MockAppfxDialogStandaloneComponent extends MockAppfxDialogComponent {}
