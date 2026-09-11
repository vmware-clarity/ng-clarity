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
  ClrContextChange,
  clrContextPreset,
  ClrContextPreset,
  ClrContextSnapshotOptions,
  ClrContextualEngineService,
  ClrPageContext,
  diffClrContext,
} from '@clr/angular/ai';

/** Landmark roles an application typically wants to leave out as chrome. */
const LANDMARK_ROLES = ['navigation', 'banner', 'contentinfo', 'complementary'] as const;

/**
 * A live playground for the snapshot options: every control maps to one option, the
 * snapshot of the surrounding page is taken again on each change, and the result is
 * shown with its size — so the effect of each option is visible on the page it is on.
 * The playground itself is marked `data-clr-context-ignore` so it never describes itself.
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

  readonly landmarkRoles = LANDMARK_ROLES;

  preset: ClrContextPreset | 'custom' = 'full';
  maxComponents = 300;
  maxItemsPerCollection = 25;
  maxTextLength = 100;
  maxDepth = 0;
  includeText = true;
  includeFrames = true;
  focusModal = false;
  summaryCollections = false;
  excludedRoles: Record<string, boolean> = {
    navigation: false,
    banner: false,
    contentinfo: false,
    complementary: false,
  };
  excludeSelectors = '';
  rootSelector = '';

  snapshotJson = '';
  bytes = 0;
  nodes = 0;
  truncated = false;
  focus: string | null = null;
  change: ClrContextChange | null = null;
  optionsJson = '{}';

  private previous: ClrPageContext | null = null;

  constructor(private readonly contextEngine: ClrContextualEngineService) {}

  ngOnInit(): void {
    this.run();
  }

  /** Fills the controls from a preset, then snapshots. */
  applyPreset(preset: ClrContextPreset | 'custom'): void {
    this.preset = preset;
    if (preset === 'custom') {
      return;
    }
    const options = clrContextPreset(preset);
    this.maxComponents = options.maxComponents ?? 300;
    this.maxItemsPerCollection = options.maxItemsPerCollection ?? 25;
    this.maxTextLength = options.maxTextLength ?? 100;
    this.maxDepth = options.maxDepth ?? 0;
    this.includeText = options.includeText ?? true;
    this.includeFrames = options.includeFrames ?? true;
    this.focusModal = options.focus === 'modal';
    this.summaryCollections = options.collectionItems === 'summary';
    for (const role of LANDMARK_ROLES) {
      this.excludedRoles[role] = (options.excludeRoles ?? []).includes(role);
    }
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
      includeText: this.includeText,
      includeFrames: this.includeFrames,
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
    const roles = LANDMARK_ROLES.filter(role => this.excludedRoles[role]);
    if (roles.length) {
      options.excludeRoles = roles;
    }
    const selectors = this.excludeSelectors
      .split(',')
      .map(selector => selector.trim())
      .filter(Boolean);
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

function countNodes(node: { children?: unknown[] }): number {
  return (
    1 + ((node.children ?? []) as { children?: unknown[] }[]).reduce((total, child) => total + countNodes(child), 0)
  );
}
