/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrTreeViewModule } from '@clr/angular';

import { organization } from './data/organization';

@Component({
  selector: 'clr-tree-view-dynamic-example',
  templateUrl: './dynamic.example.html',
  imports: [ClrIcon, ClrTreeViewModule],
})
export class TreeViewDynamicExample {
  rootDirectory = organization;

  openFile(directoryName: string, fileName: string): void {
    for (const dir of this.rootDirectory) {
      if (directoryName === dir.name) {
        this.setFileActive(dir, fileName);
      } else {
        for (const file of dir.files) {
          file.active = false;
        }
      }
    }
  }

  setFileActive(dir: (typeof organization)[number], fileName: string) {
    for (const file of dir.files) {
      file.active = file.name === fileName;
    }
  }
}
