/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, Input, OnInit } from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';

@Directive({
  selector: 'clr-stack-content',
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
})
export class ClrStackViewLabel implements OnInit {
  private _generatedId: string = null;

  private _id: string = null;

  @Input()
  set id(val: string) {
    if (typeof val === 'string' && val !== '') {
      this._id = val;
    } else {
      this._id = this._generatedId + '';
    }
  }
  get id() {
    return this._id;
  }

  ngOnInit() {
    this._generatedId = 'clr-stack-label-' + uniqueIdFactory();

    if (!this.id) {
      this._id = this._generatedId + '';
    }
  }
}
