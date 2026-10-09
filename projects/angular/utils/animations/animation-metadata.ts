/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Structural equivalents of the animation metadata produced by the `@angular/animations` package
 * (`style()`, `animate()`, `transition()`, ...).
 *
 * Clarity itself animates with native CSS and does not depend on `@angular/animations` anymore. The deprecated
 * animation helpers below keep producing the objects Angular's animation engine understands, so that applications
 * which still use the package can keep passing them to their own `trigger()` definitions.
 *
 * The numeric `type` codes match Angular's `AnimationMetadataType` enum.
 *
 * @deprecated Use native CSS animations, for example the `clr-fade-*` and `clr-slide-*` classes, instead.
 */
export type ClrAnimationStyles =
  '*' | { [key: string]: string | number } | Array<{ [key: string]: string | number } | '*'>;

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationOptions {
  delay?: number | string;
  params?: { [name: string]: any };
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationStyleMetadata {
  type: 6;
  styles: ClrAnimationStyles;
  offset: number | null;
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationAnimateMetadata {
  type: 4;
  timings: string | number;
  styles: ClrAnimationStyleMetadata | null;
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationStateMetadata {
  type: 0;
  name: string;
  styles: ClrAnimationStyleMetadata;
  options?: { params: { [name: string]: any } };
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationTransitionMetadata {
  type: 1;
  expr: string;
  animation: ClrAnimationMetadata | ClrAnimationMetadata[];
  options: ClrAnimationOptions | null;
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationReferenceMetadata {
  type: 8;
  animation: ClrAnimationMetadata | ClrAnimationMetadata[];
  options: ClrAnimationOptions | null;
}

/** @deprecated see {@link ClrAnimationStyles} */
export interface ClrAnimationTriggerMetadata {
  type: 7;
  name: string;
  definitions: ClrAnimationMetadata[];
  options: { params?: { [name: string]: any } } | null;
}

/** @deprecated see {@link ClrAnimationStyles} */
export type ClrAnimationMetadata =
  | ClrAnimationStyleMetadata
  | ClrAnimationAnimateMetadata
  | ClrAnimationStateMetadata
  | ClrAnimationTransitionMetadata
  | ClrAnimationReferenceMetadata
  | ClrAnimationTriggerMetadata;

/** Equivalent of `style()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationStyle(styles: ClrAnimationStyles): ClrAnimationStyleMetadata {
  return { type: 6, styles, offset: null };
}

/** Equivalent of `animate()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationAnimate(
  timings: string | number,
  styles: ClrAnimationStyleMetadata | null = null
): ClrAnimationAnimateMetadata {
  return { type: 4, styles, timings };
}

/** Equivalent of `state()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationState(
  name: string,
  styles: ClrAnimationStyleMetadata,
  options?: { params: { [name: string]: any } }
): ClrAnimationStateMetadata {
  return { type: 0, name, styles, options };
}

/** Equivalent of `transition()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationTransition(
  expr: string,
  steps: ClrAnimationMetadata | ClrAnimationMetadata[],
  options: ClrAnimationOptions | null = null
): ClrAnimationTransitionMetadata {
  return { type: 1, expr, animation: steps, options };
}

/** Equivalent of `animation()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationReference(
  steps: ClrAnimationMetadata | ClrAnimationMetadata[],
  options: ClrAnimationOptions | null = null
): ClrAnimationReferenceMetadata {
  return { type: 8, animation: steps, options };
}

/** Equivalent of `trigger()` from `@angular/animations`. @deprecated see {@link ClrAnimationStyles} */
export function animationTrigger(name: string, definitions: ClrAnimationMetadata[]): ClrAnimationTriggerMetadata {
  return { type: 7, name, definitions, options: {} };
}
