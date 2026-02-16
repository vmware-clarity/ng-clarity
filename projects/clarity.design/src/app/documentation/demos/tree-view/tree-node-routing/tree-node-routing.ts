/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { albums } from './albums';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    The Beatles
    <clr-tree-node>
      <a [routerLink]="['./album/0']" class="clr-treenode-link" routerLinkActive="active">Abbey Road</a>
    </clr-tree-node>
    <clr-tree-node>
      <a [routerLink]="['./album/1']" class="clr-treenode-link" routerLinkActive="active">Revolver</a>
    </clr-tree-node>
    <clr-tree-node>
      <a [routerLink]="['./album/2']" class="clr-treenode-link" routerLinkActive="active">
        Rubber Soul
      </a>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
<router-outlet></router-outlet>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClarityModule, RouterModule],
})
export class ExampleComponent {}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'app.routes.ts': require('!raw-loader!./app.routes').default,
  'albums.ts': require('!raw-loader!./albums').default,
  'album.component.ts': require('!raw-loader!./album.component').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-tree-node-routing-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'tree-node-routing.html',
  standalone: false,
})
export class TreeNodeRoutingDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  pane = 0;
  album = albums[0];

  showPane(pane: number) {
    this.pane = pane;
    this.album = albums[pane];
  }
}
