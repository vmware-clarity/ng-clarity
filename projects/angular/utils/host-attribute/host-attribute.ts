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
 * Angular gives a directive's host binding the last word over an application binding of
 * the same attribute. This yields instead: an attribute written in the template is kept
 * as written, and once the application is seen setting the attribute, its binding owns
 * it from then on. Call {@link value} from the host binding getter.
 *
 * An application binding of `null` from the first render cannot be told apart from no
 * binding at all, so it does not remove the component's attribute; a component that
 * must be switched off offers an input for it.
 */
export class ClrHostAttribute {
  /** What the element held when the directive was created. */
  private readonly initial: string | null;
  /** The value the author wrote, `null` for none, `undefined` until the first {@link value} call decides. */
  private authored: string | null | undefined = undefined;
  private reported: string | null | undefined = undefined;
  private yielded = false;
  /** Whether the page was server-rendered; see {@link isServerRendered}. */
  private serverRendered?: boolean;

  constructor(
    private readonly element: Element | null | undefined,
    private readonly name: string
  ) {
    // Static attributes are set before the directive is created, so what the author
    // wrote is readable here and is not yet overwritten by the host binding. So is what
    // the server rendered for the component itself, on a page being hydrated: which of
    // the two it is is decided on the first `value` call.
    this.initial = element?.getAttribute(name) ?? null;
  }

  /**
   * What the attribute holds as of the last {@link value} call: the authored value, the
   * application's, or the component's. Lets a second binding that depends on this one —
   * a landmark's name on its role — read the outcome without evaluating it twice.
   */
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
    // The application's bindings run before the component's host bindings, so on the
    // first pass a value already on the element was bound by the application — even one
    // equal to what the component would say, unless a server rendered it.
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

  /**
   * Whether a value found on the element was put there by the application. On a page a
   * server rendered, a value equal to the component's own is what the server rendered for
   * the component, and keeps following it after hydration; anywhere else, any value is.
   */
  private isApplicationValue(found: string | null, next: string | null): boolean {
    return found !== null && (found !== next || !this.isServerRendered());
  }

  /**
   * Whether Angular marked the page as server-rendered (`ng-server-context` on its root).
   * Asked only when a value equal to the component's own is found, which on most pages is
   * never, since asking searches the document.
   */
  private isServerRendered(): boolean {
    return (this.serverRendered ??= !!this.element?.ownerDocument?.querySelector('[ng-server-context]'));
  }
}
