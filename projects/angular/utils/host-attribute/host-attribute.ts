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
 * and once the application is seen changing the attribute (its value differs from what
 * the component last reported), the application's binding owns it from then on.
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
    if (this.yielded || (this.reported !== undefined && current !== this.reported)) {
      this.yielded = true;
      this.reported = current;
      return current;
    }
    const next = computed === null || computed === false ? null : String(computed);
    this.reported = next;
    return next;
  }
}
