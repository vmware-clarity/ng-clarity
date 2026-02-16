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
    <input
      type="file"
      formControlName="files"
      accept=".txt,text/plain"
      multiple
      required
      clrFileInput
      [clrMinFileSize]="100"
      [clrMaxFileSize]="1000"
    />
    <clr-control-helper>Helper message</clr-control-helper>
    <clr-control-success>Success message</clr-control-success>
    <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    <clr-control-error *clrIfError="'accept'; let error = error">
      Only text files are allowed ({{ error | json }})
    </clr-control-error>
    <clr-control-error *clrIfError="'minFileSize'; let error = error">
      File is too small ({{ error | json }})
    </clr-control-error>
    <clr-control-error *clrIfError="'maxFileSize'; let error = error">
      File is too large ({{ error | json }})
    </clr-control-error>
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
  selector: 'app-file-picker-code-validation-example',
  templateUrl: './file-picker-code-validation-example.html',
  standalone: false,
})
export class FilePickerCodeValidationExample {
  protected readonly componentTemplate = COMPONENT_TEMPLATE;
  protected readonly componentClass = COMPONENT_CLASS;

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });
}
