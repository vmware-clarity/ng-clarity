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
    <label>Label</label>
    <input type="file" formControlName="files" multiple required clrFileInput />
    <clr-control-helper>Helper message</clr-control-helper>
    <clr-control-success>Success message</clr-control-success>
    <clr-control-error>Error message</clr-control-error>
  </clr-file-input-container>
</form>
`;

const COMPONENT_CLASS = `
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrFileInputModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ReactiveFormsModule, ClrFileInputModule],
})
export class ExampleComponent {
  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}
`;

@Component({
  selector: 'app-file-picker-code-basic-example',
  templateUrl: './file-picker-code-basic-example.html',
  standalone: false,
})
export class FilePickerCodeBasicExample {
  protected readonly componentTemplate = COMPONENT_TEMPLATE;
  protected readonly componentClass = COMPONENT_CLASS;

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}
