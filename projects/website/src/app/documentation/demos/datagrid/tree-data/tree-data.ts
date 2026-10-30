/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EXAMPLES } from './examples';
import { DatagridTreeFilesExample } from './files-example';
import { DatagridTreeStaticExample } from './static-example';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

// The StackBlitz project expects the example as `ExampleComponent` in example.component.html.
function stackblitzClass(source: string, templateUrl: string) {
  return source
    .replace(/export class \w+/, 'export class ExampleComponent')
    .replace(/selector: '[^']*'/, "selector: 'app-example'")
    .replace(templateUrl, './example.component.html');
}

const filesExampleHtml = require('!raw-loader!./files-example.html').default;
const filesExampleTs = stackblitzClass(require('!raw-loader!./files-example.ts').default, './files-example.html');
const staticExampleHtml = require('!raw-loader!./static-example.html').default;
const staticExampleTs = stackblitzClass(require('!raw-loader!./static-example.ts').default, './static-example.html');

@Component({
  selector: 'clr-datagrid-tree-data-demo',
  templateUrl: 'tree-data.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [CodeSnippetComponent, StackblitzExampleComponent, DatagridTreeFilesExample, DatagridTreeStaticExample],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridTreeDataDemo {
  examples = EXAMPLES;
  filesExampleHtml = filesExampleHtml;
  filesExampleTs = filesExampleTs;
  staticExampleHtml = staticExampleHtml;
  staticExampleTs = staticExampleTs;
}
