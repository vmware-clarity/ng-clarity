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
      "state": { "severity": "warning" },
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

const MUTATION_POLICY_EXAMPLE = `
import { ClrMutationConsequence, ClrMutationTarget, provideClrMutationPolicy } from '@clr/angular/ai';

// The routes an agent may go to, and what going there means. Every other route is forbidden.
const AGENT_ROUTES = new Map<string, ClrMutationConsequence>([
  ['vms', 'reversible'],
  ['vms/:id', 'reversible'],
  ['billing', 'consequential'],
]);
// The query parameters an agent may add. The agent chooses them; the route does not constrain them.
const AGENT_QUERY_PARAMS = new Set(['tab', 'filter']);

function classify(target: ClrMutationTarget): ClrMutationConsequence {
  if (target.operation === 'navigate') {
    const query = Object.keys(target.queryParams ?? {});
    if (query.some(key => !AGENT_QUERY_PARAMS.has(key))) {
      return 'forbidden';
    }
    return AGENT_ROUTES.get(target.path ?? '') ?? 'forbidden';
  }
  // Fields are opted in, in the template, with data-agent-fill or data-agent-confirm.
  // Judge the element rather than its label: a label is translated, and can repeat.
  if (target.element?.closest('[data-agent-confirm]')) {
    return 'consequential';
  }
  return target.element?.closest('[data-agent-fill]') ? 'reversible' : 'forbidden';
}

bootstrapApplication(AppComponent, {
  providers: [
    provideClrMutationPolicy({
      classify,
      // Asked before anything consequential is applied; resolving false refuses it.
      confirm: target =>
        window.confirm(target.url ? \`Go to \${target.url}?\` : \`Set \${target.label} to \${JSON.stringify(target.value)}?\`),
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
report.changes; // clrDiffContext(before, after)

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
import { publishElementContext, publishElementMutator } from '@clr/angular/utils';

// A writable component publishes its current value, in the agent's terms, as state.value.
// The engine reads it before and after a write.
this.teardownContext = publishElementContext(this.host.nativeElement, () => ({
  type: 'combobox',
  state: { value: this.selectedOption()?.label ?? null },
}));

// A component whose form control takes something other than what an agent sees.
this.teardown = publishElementMutator(this.host.nativeElement, {
  // Turn the agent's proposal into what the control takes, and what the policy and a
  // confirmation show, or refuse with what would do.
  coerce: proposed => {
    const option = this.options.find(option => option.label === proposed);
    return option
      ? { value: option.id, display: option.label }
      : { refused: \`No such option. The options are: \${this.labels()}.\` };
  },
});

// A component whose state is not a form control at all writes it itself.
publishElementMutator(host, {
  write: rows => { this.select(rows); return { value: this.selectedRowLabels() }; },
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
  directiveStandaloneExample = DIRECTIVE_STANDALONE_EXAMPLE;
  directiveModuleExample = DIRECTIVE_MODULE_EXAMPLE;
  elementContextExample = ELEMENT_CONTEXT_EXAMPLE;
  extractorExample = EXTRACTOR_EXAMPLE;
  formContextExample = FORM_CONTEXT_EXAMPLE;
  redactExample = REDACT_EXAMPLE;
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
