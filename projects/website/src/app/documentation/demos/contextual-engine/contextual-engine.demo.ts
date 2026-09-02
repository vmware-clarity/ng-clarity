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

const INSTALL_EXAMPLE = `npm install @clr/ai --save`;

const SNAPSHOT_EXAMPLE = `
import { ClrContextualEngineService } from '@clr/ai';

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
  "regions": [{ "type": "section", "label": "Firewall rules for cluster 42" }],
  "components": [
    {
      "type": "datagrid",
      "state": { "columns": ["Name", "Status"], "visibleRows": 20, "selectedRows": 2 }
    },
    {
      "type": "alert",
      "label": "esx-edge-01 has been disconnected",
      "state": { "severity": "warning" }
    }
  ],
  "actions": [{ "label": "Add rule", "kind": "button" }],
  "collectedAt": "2026-09-01T10:00:00.000Z"
}
`;

const TRACKER_EXAMPLE = `
import { ClrContextTrackerService } from '@clr/ai';

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
import { ClrContextualModule } from '@clr/ai';

@NgModule({
  imports: [ClrContextualModule],
})
export class AppModule {}
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
`;

const FRAME_CLIENT_EXAMPLE = `
// Inside the iframe: any framework, no Clarity required — plain postMessage.
parent.postMessage({ protocol: 'ui-context/v1', kind: 'context-request', requestId: 'r1' }, '*');
// The host answers with a freshly computed snapshot:
// { protocol: 'ui-context/v1', kind: 'context-response', requestId: 'r1', context: { ... } }
`;

const FORM_FILLING_EXAMPLE = `
// 1. Opt into full form context: names, current values, selectable options.
const context = contextEngine.getSnapshot({ includeFormValues: true });
// field example: { type: 'select', label: 'Cluster', state: {
//   name: 'cluster', value: 'beta',
//   options: [{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }] } }

// 2. The agent answers with JSON keyed by control name...
const answer = { hostName: 'esx-prod-04', cluster: 'beta', tier: 'silver', enabled: true };

// 3. ...which is applied back through real DOM events, so Angular forms
//    react as if the user had typed. Nothing is submitted automatically.
const result = contextEngine.applyFormValues(answer);
// { applied: ['hostName', 'cluster', 'tier', 'enabled'], skipped: [] }
`;

const GLOBAL_ACCESS_EXAMPLE = `
this.contextEngine.enableGlobalAccess();
// Browser-driving agents can now call window.clrContext() for a fresh snapshot.
`;

const BUDGETS_EXAMPLE = `
this.contextEngine.getSnapshot({
  maxTextLength: 60, // truncate any text beyond 60 characters
  maxItemsPerCollection: 10, // at most 10 rows/tabs/links/actions per component
  maxComponents: 30, // at most 30 components overall
  includeActions: false, // skip page-level action collection
  includeDomComponents: false, // skip DOM scanning entirely (regions + route only)
});
`;

@Component({
  templateUrl: './contextual-engine.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, CodeSnippetComponent],
})
export class ContextualEngineDemo extends ClarityDocComponent {
  installExample = INSTALL_EXAMPLE;
  snapshotExample = SNAPSHOT_EXAMPLE;
  snapshotShapeExample = SNAPSHOT_SHAPE_EXAMPLE;
  trackerExample = TRACKER_EXAMPLE;
  ignoreExample = IGNORE_EXAMPLE;
  directiveExample = DIRECTIVE_EXAMPLE;
  directiveModuleExample = DIRECTIVE_MODULE_EXAMPLE;
  extractorExample = EXTRACTOR_EXAMPLE;
  formFillingExample = FORM_FILLING_EXAMPLE;
  frameHostExample = FRAME_HOST_EXAMPLE;
  frameClientExample = FRAME_CLIENT_EXAMPLE;
  globalAccessExample = GLOBAL_ACCESS_EXAMPLE;
  budgetsExample = BUDGETS_EXAMPLE;

  constructor() {
    super('contextual-engine');
  }
}
