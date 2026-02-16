/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrStackBlock } from '@clr/angular';

import { StackViewNgDemo } from './stack-view-ng-demo';

const EXAMPLE = `
<clr-stack-view>
  <clr-stack-header>
    Lazily loaded children
    <button class="stack-action btn btn-sm btn-link" (click)="resetChildren()" type="button">
      Reset
    </button>
  </clr-stack-header>

  <clr-stack-block
    #lazyBlock
    [clrSbExpandable]="true"
    (clrSbExpandedChange)="fetchChildren()"
    [clrStackViewLevel]="1"
  >
    <clr-stack-label>Label 1</clr-stack-label>
    <clr-stack-content>Content 1</clr-stack-content>

    <clr-stack-block *ngIf="children.length == 0" [clrStackViewLevel]="2">
      <clr-spinner clrAssertive clrInline>Loading...</clr-spinner>
    </clr-stack-block>

    <clr-stack-block *ngFor="let child of children; let i = index" [clrStackViewLevel]="2">
      <clr-stack-label>{{ child.title }}</clr-stack-label>
      <clr-stack-content>{{ child.content }}</clr-stack-content>
    </clr-stack-block>
  </clr-stack-block>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 2</clr-stack-label>
    <clr-stack-content>Content 2</clr-stack-content>
  </clr-stack-block>
</clr-stack-view>
`;

const CODE = `
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClrStackViewModule, ClrModalModule, ClrSpinnerModule, ClrStackBlock } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, FormsModule, ClrStackViewModule, ClrModalModule, ClrSpinnerModule],
})
export class ExampleComponent {
  @ViewChild('lazyBlock', { static: true }) lazyBlock!: ClrStackBlock;

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

  resetChildren(): void {
    this.lazyBlock.expanded = false;
    this.children = [];
  }

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
  selector: 'clr-stack-view-angular-lazyload-demo',
  templateUrl: './stack-view-angular-lazyload.html',
  styleUrl: './stack-view.demo.scss',
  standalone: false,
})
export class StackViewAngularLazyloadDemo extends StackViewNgDemo {
  @ViewChild('lazyBlock', { static: true }) lazyBlock: ClrStackBlock | undefined;

  example = EXAMPLE;
  code = CODE;

  resetChildren(): void {
    if (this.lazyBlock) {
      this.lazyBlock.expanded = false;
    }

    this.children = [];
  }
}
