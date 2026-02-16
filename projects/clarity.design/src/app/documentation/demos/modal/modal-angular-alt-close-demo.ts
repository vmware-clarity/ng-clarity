/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE_HTML = `
<button class="btn btn-primary" (click)="opened = true">Show modal</button>
<clr-modal
  [(clrModalOpen)]="opened"
  [clrModalPreventClose]="true"
  (clrModalAlternateClose)="showConfirm = true"
  #modal
>
  <div class="modal-title">Confirm on close</div>
  <div class="modal-body">
    <p>The modal will require confirmation on close.</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="modal.close()">Close</button>
  </div>
</clr-modal>

<clr-modal [(clrModalOpen)]="showConfirm">
  <h3 class="modal-title">Are you sure?</h3>
  <div class="modal-body">
    <p>You may lose data if you close now...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="showConfirm = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="showConfirm = false; opened = false">
      Yes
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
  showConfirm = false;
}
`;

@Component({
  selector: 'clr-modal-angular-alt-close-demo',
  templateUrl: './modal-angular-alt-close-demo.html',
  standalone: false,
})
export class ModalAngularAlternateCloseDemo {
  showModal = false;
  showConfirm = false;
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
}
