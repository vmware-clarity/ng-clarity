/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, DoCheck, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CLR_CONTEXT_IGNORE_SELECTOR } from '@clr/angular/utils';

import { ClrComponentContext, ClrContextProvider } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';

/**
 * Annotates a piece of UI with context for AI agents, such as what a section is for:
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 */
@Directive({
  selector: '[clrContext]',
})
export class ClrContext implements OnInit, DoCheck, OnDestroy, ClrContextProvider {
  /** Human-readable description of what this piece of UI is about. */
  @Input('clrContext') label = '';
  /** Kind of UI this annotation describes. Defaults to `'region'`. */
  @Input('clrContextType') type = 'region';
  /** Current application state an agent should know about, as a small serializable object. */
  @Input('clrContextState') state: Record<string, unknown> | null = null;

  private lastReported = '';
  private readonly host: ElementRef<Element> | null = inject(ElementRef, { optional: true });

  constructor(private readonly contextRegistry: ClrContextRegistryService) {}

  ngOnInit(): void {
    this.lastReported = this.serialized();
    this.contextRegistry.register(this, this.anchor() ?? undefined);
  }

  ngDoCheck(): void {
    // An annotation inside an ignored region never reaches a snapshot, so its changes don't count.
    if (this.anchor()?.closest(CLR_CONTEXT_IGNORE_SELECTOR)) {
      return;
    }
    // Serialised on every check to catch a state object edited in place; keep the state small.
    const current = this.serialized();
    if (current !== this.lastReported) {
      this.lastReported = current;
      this.contextRegistry.notifyChanged();
    }
  }

  ngOnDestroy(): void {
    this.contextRegistry.unregister(this);
  }

  getClrContext(): ClrComponentContext | null {
    const serialized = this.serialized();
    return serialized ? JSON.parse(serialized) : null;
  }

  private annotation(): ClrComponentContext | null {
    if (!this.label && !this.state) {
      return null;
    }
    const context: ClrComponentContext = { type: this.type };
    if (this.label) {
      context.label = this.label;
    }
    if (this.state && Object.keys(this.state).length) {
      context.state = this.state;
    }
    return context;
  }

  private serialized(): string {
    try {
      const annotation = this.annotation();
      return annotation ? JSON.stringify(annotation) : '';
    } catch {
      return '';
    }
  }

  /** On an `<ng-container>`, the element it sits in. */
  private anchor(): Element | null {
    const node: Node | undefined = this.host?.nativeElement;
    return node?.nodeType === Node.ELEMENT_NODE ? (node as Element) : (node?.parentElement ?? null);
  }
}
