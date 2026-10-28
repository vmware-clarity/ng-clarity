/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, DoCheck, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CLR_CONTEXT_IGNORE_SELECTOR } from '@clr/angular/utils';

import { closestAcrossShadow } from './dom/shadow';
import { ClrContextProvider, ClrPublishedContext } from './interfaces/context.interface';
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
  /** State keys untrusted callers (`window.clrContext()`, frames) may see; every other key is withheld. */
  @Input('clrContextPublicKeys') publicKeys: readonly string[] | null = null;

  private lastReported = '';
  private readonly host: ElementRef<Element> | null = inject(ElementRef, { optional: true });
  private readonly contextRegistry = inject(ClrContextRegistryService);

  ngOnInit(): void {
    this.lastReported = this.serialized();
    this.contextRegistry.register(this, this.anchor() ?? undefined);
  }

  ngDoCheck(): void {
    // An annotation inside an ignored region never reaches a snapshot, so its changes don't count.
    const anchor = this.anchor();
    if (anchor && closestAcrossShadow(anchor, CLR_CONTEXT_IGNORE_SELECTOR)) {
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

  /** The context this element publishes, or `null` when it is ignored. */
  getClrContext(): ClrPublishedContext | null {
    const serialized = this.serialized();
    return serialized ? JSON.parse(serialized) : null;
  }

  private annotation(): ClrPublishedContext | null {
    if (!this.label && !this.state) {
      return null;
    }
    const context: ClrPublishedContext = { type: this.type };
    if (this.label) {
      context.label = this.label;
    }
    if (this.state && Object.keys(this.state).length) {
      context.state = this.state;
    }
    if (this.publicKeys?.length) {
      context.publicKeys = this.publicKeys;
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

  /** On an `<ng-container>`, the element it sits in, or the host of the shadow root it sits at the top of. */
  private anchor(): Element | null {
    const node: Node | undefined = this.host?.nativeElement;
    if (node?.nodeType === Node.ELEMENT_NODE) {
      return node as Element;
    }
    return node?.parentElement ?? (node?.parentNode as ShadowRoot | null)?.host ?? null;
  }
}
