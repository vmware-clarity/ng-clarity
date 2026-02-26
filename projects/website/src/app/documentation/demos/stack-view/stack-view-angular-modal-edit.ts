/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrModalModule, ClrStackViewModule } from '@clr/angular';

import { RemoveStackViewHeadingsDirective } from './remove-stack-view-headings.directive';
import { StackViewNgDemo } from './stack-view-ng-demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-stack-view>
  <clr-stack-header>
    Modal editor
    <button class="stack-action btn btn-sm btn-link" (click)="editModal = true" type="button">
      Edit
    </button>
  </clr-stack-header>

  <clr-stack-block *ngFor="let block of blocks; let i = index" [clrStackViewLevel]="1">
    <clr-stack-label>{{ block.title }}</clr-stack-label>
    <clr-stack-content>{{ block.content }}</clr-stack-content>

    <clr-stack-block *ngFor="let child of block.children; let j = index" [clrStackViewLevel]="2">
      <clr-stack-label>{{ child.title }}</clr-stack-label>
      <clr-stack-content>{{ child.content }}</clr-stack-content>
    </clr-stack-block>
  </clr-stack-block>
</clr-stack-view>

<clr-modal [(clrModalOpen)]="editModal">
  <h3 class="modal-title">Edit mode</h3>
  <div class="modal-body">
    <clr-stack-view>
      <clr-stack-block
        *ngFor="let block of blocks; let blockIndex = index"
        [clrSbNotifyChange]="block.content !== 'Content ' + blockIndex"
        [clrStackViewLevel]="1"
      >
        <clr-stack-label>{{ block.title }}</clr-stack-label>
        <clr-stack-content>
          <input type="text" [(ngModel)]="block.content" class="clr-input" />
        </clr-stack-content>

        <clr-stack-block
          *ngFor="let child of block.children; let blockChildIndex = index"
          [clrSbNotifyChange]="child.content !== 'Sub-content ' + blockChildIndex"
          [clrStackViewLevel]="2"
        >
          <clr-stack-label>{{ child.title }}</clr-stack-label>
          <clr-stack-content>
            <input type="text" [(ngModel)]="child.content" class="clr-input" />
          </clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary" (click)="editModal = false">Done</button>
  </div>
</clr-modal>
`;

const CODE = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, FormsModule, ClrStackViewModule, ClrModalModule],
})
export class ExampleComponent {
  editModal = false;
  blocks: any[] = [
    { title: 'Label 1', content: 'Content 1' },
    {
      title: 'Label 2',
      content: 'Content 2',
      children: [
        { title: 'Sub-label 1', content: 'Sub-content 1' },
        { title: 'Sub-label 2', content: 'Sub-content 2' },
        { title: 'Sub-label 3', content: 'Sub-content 3' },
      ],
    },
    { title: 'Label 3', content: 'Content 3' },
  ];
  children: any[] = [];

  fetchChildren(): void {
    if (this.children.length > 0) {
      return;
    }
    setTimeout(() => {
      this.children = [
        { title: 'Sub-label 1', content: 'Sub-content 1' },
        { title: 'Sub-label 2', content: 'Sub-content 2' },
        { title: 'Sub-label 3', content: 'Sub-content 3' },
      ];
    }, 2000);
  }
}
`;

@Component({
  selector: 'clr-stack-view-angular-modal-edit-demo',
  templateUrl: './stack-view-angular-modal-edit.html',
  styleUrl: './stack-view.demo.scss',
  imports: [
    ClrStackViewModule,
    RemoveStackViewHeadingsDirective,
    ClrModalModule,
    FormsModule,
    StackblitzExampleComponent,
  ],
})
export class StackViewAngularModalEditDemo extends StackViewNgDemo {
  example = EXAMPLE;
  code = CODE;
}
