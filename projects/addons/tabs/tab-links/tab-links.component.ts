/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ZoomLevel } from '@clr/addons/a11y';
import { WorkflowStrings } from '@clr/addons/workflow/strings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    /** @deprecated Unused, kept so that subclasses calling `super(workflowStrings, cdr)` compile. */
    _cdr?: ChangeDetectorRef
  ) {}

  changeOpened(opened: boolean) {
    this.opened = opened;
    this.openedChange.emit(this.opened);
  }
}
