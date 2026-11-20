/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostAttributeToken, inject, input, isDevMode, OnDestroy, OnInit } from '@angular/core';

import { annotate } from './dom/annotations';
import { ClrPublishedContext } from './interfaces/context.interface';

/** What `[clrContext]` takes: the annotation, or a function that returns it when a snapshot is taken. */
export type ClrContextAnnotation =
  Partial<ClrPublishedContext> | (() => Partial<ClrPublishedContext> | null | undefined);

/**
 * Annotates the element it sits on with context for AI agents, such as what a section is for. It takes a
 * property binding only, so nothing it says is written to the DOM:
 * ```ts
 * readonly rules = () => ({ label: 'Firewall rules', state: { cluster: this.cluster() } });
 * ```
 * ```html
 * <section [clrContext]="rules">
 * ```
 * The annotation is reported on that element's node in `components`, merged over what the DOM says about it.
 */
@Directive({
  selector: '[clrContext]',
})
export class ClrContext implements OnInit, OnDestroy {
  /** `{ label, type, state }` for the element, or a function returning it. Read each time a snapshot is taken. */
  readonly clrContext = input.required<ClrContextAnnotation>();

  private readonly host: ElementRef<Node> | null = inject(ElementRef, { optional: true });
  private readonly staticText = inject(new HostAttributeToken('clrContext'), { optional: true });
  private unannotate: (() => void) | null = null;

  ngOnInit(): void {
    if (this.staticText !== null) {
      if (isDevMode()) {
        throw new Error(
          'clrContext takes a property binding, such as [clrContext]="sectionContext". ' +
            'Static text would be readable in the DOM, so it is ignored.'
        );
      }
      return;
    }
    const element = this.anchor();
    if (element) {
      this.unannotate = annotate(element, () => this.annotation());
    }
  }

  ngOnDestroy(): void {
    this.unannotate?.();
  }

  private annotation(): Partial<ClrPublishedContext> | null {
    const bound = this.clrContext();
    const context = typeof bound === 'function' ? bound() : bound;
    return context && typeof context === 'object' ? context : null;
  }

  /** On an `<ng-container>`, the element it sits in. */
  private anchor(): Element | null {
    const node = this.host?.nativeElement;
    if (node?.nodeType === Node.ELEMENT_NODE) {
      return node as Element;
    }
    return node?.parentElement ?? null;
  }
}
