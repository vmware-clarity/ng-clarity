/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Undocumented experimental feature: inline editing.
 *
 * TODO: support more types of inputs: checkbox, radio, ...
 * TODO: Mirror input attributes from the host to the actual input: size, min, max, placeholder, ...
 */

import { Component } from '@angular/core';

import { StackControl } from './stack-control';
import { ClrStackView } from './stack-view';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'clr-stack-input',
  inputs: ['model: clrModel', 'type'],
  outputs: ['modelChange: clrModelChange'],
  template: `
    <span *ngIf="!stackView.editing">{{ model }}</span>
    <input [type]="type" *ngIf="stackView.editing" [(ngModel)]="model" />
  `,
  providers: [ClrDestroyService],
})
export class ClrStackInput extends StackControl {
  type = 'text';

  constructor(public override stackView: ClrStackView, destroy$: ClrDestroyService) {
    super(stackView, destroy$);
  }
}
