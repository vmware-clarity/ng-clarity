/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';
import { ApiContextualEngineDemo } from './api-contextual-engine.demo';

const INSTALL_EXAMPLE = `npm install @clr/angular --save`;

const SNAPSHOT_EXAMPLE = `
import { ClrContextualEngineService } from '@clr/angular/ai';

@Component({
  // ...
})
export class AssistantPanelComponent {
  constructor(private contextEngine: ClrContextualEngineService) {}

  askAssistant(question: string) {
    const context = this.contextEngine.getSnapshot();
    // Hand the question and the page context to your AI backend together.
  }
}
`;

const SNAPSHOT_SHAPE_EXAMPLE = `
{
  "title": "Cluster overview",
  "url": "https://app.example/clusters/42",
  "route": { "url": "/clusters/42", "path": "clusters/:id", "params": { "id": "42" } },
  "regions": [{ "type": "region", "label": "Firewall rules for cluster 42" }],
  "components": [
    {
      "type": "grid",
      "element": "clr-datagrid",
      "state": { "columns": ["Name", "Status"], "rowCount": 20, "selectedRows": 2 }
    },
    {
      "type": "alert",
      "element": "clr-alert",
      "label": "esx-edge-01 has been disconnected",
      "state": { "severity": "warning" },
      "children": [{ "type": "button", "label": "Dismiss" }]
    },
    { "type": "button", "label": "Add rule" }
  ],
  "collectedAt": "2026-09-01T10:00:00.000Z"
}
`;

// A button or link is reported exactly where it is in the DOM — the alert's own dismiss
// button is nested under it, above — never pulled into a separate flat list.

const TRACKER_EXAMPLE = `
import { ClrContextTrackerService } from '@clr/angular/ai';

@Component({
  // ...
})
export class AssistantPanelComponent implements OnInit, OnDestroy {
  constructor(private tracker: ClrContextTrackerService) {}

  ngOnInit() {
    this.tracker.context$.subscribe(context => this.setPageContext(context));
    this.tracker.start({ snapshot: { maxComponents: 50 } });
  }

  ngOnDestroy() {
    this.tracker.stop();
  }
}
`;

const IGNORE_EXAMPLE = `
<!-- The assistant panel renders the context, so the engine must not describe it
     and the tracker must not react to its re-renders. -->
<aside class="assistant-panel" data-clr-context-ignore>...</aside>
`;

const DIRECTIVE_EXAMPLE = `
<section
  clrContext="Firewall rules for the selected cluster"
  [clrContextState]="{ cluster: clusterName }"
>
  ...
</section>
`;

const DIRECTIVE_MODULE_EXAMPLE = `
import { ClrContextualModule } from '@clr/angular/ai';

@NgModule({
  imports: [ClrContextualModule],
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
const unregister = this.contextEngine.registerDomExtractor({
  selector: 'chat-message-list',
  extract: element => ({ type: 'chat-log', state: { messages: element.children.length } }),
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
parent.postMessage({ protocol: 'ui-context/v1', kind: 'context-request', requestId: 'r1' }, '*');
// The host answers with a freshly computed snapshot:
// { protocol: 'ui-context/v1', kind: 'context-response', requestId: 'r1', context: { ... } }
`;

const FORM_CONTEXT_EXAMPLE = `
const context = contextEngine.getSnapshot();

// A field carries what it is, what it permits, and what it currently holds:
// {
//   "type": "combobox",
//   "element": "clr-select-container",
//   "label": "Cluster",
//   "state": {
//     "value": "beta",
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

const GLOBAL_ACCESS_EXAMPLE = `
this.contextEngine.enableGlobalAccess();
// Browser-driving agents can now call window.clrContext() for a fresh snapshot.
// Values the user typed are withheld, because any script on the page can call it.

// Share them deliberately, if that is what you mean:
this.contextEngine.enableGlobalAccess('clrContext', { shareFormValues: true });
`;

const BUDGETS_EXAMPLE = `
this.contextEngine.getSnapshot({
  maxTextLength: 60, // truncate any text beyond 60 characters
  maxItemsPerCollection: 10, // at most 10 rows/tabs/links/options per component
  maxComponents: 30, // at most 30 components overall, counted across the whole tree
  includeDomComponents: false, // skip DOM scanning entirely (regions + route only)
});
`;

@Component({
  templateUrl: './contextual-engine.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, CodeSnippetComponent, ApiContextualEngineDemo],
})
export class ContextualEngineDemo extends ClarityDocComponent {
  installExample = INSTALL_EXAMPLE;
  snapshotExample = SNAPSHOT_EXAMPLE;
  snapshotShapeExample = SNAPSHOT_SHAPE_EXAMPLE;
  trackerExample = TRACKER_EXAMPLE;
  ignoreExample = IGNORE_EXAMPLE;
  directiveExample = DIRECTIVE_EXAMPLE;
  directiveModuleExample = DIRECTIVE_MODULE_EXAMPLE;
  elementContextExample = ELEMENT_CONTEXT_EXAMPLE;
  extractorExample = EXTRACTOR_EXAMPLE;
  formContextExample = FORM_CONTEXT_EXAMPLE;
  redactExample = REDACT_EXAMPLE;
  frameHostExample = FRAME_HOST_EXAMPLE;
  frameClientExample = FRAME_CLIENT_EXAMPLE;
  globalAccessExample = GLOBAL_ACCESS_EXAMPLE;
  budgetsExample = BUDGETS_EXAMPLE;

  constructor() {
    super('contextual-engine');
  }
}
