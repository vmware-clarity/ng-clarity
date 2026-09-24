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
import { ContextPlaygroundComponent } from './context-playground.component';

const INSTALL_EXAMPLE = `npm install @clr/angular --save`;

const SNAPSHOT_EXAMPLE = `
import { ClrContextEngineService } from '@clr/angular/ai';

@Component({
  // ...
})
export class AssistantPanelComponent {
  constructor(private contextEngine: ClrContextEngineService) {}

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
const hostOrigin = new URL(document.referrer).origin; // the embedder, disclosed by the referrer
const requestId = crypto.randomUUID(); // unguessable, so no other frame can answer for the host

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

const OPTIONS_EXAMPLE = `
this.contextEngine.getSnapshot({
  excludeCategories: ['layout', 'actions'], // no header/navigation/footer, no buttons or links
  excludeRoles: ['heading'], // or any single ARIA role
  excludeSelectors: ['clr-header'], // drop layout that cannot be annotated
  rootSelector: 'main', // describe only the content area
  maxDepth: 3, // no nesting deeper than three levels
  focus: 'modal', // while a modal is open, describe only the modal
  collectionItems: 'summary', // counts and selection only, no item lists
});
`;

const PROVIDE_EXAMPLE = `
import { provideClrContextOptions, clrContextPreset } from '@clr/angular/ai';

// app.config.ts — every snapshot starts from these; per-call options are applied over them
providers: [provideClrContextOptions('interactive', { excludeSelectors: ['clr-header'] })];

// or explicit options
providers: [provideClrContextOptions({ maxComponents: 200, includeText: false })];

// a preset with overrides, for a single call
this.contextTracker.start({ snapshot: clrContextPreset('minimal', { maxComponents: 200 }) });
`;

const CHANGES_EXAMPLE = `
this.contextTracker.changes$.subscribe(change => {
  // change.added   — nodes that were not there before, with their subtrees
  // change.removed — nodes that are gone
  // change.changed — nodes whose own state differs: { before, after }
  // change.routeChanged / titleChanged / regionsChanged
  if (!isEmptyClrContextChange(change)) {
    assistant.send({ pageChanged: change });
  }
});

// The same comparison for snapshots obtained any other way:
const change = diffClrContext(previousSnapshot, currentSnapshot);
`;

const BUDGETS_EXAMPLE = `
this.contextEngine.getSnapshot({
  maxTextLength: 60, // truncate any text beyond 60 characters
  maxItemsPerCollection: 10, // at most 10 rows/tabs/links/options per component
  maxComponents: 30, // at most 30 components overall, counted across the whole tree
  includeDomComponents: false, // skip DOM scanning entirely (regions + route only)
});
`;

const MUTATION_POLICY_EXAMPLE = `
import { provideClrMutationPolicy } from '@clr/angular/ai';

