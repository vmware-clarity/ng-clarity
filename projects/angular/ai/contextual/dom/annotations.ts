/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPublishedContext } from '../interfaces/context.interface';

/** Host element property through which `[clrContext]` annotates the element it sits on. */
export const CLR_CONTEXT_ANNOTATION_PROPERTY = 'clrContextAnnotation';

interface Annotation {
  getClrContext(): Partial<ClrPublishedContext> | null;
}

/** Whether the element carries an annotation that says something. */
export function hasAnnotation(element: Element): boolean {
  return CLR_CONTEXT_ANNOTATION_PROPERTY in element && annotationContext(element) !== null;
}

/** What the application says about the element: its label, type, state and the state keys that are public. */
export function annotationContext(element: Element): Partial<ClrPublishedContext> | null {
  const annotation = (element as Element & { [CLR_CONTEXT_ANNOTATION_PROPERTY]?: Annotation })[
    CLR_CONTEXT_ANNOTATION_PROPERTY
  ];
  try {
    return annotation?.getClrContext() ?? null;
  } catch {
    return null;
  }
}
