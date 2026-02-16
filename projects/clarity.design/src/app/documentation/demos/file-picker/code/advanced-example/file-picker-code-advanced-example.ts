/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

const COMPONENT_TEMPLATE = `
<form clrForm clrLayout="vertical" [formGroup]="form">
  <clr-file-input-container>
    <label>Advanced</label>
    <input
      type="file"
      accept=".txt,text/plain"
      multiple
      required
      formControlName="files"
      clrFileInput
      [clrMinFileSize]="50"
      [clrMaxFileSize]="500"
    />
    <clr-control-helper>Helper text for file input control</clr-control-helper>
    <clr-control-success>Success message for file input control</clr-control-success>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>

    <!-- This makes this file input an "advanced" file input. -->
    <clr-file-list>
      <ng-template clr-file-messages let-file let-errors="errors">
        <clr-file-info>Info text for {{ file.name }}</clr-file-info>
        <clr-file-success>Success message for {{ file.name }}</clr-file-success>
        <clr-file-error *ngIf="errors.accept">File type not accepted</clr-file-error>
        <clr-file-error *ngIf="errors.minFileSize">File size too small</clr-file-error>
        <clr-file-error *ngIf="errors.maxFileSize">File size too large</clr-file-error>
      </ng-template>
    </clr-file-list>
  </clr-file-input-container>
</form>
`;

const COMPONENT_CLASS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrFileInputModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ReactiveFormsModule, ClrFileInputModule],
})
export class ExampleComponent {
  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}
`;

@Component({
  selector: 'app-file-picker-code-advanced-example',
  templateUrl: './file-picker-code-advanced-example.html',
  standalone: false,
})
export class FilePickerCodeAdvancedExample {
  protected readonly componentTemplate = COMPONENT_TEMPLATE;
  protected readonly componentClass = COMPONENT_CLASS;

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}
