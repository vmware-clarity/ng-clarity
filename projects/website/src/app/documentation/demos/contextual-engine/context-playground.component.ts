/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  CLR_CONTEXT_DEFAULT_OPTIONS,
  ClrContextCategory,
  ClrContextChange,
  ClrContextEngineService,
  ClrContextPreset,
  clrContextPreset,
  ClrContextSnapshotOptions,
  ClrPageContext,
  diffClrContext,
} from '@clr/angular/ai';

/** Every category, with what it stands for, in the order the controls show them. */
const CATEGORIES: { name: ClrContextCategory; covers: string }[] = [
  { name: 'layout', covers: 'header, navigation, footer, side panels' },
  { name: 'actions', covers: 'buttons, links, menus' },
  { name: 'forms', covers: 'forms and every control' },
  { name: 'headings', covers: 'headings' },
  { name: 'collections', covers: 'grids, tables, lists, tabs, trees' },
  { name: 'dialogs', covers: 'dialogs' },
  { name: 'status', covers: 'alerts, status, progress' },
  { name: 'images', covers: 'images, figures' },
  { name: 'text', covers: 'prose with no role' },
  { name: 'frames', covers: 'same-origin frames' },
];

/**
 * A live playground for the snapshot options: every control maps to one option, the
 * snapshot of the surrounding page is taken again on each change, and the result is
 * shown with its size — so the effect of each option is visible on the page it is on.
 * The playground itself is marked `data-clr-context-ignore` so it never describes itself.
 *
 * The demo app and the website each build this component from their own copy, kept
 * identical. The other copy is in
 * `projects/demo/src/app/contextual/`; change both.
 */
@Component({
  selector: 'clr-context-playground',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  host: { 'data-clr-context-ignore': '', class: 'clr-context-playground' },
  templateUrl: './context-playground.component.html',
  styleUrls: ['./context-playground.component.scss'],
})
export class ContextPlaygroundComponent implements OnInit {
  /** The largest component budget the controls allow, so a playground cannot flood a page. */
  @Input() maxBudget = 1000;

  readonly categories = CATEGORIES;

  preset: ClrContextPreset | 'custom' = 'full';
  maxComponents = CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents;
  maxItemsPerCollection = CLR_CONTEXT_DEFAULT_OPTIONS.maxItemsPerCollection;
  maxTextLength = CLR_CONTEXT_DEFAULT_OPTIONS.maxTextLength;
  maxDepth = CLR_CONTEXT_DEFAULT_OPTIONS.maxDepth;
  focusModal = false;
  summaryCollections = false;
  includeRoutes = false;
  excluded: Record<string, boolean> = {};
  excludeRoles = '';
  excludeSelectors = '';
  rootSelector = '';

  snapshotJson = '';
  bytes = 0;
  nodes = 0;
  truncated = false;
  routes = 0;
  focus: string | null = null;
  change: ClrContextChange | null = null;
  optionsJson = '{}';

  private previous: ClrPageContext | null = null;

  constructor(private readonly contextEngine: ClrContextEngineService) {}

  ngOnInit(): void {
    this.run();
  }

  /** Fills the controls from a preset, then snapshots. */
  applyPreset(preset: ClrContextPreset | 'custom'): void {
    this.preset = preset;
    if (preset === 'custom') {
      return;
    }
    const options = { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...clrContextPreset(preset) };
    this.maxComponents = options.maxComponents;
    this.maxItemsPerCollection = options.maxItemsPerCollection;
    this.maxTextLength = options.maxTextLength;
    this.maxDepth = options.maxDepth;
    this.focusModal = options.focus === 'modal';
    this.summaryCollections = options.collectionItems === 'summary';
    this.includeRoutes = options.includeRoutes === true;
    const categories = new Set<string>(options.excludeCategories ?? []);
    if (options.includeText === false) {
      categories.add('text');
    }
    if (options.includeFrames === false) {
      categories.add('frames');
    }
    for (const { name } of CATEGORIES) {
      this.excluded[name] = categories.has(name);
    }
    this.excludeRoles = (options.excludeRoles ?? []).join(', ');
    this.excludeSelectors = (options.excludeSelectors ?? []).join(', ');
    this.rootSelector = options.rootSelector ?? '';
    this.run();
  }

  /** A control changed by hand: the preset no longer describes the controls. */
  edited(): void {
    this.preset = 'custom';
    this.run();
  }

  /** The options the controls currently describe, as they would be passed to the engine. */
  currentOptions(): ClrContextSnapshotOptions {
    const options: ClrContextSnapshotOptions = {
      maxComponents: Math.min(this.maxComponents, this.maxBudget),
      maxItemsPerCollection: this.maxItemsPerCollection,
      maxTextLength: this.maxTextLength,
    };
    if (this.maxDepth > 0) {
      options.maxDepth = this.maxDepth;
    }
    if (this.focusModal) {
      options.focus = 'modal';
    }
    if (this.summaryCollections) {
      options.collectionItems = 'summary';
    }
    if (this.includeRoutes) {
      options.includeRoutes = true;
    }
    const categories = CATEGORIES.map(({ name }) => name).filter(name => this.excluded[name]);
    if (categories.length) {
      options.excludeCategories = categories;
    }
    const roles = list(this.excludeRoles);
    if (roles.length) {
      options.excludeRoles = roles;
    }
    const selectors = list(this.excludeSelectors);
    if (selectors.length) {
      options.excludeSelectors = selectors;
    }
    if (this.rootSelector.trim()) {
      options.rootSelector = this.rootSelector.trim();
    }
    return options;
  }

  /** Snapshots the page with the current options and reports what changed since the last run. */
  run(): void {
    const options = this.currentOptions();
    const snapshot = this.contextEngine.getSnapshot(options);
    this.optionsJson = JSON.stringify(options, null, 2);
    this.snapshotJson = JSON.stringify(snapshot, null, 2);
    this.bytes = JSON.stringify(snapshot).length;
    this.nodes = snapshot.components.reduce((total, node) => total + countNodes(node), 0);
    this.truncated = snapshot.truncated === true;
    this.routes = snapshot.availableRoutes?.length ?? 0;
    this.focus = snapshot.focus ?? null;
    this.change = this.previous ? diffClrContext(this.previous, snapshot) : null;
    this.previous = snapshot;
  }

  labelsOf(nodes: { type: string; label?: string }[]): string {
    return nodes
      .slice(0, 5)
      .map(node => `${node.type}${node.label ? ` "${node.label}"` : ''}`)
      .join(', ');
  }
}

function list(value: string): string[] {
  return value
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);
}

function countNodes(node: { children?: unknown[] }): number {
  return (
    1 + ((node.children ?? []) as { children?: unknown[] }[]).reduce((total, child) => total + countNodes(child), 0)
  );
}
