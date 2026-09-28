/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Marks an element whose value — and the values of everything inside it — must never
 * appear in a context snapshot. Use it for anything sensitive that the input type alone
 * does not reveal: an account number or an API token in a plain text field.
 *
 * The element is still described, so an agent knows it exists and that its value is
 * being withheld rather than being absent. Components that know they hold a secret
 * (a password field, whichever `type` it currently shows) set it on themselves.
 */
export const CLR_CONTEXT_REDACT_ATTRIBUTE = 'data-clr-context-redact';

/**
 * Elements carrying this attribute — and everything inside them — are invisible to the
 * engine: the collector never describes them, text they hold is never borrowed as
 * another element's name or description, and the context tracker ignores their
 * mutations. Put it on UI that consumes context (an AI chat panel, a debug view) so it
 * neither describes itself into the page context nor triggers tracking feedback loops.
 */
export const CLR_CONTEXT_IGNORE_ATTRIBUTE = 'data-clr-context-ignore';

/** Matches an element marked {@link CLR_CONTEXT_REDACT_ATTRIBUTE}; with `closest`, one inside a redacted region. */
export const CLR_CONTEXT_REDACT_SELECTOR = `[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`;

/** Matches an element marked {@link CLR_CONTEXT_IGNORE_ATTRIBUTE}; with `closest`, one inside an ignored region. */
export const CLR_CONTEXT_IGNORE_SELECTOR = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

/**
 * What page-context tooling treats as not on the page: hidden, hidden from assistive
 * technology, inert, or marked ignored — along with everything inside it. The contextual
 * engine and the components that publish context to it test against this one selector,
 * so they never disagree about what an agent may see.
 */
export const CLR_CONTEXT_HIDDEN_SELECTOR = `[hidden], [aria-hidden="true"], [inert], ${CLR_CONTEXT_IGNORE_SELECTOR}`;

/**
 * What page-context tooling never reads text from: everything
 * {@link CLR_CONTEXT_HIDDEN_SELECTOR} matches, and regions marked
 * `data-clr-context-redact`. A component that labels something from its content — a row
 * by its cells, an option by its text — leaves out every descendant this matches.
 */
export const CLR_CONTEXT_WITHHELD_SELECTOR = `${CLR_CONTEXT_HIDDEN_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}`;
