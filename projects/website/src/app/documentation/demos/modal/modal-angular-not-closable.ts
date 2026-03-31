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

<clr-modal [(clrModalOpen)]="opened" [clrModalClosable]="false">
  <h3 class="modal-title">No "x" in the top-right corner</h3>
  <div class="modal-body">
    <p>Clicking on the backdrop doesn't do anything.</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="opened = false">
      I'm the only way to close the modal!
    </button>
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
  selector: 'clr-modal-angular-not-closable-demo',
  templateUrl: './modal-angular-not-closable.demo.html',
  imports: [ClrModalModule, StackblitzExampleComponent],
})
export class ModalAngularNotClosableDemo {
  // Booleans to open each example modal
  closable = false;
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
}
