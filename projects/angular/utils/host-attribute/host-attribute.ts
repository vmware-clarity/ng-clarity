/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * An attribute a component sets through a host binding while respecting the
 * application's say over it.
 *
 * Angular gives a directive's host binding the last word when the application also binds
 * the same attribute dynamically, so a component that starts reporting an attribute —
 * `aria-invalid`, `role` — would silently override what an application already set
 * itself. This yields instead: an attribute written in the template is kept as written,
 * and once the application is seen setting the attribute (its value differs from what
 * the component last reported, or is already there when the component first reports),
 * the application's binding owns it from then on.
 *
 * Call {@link value} from the host binding getter with what the component would report.
 */
export class ClrHostAttribute {
  private readonly authored: string | null;
  private reported: string | null | undefined = undefined;
  private yielded = false;

  constructor(
    private readonly element: Element | null | undefined,
    private readonly name: string
  ) {
    // Static attributes are set before the directive is created, so what the author
    // wrote is readable here and is not yet overwritten by the host binding.
    this.authored = element?.getAttribute?.(name) ?? null;
  }

  /** What the host binding should return, given what the component would report. */
  value(computed: string | boolean | null): string | null {
    if (this.authored !== null) {
      return this.authored;
    }
    const current = this.element?.getAttribute?.(this.name) ?? null;
    const next = computed === null || computed === false ? null : String(computed);
    // The application's bindings run before the component's host bindings, so on the
    // first pass a value already on the element that is not the component's was bound
    // by the application. One equal to the component's is taken as its own, as it is
    // when a server-rendered page is hydrated.
    const applicationSet =
      this.reported === undefined ? current !== null && current !== next : current !== this.reported;
    if (this.yielded || applicationSet) {
      this.yielded = true;
      this.reported = current;
      return current;
    }
    this.reported = next;
    return next;
  }
}
