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
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClrContextService } from '@clr/angular/ai';

@Component({
  selector: 'app-assistant',
  template: '...',
})
export class AssistantComponent {
  private readonly context = inject(ClrContextService);

  constructor() {
    // The current page, kept up to date: emits whenever what is on screen changes.
    this.context
      .watch()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(page => console.log(page.components));
  }

  async ask(question: string) {
    // Or one snapshot, taken now. Send it to your model as data, delimited from your prompt.
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

const WATCH_EXAMPLE = `
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClrContextService } from '@clr/angular/ai';

@Component({
  // ...
})
export class AssistantPanelComponent implements OnInit {
  private readonly context = inject(ClrContextService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    // One watcher is shared: watch() starts it if nobody has, and stops it once the
    // last subscriber is gone.
    this.context
      .watch({ maxComponents: 50 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(context => this.setPageContext(context));
  }
}
`;

const IGNORE_EXAMPLE = `
<!-- The assistant panel renders the context, so the engine must not describe it
     and watch() must not react to its re-renders. -->
<aside class="assistant-panel" data-clr-context-ignore>...</aside>
`;

const DIRECTIVE_EXAMPLE = `
<!-- Your own code sees all of the state. window.clrContext() sees only ruleCount. -->
<section
  clrContext="Firewall rules for the selected cluster"
  [clrContextState]="{ cluster: clusterName, ruleCount: rules.length }"
  [clrContextPublicKeys]="['ruleCount']"
>
  ...
</section>
`;

const DIRECTIVE_STANDALONE_EXAMPLE = `
import { ClrContext } from '@clr/angular/ai';

@Component({
  imports: [ClrContext],
  template: \`<section clrContext="Firewall rules for the selected cluster">...</section>\`,
})
export class FirewallComponent {}
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
  // Callers the application does not control see only these keys.
  // The value is withheld from them in any case, unless the application shares form values.
  publicKeys: ['options'],
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
        publicKeys: ['messages'], // shared with window.clrContext() too
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

const GLOBAL_ACCESS_EXAMPLE = `
this.context.enableGlobalAccess();
// Browser-driving agents can now call window.clrContext() for a fresh snapshot.
// Values the user typed are withheld, because any script on the page can call it.
// Published state reaches it only under the keys its publisher lists in publicKeys.

// Share them deliberately, if that is what you mean:
this.context.enableGlobalAccess('clrContext', { shareFormValues: true });
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
this.context.changes().subscribe(change => {
  // change.added   — nodes that were not there before, with their subtrees
  // change.removed — nodes that are gone
  // change.changed — nodes whose own state differs: { before, after }
  // change.viewChanged — application, view id, enabled or metadata
  // change.routeChanged / titleChanged / regionsChanged
  if (!clrIsEmptyContextChange(change)) {
    assistant.send({ pageChanged: change });
  }
});

// The same comparison for snapshots obtained any other way:
const change = clrDiffContext(previousSnapshot, currentSnapshot);
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
  watchExample = WATCH_EXAMPLE;
  ignoreExample = IGNORE_EXAMPLE;
  directiveExample = DIRECTIVE_EXAMPLE;
  directiveStandaloneExample = DIRECTIVE_STANDALONE_EXAMPLE;
  directiveModuleExample = DIRECTIVE_MODULE_EXAMPLE;
  elementContextExample = ELEMENT_CONTEXT_EXAMPLE;
  extractorExample = EXTRACTOR_EXAMPLE;
  formContextExample = FORM_CONTEXT_EXAMPLE;
  redactExample = REDACT_EXAMPLE;
  globalAccessExample = GLOBAL_ACCESS_EXAMPLE;
  budgetsExample = BUDGETS_EXAMPLE;
  optionsExample = OPTIONS_EXAMPLE;
  provideExample = PROVIDE_EXAMPLE;
  changesExample = CHANGES_EXAMPLE;

  constructor() {
    super('contextual-engine');
  }
}
