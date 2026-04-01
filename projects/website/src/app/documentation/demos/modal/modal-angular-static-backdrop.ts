/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrModalModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<button class="btn btn-primary" (click)="opened = true">Show modal</button>

<clr-modal [(clrModalOpen)]="opened" [clrModalStaticBackdrop]="false">
  <div class="modal-title">Static backdrop</div>
  <div class="modal-body">Clicking on the backdrop closes the modal.</div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
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
  opened = false;
}
`;

@Component({
  selector: 'clr-modal-angular-static-backdrop-demo',
  templateUrl: './modal-angular-static-backdrop.demo.html',
  imports: [ClrModalModule, StackblitzExampleComponent],
})
export class ModalAngularStaticBackdropDemo {
  // Booleans to open each example modal
  static = false;

  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
}
