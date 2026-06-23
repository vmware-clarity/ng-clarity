/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ZoomLevel } from '@clr/addons/a11y';
import { WorkflowStrings } from '@clr/addons/workflow/strings';

@Component({
  selector: 'appfx-tab-links',
  standalone: false,
  templateUrl: 'tab-links.component.html',
  styleUrls: ['tab-links.component.scss'],
})
export class TabLinksComponent {
  @Input()
  @HostBinding('class.opened')
  opened = false;

  @Input() title?: string;

  @Output() openedChange = new EventEmitter<boolean>();

  currentZoomLevel = ZoomLevel.none;

  constructor(
    public workflowStrings: WorkflowStrings,
    private cdr: ChangeDetectorRef
  ) {}

  changeOpened(opened: boolean) {
    this.opened = opened;
    this.openedChange.emit(this.opened);
    this.cdr.detectChanges(); // without this HostBinding not working
  }
}
