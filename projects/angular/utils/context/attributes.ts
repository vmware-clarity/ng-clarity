/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Marks an element whose value, and everything inside it, never appears in a snapshot.
 * The element is still described, so an agent knows the value is withheld rather than absent.
 */
export const CLR_CONTEXT_REDACT_ATTRIBUTE = 'data-clr-context-redact';

/**
 * Elements carrying this attribute, and everything inside them, are invisible to the engine and the tracker.
 * Put it on UI that consumes context, such as a chat panel, to avoid feedback loops.
 */
export const CLR_CONTEXT_IGNORE_ATTRIBUTE = 'data-clr-context-ignore';

export const CLR_CONTEXT_REDACT_SELECTOR = `[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`;

export const CLR_CONTEXT_IGNORE_SELECTOR = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

/** What page-context tooling treats as not on the page; shared so the engine and components agree. */
export const CLR_CONTEXT_HIDDEN_SELECTOR = `[hidden], [aria-hidden="true"], [inert], ${CLR_CONTEXT_IGNORE_SELECTOR}`;

/** An editing host; what it holds is user input, never text to read into a name. */
export const CLR_CONTEXT_EDITING_HOST_SELECTOR = '[contenteditable]:not([contenteditable="false" i])';

/** What page-context tooling never reads text from: hidden, redacted and editing-host content. */
export const CLR_CONTEXT_WITHHELD_SELECTOR = `${CLR_CONTEXT_HIDDEN_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}, ${CLR_CONTEXT_EDITING_HOST_SELECTOR}`;
