/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FILE_PICKER_EXAMPLES } from '@clr/examples/file-picker';

import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'app-file-picker-code',
  templateUrl: './file-picker-code.html',
  imports: [DocExampleComponent],
})
export class FilePickerCode {
  readonly examples = FILE_PICKER_EXAMPLES;
}
