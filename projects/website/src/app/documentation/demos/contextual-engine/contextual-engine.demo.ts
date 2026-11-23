/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';
import { ApiContextualEngineDemo } from './api-contextual-engine.demo';
import { ContextPlaygroundComponent } from './context-playground.component';

const INSTALL_EXAMPLE = `npm install @clr/angular --save`;

const QUICKSTART_EXAMPLE = `
import { Component, inject } from '@angular/core';
import { ClrContextService } from '@clr/angular/ai';

@Component({
  selector: 'app-assistant',
  template: '...',
})
export class AssistantComponent {
  private readonly context = inject(ClrContextService);

  async ask(question: string) {
    // One snapshot, taken now. Send it to your model as data, delimited from your prompt.
    return { question, page: await this.context.snapshot() };
  }
}
`;

const SNAPSHOT_EXAMPLE = `
import { Component, inject } from '@angular/core';
import { ClrContextService } from '@clr/angular/ai';

@Component({
  // ...
})
export class AssistantPanelComponent {
  private readonly context = inject(ClrContextService);

  async askAssistant(question: string) {
    const page = await this.context.snapshot();
    // Hand the question and the page context to your AI backend together.
  }
}
`;

const SNAPSHOT_SHAPE_EXAMPLE = `
{
  "schemaVersion": "1",
  "application": { "id": "inventory", "version": "2.4.0" },
  "viewId": "cluster-overview",
  "enabled": true,
  "title": "Cluster overview",
  "url": "https://app.example/clusters/42",
  "route": { "url": "/clusters/42", "path": "clusters/:id", "params": { "id": "42" } },
  "regions": [],
  "components": [
    { "type": "group", "label": "Firewall rules for cluster 42", "state": { "ruleCount": 12 } },
    {
      "type": "grid",
      "element": "clr-datagrid",
      "state": {
        "columns": ["Name", "Status"],
        "rowCount": 2,
        "rows": ["esx-01 | Connected", "esx-edge-01 | Disconnected"],
        "selectedRows": 1
      }
    },
    {
      "type": "alert",
      "element": "clr-alert",
      "label": "esx-edge-01 has been disconnected",
      "children": [{ "type": "button", "label": "Dismiss" }]
    },
    { "type": "button", "label": "Add rule" }
  ],
  "collectedAt": "2026-09-01T10:00:00.000Z"
}
`;

const IGNORE_EXAMPLE = `
<!-- The assistant panel renders the context, so the engine must not describe it. -->
<aside class="assistant-panel" data-clr-context-ignore>...</aside>
`;

const DIRECTIVE_EXAMPLE = `
@Component({
  template: \`<section [clrContext]="rulesContext">...</section>\`,
})
export class FirewallRulesComponent {
  clusterName = 'alpha';
  rules: FirewallRule[] = [];

  // A constant works too; a function is read each time a snapshot is taken.
  readonly rulesContext = () => ({
    label: 'Firewall rules for the selected cluster',
    state: { cluster: this.clusterName, ruleCount: this.rules.length },
  });
}
`;

const VIEW_METADATA_EXAMPLE = `
// With scope: { root: 'main' }, <main> is the view root: its annotation describes the view.
// Anywhere else, an annotation describes its element.
@Component({
  template: \`
    <main [clrContext]="hostList">
      <clr-datagrid [clrContext]="hostGrid">...</clr-datagrid>
    </main>
  \`,
})
export class HostListComponent {
  readonly hostList = { state: { viewId: 'host-list', purpose: 'Lists the hosts of a cluster' } };
  readonly hostGrid = { state: { help: 'https://docs.example.com/hosts' } };
}
`;

const DIRECTIVE_STANDALONE_EXAMPLE = `
import { ClrContext } from '@clr/angular/ai';

@Component({
  imports: [ClrContext],
  template: \`<section [clrContext]="rulesContext">...</section>\`,
})
export class FirewallComponent {
  readonly rulesContext = { label: 'Firewall rules for the selected cluster' };
}
`;

const DIRECTIVE_MODULE_EXAMPLE = `
import { ClrContextModule } from '@clr/angular/ai';

@NgModule({
  imports: [ClrContextModule],
})
export class AppModule {}
`;

const ELEMENT_CONTEXT_EXAMPLE = `
import { publishElementContext } from '@clr/angular/utils';

// In the component that knows more than its markup shows:
this.teardown = publishElementContext(hostElement, () => ({
  type: 'combobox',
  state: {
    options: this.choices.map(choice => choice.label),
    value: this.selection,
  },
}));

// ...and on destroy:
this.teardown?.();
`;

const EXTRACTOR_EXAMPLE = `
this.context.configure({
  extractors: [
    {
      selector: 'chat-message-list',
      extract: element => ({
        type: 'chat-log',
        state: { messages: element.children.length },
      }),
    },
  ],
});
`;

const FRAME_HOST_EXAMPLE = `
// Host page (the Clarity application)
this.contextEngine.enableFrameBridge(); // same-origin frames only
this.contextEngine.enableFrameBridge({ allowedOrigins: ['https://chat.example'] });

// A frame receives no form values and no URL query string unless you say so:
this.contextEngine.enableFrameBridge({
  allowedOrigins: ['https://chat.example'],
  shareFormValues: true,
  shareFullUrl: true,
});
`;

