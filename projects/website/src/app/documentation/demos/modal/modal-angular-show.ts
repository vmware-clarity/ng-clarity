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
<button type="button" class="btn btn-primary" (click)="modalOpen = true">SHow Modal</button>

<clr-modal [(clrModalOpen)]="modalOpen">
  <h3 class="modal-title">I have a nice title</h3>
  <div class="modal-body">
    <p>But not much to say...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="modalOpen = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="modalOpen = false">Ok</button>
  </div>
</clr-modal>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrModalModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrModalModule],
})
export class ExampleComponent {
  modalOpen = false;
}
`;

@Component({
  selector: 'clr-modal-angular-show-demo',
  templateUrl: './modal-angular-show.demo.html',
  imports: [ClrModalModule, StackblitzExampleComponent],
})
export class ModalAngularShowDemo {
  // Booleans to open each example modal
  basic = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}
