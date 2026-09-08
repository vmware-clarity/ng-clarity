/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnChanges } from '@angular/core';

import RAW_API_DOCS from '../../../compiled-content/api-docs.json';

/** One input or output as stored in projects/website/content/api-docs/**.json. */
interface ApiDocBinding {
  name: string;
  type: string;
  default?: string;
  deprecated?: string | boolean;
  description: string;
}

/** One component or directive as stored in projects/website/content/api-docs/**.json. */
interface ApiDocEntry {
  name: string;
  kind: 'component' | 'directive';
  selector: string;
  description: string;
  entryPoint: string;
  inputs: ApiDocBinding[];
  outputs: ApiDocBinding[];
}

interface ApiDocRow {
  /** Binding as written in a template, e.g. `[clrModalSize]`, `[(clrModalOpen)]` or `(clrModalOpenChange)`. */
  binding: string;
  type: string;
  default: string;
  deprecated: string | boolean | undefined;
  description: string;
}

interface ApiDocTable {
  name: string;
  kind: 'component' | 'directive';
  /** Selector as it appears in a template, e.g. `<clr-modal>` or `clrIfExpanded`. */
  usage: string;
  description: string;
  rows: ApiDocRow[];
}

const API_DOCS = RAW_API_DOCS as unknown as Record<string, ApiDocEntry>;

/**
 * Renders the inputs/outputs table(s) for one or more public components or directives.
 *
 * The data comes from the checked-in API reports under `projects/website/content/api-docs/`,
 * which are kept in sync with the library sources by `npm run website-api:check`.
 * Descriptions are written by hand, either as JSDoc on the `@Input()`/`@Output()`
 * declaration or directly in the report files.
 *
 * Usage: `<app-api-docs [components]="['ClrAccordion', 'ClrAccordionPanel']"></app-api-docs>`
 */
@Component({
  selector: 'app-api-docs',
  templateUrl: './api-docs.component.html',
})
export class ApiDocsComponent implements OnChanges {
  /** Class names of the components/directives to document, in display order. */
  @Input({ required: true }) components: string[] = [];

  /** Heading rendered above the tables. Pass an empty string to omit it. */
  @Input() heading = 'Angular Components';

  tables: ApiDocTable[] = [];

  ngOnChanges() {
    this.tables = this.components.map(name => this.toTable(name)).filter((table): table is ApiDocTable => !!table);
  }

  private toTable(name: string): ApiDocTable | undefined {
    const entry = API_DOCS[name];

    if (!entry) {
      console.error(`No API docs found for "${name}". Run \`npm run website-api:update\` and check the class name.`);
      return undefined;
    }

    const outputNames = new Set(entry.outputs.map(output => output.name));

    return {
      name: entry.name,
      kind: entry.kind,
      usage: toUsage(entry),
      description: entry.description,
      rows: [
        ...entry.inputs.map(input => ({
          binding: outputNames.has(`${input.name}Change`) ? `[(${input.name})]` : `[${input.name}]`,
          type: input.type,
          default: input.default ?? 'None',
          deprecated: input.deprecated,
          description: input.description,
        })),
        ...entry.outputs.map(output => ({
          binding: `(${output.name})`,
          type: output.type,
          default: '',
          deprecated: output.deprecated,
          description: output.description,
        })),
      ],
    };
  }
}

function toUsage(entry: ApiDocEntry): string {
  const isSimpleSelector = !/[[\],:]/.test(entry.selector);

  if (entry.kind === 'component' && isSimpleSelector) {
    return `<${entry.selector}>`;
  }

  const attributeSelector = /^\[(\w+)\]$/.exec(entry.selector);
  return attributeSelector ? attributeSelector[1] : entry.selector;
}