const FRAME_CLIENT_EXAMPLE = `
// Inside the iframe: any framework, no Clarity required — plain postMessage.
const hostOrigin = 'https://app.example'; // the application this frame is built for, never read from the page
// Unguessable, so no other frame can answer for the host. randomUUID() needs a secure context (HTTPS or
// localhost); getRandomValues() works everywhere.
const requestId =
  crypto.randomUUID?.() ??
  Array.from(crypto.getRandomValues(new Uint8Array(16)), byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');

window.addEventListener('message', event => {
  // Only the window that was asked, only from its origin, only the answer to this request.
  if (event.source !== window.parent || event.origin !== hostOrigin) {
    return;
  }
  const message = event.data;
  if (
    message?.protocol === 'ui-context/v1' &&
    message.kind === 'context-response' &&
    message.requestId === requestId
  ) {
    render(message.context); // { title, url, route, regions, components, ... }
  }
});

parent.postMessage({ protocol: 'ui-context/v1', kind: 'context-request', requestId }, hostOrigin);
`;

const FORM_CONTEXT_EXAMPLE = `
const page = await context.snapshot();

// A field carries what it is, what it permits, and what it currently holds:
// {
//   "type": "combobox",
//   "element": "clr-select-container",
//   "label": "Cluster",
//   "state": {
//     "value": "Beta",
//     "options": ["Alpha", "Beta"],
//     "required": true,
//     "description": "Pick a target cluster"
//   }
// }
`;

const REDACT_EXAMPLE = `
<!-- Passwords and file inputs are withheld automatically, as is anything whose
     autocomplete declares a credential or a payment card. Mark anything else
     sensitive, and the field is still described while its value is withheld. -->
<input clrInput formControlName="apiToken" data-clr-context-redact />

<!-- A whole region works too. -->
<section data-clr-context-redact>...</section>
`;

const OPTIONS_EXAMPLE = `
await this.context.snapshot({
  root: 'main', // 'page' (default), 'modal' for the open modal, or a CSS selector
  excludeSelectors: ['clr-header'], // drop layout that cannot be annotated
  excludeCategories: ['layout', 'actions'], // no header/navigation/footer, no buttons or links
  maxComponents: 100, // at most 100 components overall
  maxItemsPerCollection: 0, // counts and selection only, no item lists
});
`;

const PROVIDE_EXAMPLE = `
import { CLR_CONTEXT_PRESETS, ClrContextService } from '@clr/angular/ai';

// Once, at startup (for example in the root component): every snapshot starts from this scope,
// and per-call options are applied over it.
inject(ClrContextService).configure({ scope: 'interactive' });

// or explicit options, or a preset with changes
inject(ClrContextService).configure({
  scope: { ...CLR_CONTEXT_PRESETS.interactive, excludeSelectors: ['clr-header'] },
  routes: true, // also list the router's routes
});
`;

const CHANGES_EXAMPLE = `
const change = clrDiffContext(previousSnapshot, currentSnapshot);
// change.added   — nodes that were not there before, with their subtrees
// change.removed — nodes that are gone
// change.changed — nodes whose own state differs: { before, after }
// change.viewChanged — application, view id, enabled or metadata
// change.routeChanged / titleChanged / regionsChanged
if (!clrIsEmptyContextChange(change)) {
  assistant.send({ pageChanged: change });
}
`;

const BUDGETS_EXAMPLE = `
await this.context.snapshot({
  maxItemsPerCollection: 10, // at most 10 rows/tabs/links/options per component
  maxComponents: 30, // at most 30 components overall, counted across the whole tree
});
`;

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './contextual-engine.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    CodeSnippetComponent,
    ApiContextualEngineDemo,
    ContextPlaygroundComponent,
  ],
})
export class ContextualEngineDemo extends ClarityDocComponent {
  installExample = INSTALL_EXAMPLE;
  quickstartExample = QUICKSTART_EXAMPLE;
  snapshotExample = SNAPSHOT_EXAMPLE;
  snapshotShapeExample = SNAPSHOT_SHAPE_EXAMPLE;
  ignoreExample = IGNORE_EXAMPLE;
  directiveExample = DIRECTIVE_EXAMPLE;
  viewMetadataExample = VIEW_METADATA_EXAMPLE;
  directiveStandaloneExample = DIRECTIVE_STANDALONE_EXAMPLE;
  directiveModuleExample = DIRECTIVE_MODULE_EXAMPLE;
  elementContextExample = ELEMENT_CONTEXT_EXAMPLE;
  extractorExample = EXTRACTOR_EXAMPLE;
  formContextExample = FORM_CONTEXT_EXAMPLE;
  redactExample = REDACT_EXAMPLE;
  frameHostExample = FRAME_HOST_EXAMPLE;
  frameClientExample = FRAME_CLIENT_EXAMPLE;
  budgetsExample = BUDGETS_EXAMPLE;
  optionsExample = OPTIONS_EXAMPLE;
  provideExample = PROVIDE_EXAMPLE;
  changesExample = CHANGES_EXAMPLE;

  constructor() {
    super('contextual-engine');
  }
}
