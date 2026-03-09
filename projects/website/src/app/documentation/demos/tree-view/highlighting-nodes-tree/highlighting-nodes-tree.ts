/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrTreeViewModule } from '@clr/angular';

@Component({
  selector: 'app-highlighting-nodes-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './highlighting-nodes-tree.html',
  imports: [ClrTreeViewModule, ClrIcon, ClrIconModule],
})
export class HighlightNodesTreeDemo {
  rootDirectory = [
    {
      name: 'Applications',
      icon: 'folder',
      expanded: true,
      files: [
        {
          icon: 'calendar',
          name: 'Calendar',
          active: true,
        },
        {
          icon: 'line-chart',
          name: 'Charts',
          active: false,
        },
        {
          icon: 'dashboard',
          name: 'Dashboard',
          active: false,
        },
      ],
    },
    {
      name: 'Files',
      icon: 'folder',
      expanded: false,
      files: [
        {
          icon: 'file',
          name: 'Cover Letter.doc',
          active: false,
        },
        {
          icon: 'file',
          name: 'Flyer.doc',
          active: false,
        },
        {
          icon: 'file',
          name: 'Resume.doc',
          active: false,
        },
        {
          icon: 'file',
          name: 'Notes.txt',
          active: false,
        },
      ],
    },
    {
      name: 'Images',
      icon: 'folder',
      expanded: false,
      files: [
        {
          icon: 'image',
          name: 'Screenshot.png',
          active: false,
        },
        {
          icon: 'image',
          name: 'Pic.png',
          active: false,
        },
        {
          icon: 'image',
          name: 'Portfolio.jpg',
          active: false,
        },
      ],
    },
  ];

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

  setFileActive(dir: any, fileName: string) {
    for (const file of dir.files) {
      file.active = file.name === fileName;
    }
  }
}
