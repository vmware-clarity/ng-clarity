/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  animationAnimate,
  animationReference,
  animationState,
  animationStyle,
  animationTransition,
  animationTrigger,
} from './animation-metadata';
import { collapse } from './collapse';
import { defaultExpandAnimation } from './constants';
import { fade } from './fade';

// The metadata must keep the shape of the one created by the `@angular/animations` functions, so that applications
// can still pass it to them. The type codes are the values of `AnimationMetadataType`.
describe('Animation metadata', () => {
  it('has the shape of the @angular/animations metadata', () => {
    const style = animationStyle({ opacity: 0 });
    expect(style).toEqual({ type: 6, styles: { opacity: 0 }, offset: null });
    expect(animationAnimate('1s', style)).toEqual({ type: 4, styles: style, timings: '1s' });
    expect(animationAnimate(100)).toEqual({ type: 4, styles: null, timings: 100 });
    expect(animationState('open', style)).toEqual({ type: 0, name: 'open', styles: style, options: undefined });
    expect(animationTransition('* => void', [style])).toEqual({
      type: 1,
      expr: '* => void',
      animation: [style],
      options: null,
    });
    expect(animationReference([style], { params: { a: 1 } })).toEqual({
      type: 8,
      animation: [style],
      options: { params: { a: 1 } },
    });
    expect(animationTrigger('fade', [style])).toEqual({ type: 7, name: 'fade', definitions: [style], options: {} });
  });

  it('keeps the deprecated animations unchanged', () => {
    expect(fade(0.5)).toEqual([
      {
        type: 1,
        expr: 'void => *',
        animation: [
          { type: 6, styles: { opacity: 0 }, offset: null },
          { type: 4, styles: { type: 6, styles: { opacity: 0.5 }, offset: null }, timings: '0.2s ease-in-out' },
        ],
        options: null,
      },
      {
        type: 1,
        expr: '* => void',
        animation: [
          { type: 4, styles: { type: 6, styles: { opacity: 0 }, offset: null }, timings: '0.2s ease-in-out' },
        ],
        options: null,
      },
    ]);
    expect(collapse()[0]).toEqual({
      type: 0,
      name: 'true',
      styles: { type: 6, styles: { height: 0, 'overflow-y': 'hidden' }, offset: null },
      options: undefined,
    });
    expect(defaultExpandAnimation).toEqual({
      type: 8,
      animation: [
        { type: 6, styles: { height: '{{ startHeight }}px' }, offset: null },
        { type: 4, styles: { type: 6, styles: { height: '*' }, offset: null }, timings: '0.2s ease-in-out' },
      ],
      options: { params: { startHeight: 0 } },
    });
  });
});
