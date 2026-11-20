/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, DoCheck, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CLR_CONTEXT_IGNORE_SELECTOR } from '@clr/angular/utils';

import { CLR_CONTEXT_ANNOTATION_PROPERTY } from './dom/annotations';
import { closestAcrossShadow } from './dom/shadow';
import { ClrPublishedContext } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';

/**
 * Annotates the element it sits on with context for AI agents, such as what a section is for:
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 * The annotation is reported on that element's node in `components`, merged over what the DOM says about it.
 */
@Directive({
  selector: '[clrContext]',
})
export class ClrContext implements OnInit, DoCheck, OnDestroy {
  /** Human-readable description of what this piece of UI is about. */
  @Input('clrContext') label = '';
  /** Kind of UI this annotation describes; by default the element's role, or `'group'` without one. */
  @Input('clrContextType') type = '';
  /** Current application state an agent should know about, as a small serializable object. */
  @Input('clrContextState') state: Record<string, unknown> | null = null;

  private lastReported = '';
  private annotated: Element | null = null;
  private readonly host: ElementRef<Element> | null = inject(ElementRef, { optional: true });
  private readonly contextRegistry = inject(ClrContextRegistryService);

  ngOnInit(): void {
    this.lastReported = this.serialized();
    this.annotated = this.anchor();
    if (this.annotated) {
      (this.annotated as unknown as Record<string, unknown>)[CLR_CONTEXT_ANNOTATION_PROPERTY] = this;
      this.contextRegistry.notifyChanged();
    }
  }

  ngDoCheck(): void {
    // An annotation inside an ignored region never reaches a snapshot, so its changes don't count.
    if (this.annotated && closestAcrossShadow(this.annotated, CLR_CONTEXT_IGNORE_SELECTOR)) {
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
    const host = this.annotated as unknown as Record<string, unknown> | null;
    if (host?.[CLR_CONTEXT_ANNOTATION_PROPERTY] === this) {
      delete host[CLR_CONTEXT_ANNOTATION_PROPERTY];
      this.contextRegistry.notifyChanged();
    }
  }

  /** The annotation as it is now, or `null` when it says nothing. */
  getClrContext(): Partial<ClrPublishedContext> | null {
    const serialized = this.serialized();
    return serialized ? JSON.parse(serialized) : null;
  }

  private annotation(): Partial<ClrPublishedContext> | null {
    if (!this.label && !this.state && !this.type) {
      return null;
    }
    const context: Partial<ClrPublishedContext> = {};
    if (this.type) {
      context.type = this.type;
    }
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

  /** On an `<ng-container>`, the element it sits in, or the host of the shadow root it sits at the top of. */
  private anchor(): Element | null {
    const node: Node | undefined = this.host?.nativeElement;
    if (node?.nodeType === Node.ELEMENT_NODE) {
      return node as Element;
    }
    return node?.parentElement ?? (node?.parentNode as ShadowRoot | null)?.host ?? null;
  }
}
