/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  CLR_CONTEXT_DEFAULT_OPTIONS,
  CLR_CONTEXT_PRESETS,
  ClrContextCategory,
  ClrContextChange,
  ClrContextPreset,
  ClrContextService,
  ClrContextSnapshotOptions,
  clrDiffContext,
  ClrPageContext,
} from '@clr/angular/ai';

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
  { name: 'frames', covers: 'embedded frames' },
];

/** Live playground for the snapshot options; marked `data-clr-context-ignore` so it never describes itself. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-context-playground',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  host: { 'data-clr-context-ignore': '', class: 'clr-context-playground' },
  templateUrl: './context-playground.component.html',
  styleUrls: ['./context-playground.component.scss'],
})
export class ContextPlaygroundComponent implements OnInit {
  /** Caps the component budget so a playground cannot flood a page. */
  @Input() maxBudget = 1000;

  readonly categories = CATEGORIES;

  preset: ClrContextPreset | 'custom' = 'full';
  maxComponents = CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents;
  maxItemsPerCollection = CLR_CONTEXT_DEFAULT_OPTIONS.maxItemsPerCollection;
  root = '';
  excluded: Record<string, boolean> = {};
  excludeSelectors = '';

  snapshotJson = '';
  bytes = 0;
  nodes = 0;
  truncated = false;
  focus: string | null = null;
  change: ClrContextChange | null = null;
  optionsJson = '{}';

  private previous: ClrPageContext | null = null;

  constructor(private readonly contextEngine: ClrContextService) {}

  ngOnInit(): void {
    this.run();
  }

  applyPreset(preset: ClrContextPreset | 'custom'): void {
    this.preset = preset;
    if (preset === 'custom') {
      return;
    }
    const options = { ...CLR_CONTEXT_DEFAULT_OPTIONS, ...CLR_CONTEXT_PRESETS[preset] };
    this.maxComponents = options.maxComponents;
    this.maxItemsPerCollection = options.maxItemsPerCollection;
    this.root = options.root === 'page' ? '' : options.root;
    const categories = new Set<string>(options.excludeCategories);
    for (const { name } of CATEGORIES) {
      this.excluded[name] = categories.has(name);
    }
    this.excludeSelectors = options.excludeSelectors.join(', ');
    this.run();
  }

  edited(): void {
    this.preset = 'custom';
    this.run();
  }

  currentOptions(): ClrContextSnapshotOptions {
    const options: ClrContextSnapshotOptions = {
      maxComponents: Math.min(this.maxComponents, this.maxBudget),
      maxItemsPerCollection: this.maxItemsPerCollection,
    };
    if (this.root.trim()) {
      options.root = this.root.trim();
    }
    const categories = CATEGORIES.map(({ name }) => name).filter(name => this.excluded[name]);
    if (categories.length) {
      options.excludeCategories = categories;
    }
    const selectors = list(this.excludeSelectors);
    if (selectors.length) {
      options.excludeSelectors = selectors;
    }
    return options;
  }

  async run(): Promise<void> {
    const options = this.currentOptions();
    const snapshot = await this.contextEngine.snapshot(options);
    this.optionsJson = JSON.stringify(options, null, 2);
    this.snapshotJson = JSON.stringify(snapshot, null, 2);
    this.bytes = JSON.stringify(snapshot).length;
    this.nodes = snapshot.components.reduce((total, node) => total + countNodes(node), 0);
    this.truncated = snapshot.truncated === true;
    this.focus = snapshot.focus ?? null;
    this.change = this.previous ? clrDiffContext(this.previous, snapshot) : null;
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
