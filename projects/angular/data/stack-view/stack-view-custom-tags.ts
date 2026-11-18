/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Directive, Input, OnInit, signal } from '@angular/core';
import { uniqueIdFactory } from '@clr/angular/utils';

@Directive({
  selector: 'clr-stack-content',
  standalone: false,
})
export class ClrStackViewCustomTags {
  // No behavior
  // The only purpose is to "declare" the tag in Angular
}

@Component({
  selector: 'clr-stack-label',
  template: '<ng-content></ng-content>',
  host: {
    '[attr.id]': 'id',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrStackViewLabel implements OnInit {
  private _generatedId: string = null;

  private readonly _id = signal<string>(null);

  @Input()
  get id() {
    return this._id();
  }
  set id(val: string) {
    if (typeof val === 'string' && val !== '') {
      this._id.set(val);
    } else {
      this._id.set(this._generatedId + '');
    }
  }

  ngOnInit() {
    this._generatedId = 'clr-stack-label-' + uniqueIdFactory();

    if (!this.id) {
      this._id.set(this._generatedId + '');
    }
  }
}