bootstrapApplication(AppComponent, {
  providers: [
    provideClrMutationPolicy({
      // What each operation would do. Never inferred: the application declares it.
      classify: target => {
        if (target.operation === 'navigate') {
          return target.path?.startsWith('billing') ? 'consequential' : 'reversible';
        }
        // Judge the element rather than its label: a label is translated, and can repeat.
        return target.element?.closest('[data-agent-forbidden]') ? 'forbidden' : 'reversible';
      },
      // Asked before anything consequential is applied; resolving false refuses it.
      confirm: target => window.confirm(\`Go to \${target.url}?\`),
      // Told what an apply() did, so the person learns it too — in the application's words.
      announce: report => console.info(\`\${report.results.filter(result => result.applied).length} fields filled\`),
    }),
  ],
});
`;

const REFS_EXAMPLE = `
{
  "type": "combobox",
  "element": "clr-combobox",
  "ref": "e0c9h3tzp",
  "label": "Cluster",
  "state": { "options": ["Alpha cluster", "Beta cluster"], "value": null }
}
`;

const APPLY_EXAMPLE = `
const report = await this.mutationEngine.apply([
  { operation: 'setValue', ref: 'e7mq2k4xa', description: 'Name', value: 'Ada' },
  { operation: 'setValue', ref: 'e0c9h3tzp', description: 'Cluster', value: 'Beta cluster' },
  { operation: 'setValue', ref: 'e5bw81nre', description: 'When', value: '2026-03-06' },
  { operation: 'setValue', ref: 'e2kd6v0sm', description: 'Hosts', value: ['esx-01', 'esx-02'] },
  { operation: 'clear', ref: 'e9yx4q7lf', description: 'Notes' },
]);

// What each operation did, then the page as it is now and what changed.
report.results; // ClrMutationResult[]
report.snapshot; // a fresh ClrPageContext, with refs to continue from
report.changes; // diffClrContext(before, after)

// plan() resolves, classifies and coerces without writing anything.
const plan = this.mutationEngine.plan(operations);
`;

const RESULT_EXAMPLE = `
[
  {
    "operation": "setValue",
    "ref": "e7mq2k4xa",
    "applied": true,
    "value": "Ada",
    "previous": "",
    "status": "VALID"
  },
  {
    "operation": "setValue",
    "ref": "e0c9h3tzp",
    "applied": true,
    "value": "Beta cluster",
    "previous": null,
    "status": "VALID"
  },
  {
    "operation": "setValue",
    "ref": "e3pn5j2wd",
    "applied": true,
    "value": "",
    "previous": "seed",
    "status": "INVALID",
    "errors": { "required": true }
  },
  {
    "operation": "setValue",
    "ref": "e0c9h3tzp",
    "applied": false,
    "refused": "invalid",
    "detail": "No such option. The options are: \\"Alpha cluster\\", \\"Beta cluster\\"."
  },
  {
    "operation": "setValue",
    "ref": "e8ht0r6gu",
    "applied": false,
    "refused": "stale",
    "detail": "The ref does not name anything on the page. Take a new snapshot and use its refs."
  }
]
`;

const NAVIGATE_EXAMPLE = `
const report = await this.mutationEngine.apply([
  { operation: 'navigate', path: 'clusters/:id', params: { id: '42' }, queryParams: { tab: 'hosts' } },
]);

report.results[0];
// { operation: 'navigate', path: 'clusters/:id', applied: true, outcome: 'navigated', url: '/clusters/42?tab=hosts' }
// or: { applied: true, outcome: 'redirected', url: '/login' }
// or: { applied: false, outcome: 'rejected', url: '/', detail: 'A route guard refused the navigation.' }
`;

const ELEMENT_MUTATOR_EXAMPLE = `
import { publishElementMutator } from '@clr/angular/utils';

// A component whose form control takes something other than what an agent sees.
this.teardown = publishElementMutator(this.host.nativeElement, {
  // Turn the agent's proposal into what the control takes, or refuse with what would do.
  coerce: proposed => {
    const option = this.options.find(option => option.label === proposed);
    return option ? { value: option.id } : { refused: \`No such option. The options are: \${this.labels()}.\` };
  },
  // Read the current value back in the agent's terms.
  read: () => this.selectedOption()?.label ?? null,
});

// A component whose state is not a form control at all writes it itself.
publishElementMutator(host, {
  write: rows => { this.select(rows); return { value: this.selectedRowLabels() }; },
  read: () => this.selectedRowLabels(),
});
`;

@Component({
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
  optionsExample = OPTIONS_EXAMPLE;
  provideExample = PROVIDE_EXAMPLE;
  changesExample = CHANGES_EXAMPLE;
  mutationPolicyExample = MUTATION_POLICY_EXAMPLE;
  refsExample = REFS_EXAMPLE;
  applyExample = APPLY_EXAMPLE;
  resultExample = RESULT_EXAMPLE;
  navigateExample = NAVIGATE_EXAMPLE;
  elementMutatorExample = ELEMENT_MUTATOR_EXAMPLE;

  constructor() {
    super('contextual-engine');
  }
}
