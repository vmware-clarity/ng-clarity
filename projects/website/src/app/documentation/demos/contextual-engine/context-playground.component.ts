/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  CLR_CONTEXT_DEFAULT_OPTIONS,
  CLR_CONTEXT_PRESETS,
  ClrContextCategory,
  ClrContextChange,
  ClrContextIgnore,
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

/** Live playground for the snapshot options; marked `clrContextIgnore` so it never describes itself. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-context-playground',
  standalone: true,
  imports: [FormsModule, ClarityModule],
  hostDirectives: [ClrContextIgnore],
  host: { class: 'clr-context-playground' },
  templateUrl: './context-playground.component.html',
  styleUrls: ['./context-playground.component.scss'],
})
export class ContextPlaygroundComponent implements OnInit {
  readonly categories = CATEGORIES;

  preset: ClrContextPreset | 'custom' = 'full';
  /** Empty describes every level. */
  depth: number | null = null;
  root = '';
  excluded: Record<string, boolean> = {};
  excludeSelectors = '';

  snapshotJson = '';
  bytes = 0;
  nodes = 0;
  truncated = false;
  modal = false;
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
    this.depth = Number.isFinite(options.depth) ? options.depth : null;
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
    const options: ClrContextSnapshotOptions = {};
    if (this.depth) {
      options.depth = this.depth;
    }
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
    this.modal = !!snapshot.modal;
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
