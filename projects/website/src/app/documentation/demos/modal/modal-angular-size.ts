/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrModalModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<p>
  <button class="btn btn-primary" (click)="openModal('sm')">Small Modal</button>
  <button class="btn btn-primary" (click)="openModal('md')">Medium Modal</button>
  <button class="btn btn-primary" (click)="openModal('lg')">Large Modal</button>
  <button class="btn btn-primary" (click)="openModal('xl')">X-Large Modal</button>
  <button class="btn btn-primary" (click)="openModal('full-screen')">Full-Screen Modal</button>
</p>

<clr-modal #modal [(clrModalOpen)]="opened" [clrModalSize]="size">
  <div class="modal-title">{{ sizeText }} modal</div>
  <div class="modal-body">I am a {{ sizeText | lowercase }} modal.</div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="opened = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
  </div>
</clr-modal>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ClrModal, ClrModalModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrModalModule],
})
export class ExampleComponent {
  @ViewChild('modal', { static: true }) modal: ClrModal | undefined;

  opened = false;
  size = 'md';

  get sizeText(): string {
    switch (this.size) {
      case 'sm':
        return 'Small';
      case 'xl':
        return 'X-Large';
      case 'full-screen':
        return 'Full-Screen';
      case 'lg':
        return 'Large';
      case 'md':
      default:
        return 'Medium (Default)';
    }
  }

  openModal(size: string) {
    this.size = size;

    this.modal?.open();
  }
}
`;

@Component({
  selector: 'clr-modal-angular-size-demo',
  templateUrl: './modal-angular-size.demo.html',
  imports: [ClrModalModule, StackblitzExampleComponent],
})
export class ModalAngularSizeDemo {
  // Booleans to open each example modal
  small = false;
  large = false;
  extraLarge = false;
  fullScreen = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}
