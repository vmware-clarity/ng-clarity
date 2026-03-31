/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrFileInputModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../../shared/stackblitz-example/stackblitz-example.component';

const COMPONENT_TEMPLATE = `
<form clrForm clrLayout="vertical" [formGroup]="form">
  <clr-file-input-container>
    <label>Label</label>
    <input type="file" formControlName="files" multiple clrFileInput />
    <clr-control-helper>Helper message</clr-control-helper>
    <clr-control-success>Success message</clr-control-success>
  </clr-file-input-container>
</form>

<pre>{{ files | json }}</pre>
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

  protected get files() {
    if (this.form.controls.files.value) {
      return Array.from(this.form.controls.files.value).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    }

    return null;
  }
}
`;

@Component({
  selector: 'app-file-picker-code-value-accessor-example',
  templateUrl: './file-picker-code-value-accessor-example.html',
  imports: [
    FormsModule,
    ClrCommonFormsModule,
    ReactiveFormsModule,
    ClrFileInputModule,
    StackblitzExampleComponent,
    JsonPipe,
  ],
})
export class FilePickerCodeValueAccessorExample {
  protected readonly componentTemplate = COMPONENT_TEMPLATE;
  protected readonly componentClass = COMPONENT_CLASS;

  protected readonly form = new FormGroup({
    files: new FormControl<FileList | null>(null),
  });

  protected get files() {
    if (this.form.controls.files.value) {
      return Array.from(this.form.controls.files.value).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
    }

    return null;
  }
}
