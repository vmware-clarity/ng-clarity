/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * A host-bound attribute that yields to the application: a template value is kept, and once the
 * application binds the attribute, its binding wins. A `null` binding from the first render cannot be detected.
 */
export class ClrHostAttribute {
  private readonly initial: string | null;
  private authored: string | null | undefined = undefined;
  private reported: string | null | undefined = undefined;
  private yielded = false;
  private serverRendered?: boolean;

  constructor(
    private readonly element: Element | null | undefined,
    private readonly name: string
  ) {
    // Static attributes, and server-rendered ones, are set before the directive is created.
    this.initial = element?.getAttribute(name) ?? null;
  }

  /** The value as of the last {@link value} call, for a binding that depends on this one. */
  get current(): string | null {
    return this.authored ?? this.reported ?? null;
  }

  /** What the host binding should return, given what the component would report. */
  value(computed: string | boolean | null): string | null {
    const next = computed === null || computed === false ? null : String(computed);
    if (this.authored === undefined) {
      this.authored = this.isApplicationValue(this.initial, next) ? this.initial : null;
    }
    if (this.authored !== null) {
      return this.authored;
    }
    const current = this.element?.getAttribute(this.name) ?? null;
    // Application bindings run before host bindings, so a value already present on the first pass is the application's.
    const applicationSet =
      this.reported === undefined ? this.isApplicationValue(current, next) : current !== this.reported;
    if (this.yielded || applicationSet) {
      this.yielded = true;
      this.reported = current;
      return current;
    }
    this.reported = next;
    return next;
  }

  /** On a server-rendered page, a value equal to the component's own came from the server. */
  private isApplicationValue(found: string | null, next: string | null): boolean {
    return found !== null && (found !== next || !this.isServerRendered());
  }

  /** Searches the document, so asked only when a value equal to the component's is found. */
  private isServerRendered(): boolean {
    return (this.serverRendered ??= !!this.element?.ownerDocument?.querySelector('[ng-server-context]'));
  }
}
