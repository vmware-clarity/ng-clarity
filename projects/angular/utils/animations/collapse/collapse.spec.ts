/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  animationStyle,
  ClrAnimationAnimateMetadata,
  ClrAnimationMetadata,
  ClrAnimationStateMetadata,
  ClrAnimationStyleMetadata,
  ClrAnimationTransitionMetadata,
} from '../animation-metadata';

import { collapse } from './index';

describe('Collapse', () => {
  const myCollapse: ClrAnimationMetadata[] = collapse();
  const state: ClrAnimationStateMetadata = myCollapse[0] as ClrAnimationStateMetadata;
  const transition1: ClrAnimationTransitionMetadata = myCollapse[1] as ClrAnimationTransitionMetadata;
  const transition2: ClrAnimationTransitionMetadata = myCollapse[2] as ClrAnimationTransitionMetadata;

  it('should return an array of ClrAnimationMetadata', () => {
    expect(myCollapse.length).toEqual(3);
  });

  it('should contain a default state with correct style', () => {
    expect(state.styles).toEqual(animationStyle({ height: 0, 'overflow-y': 'hidden' }));
  });

  it('should contain a transition for true => false', () => {
    expect(transition1.expr).toEqual('true => false');
  });

  it('should contain a transition for false => true', () => {
    expect(transition2.expr).toEqual('false => true');
  });

  it('should contain a transition with height of * and timing of 0.2s ease-in-out for true => false', () => {
    const step1: ClrAnimationAnimateMetadata = (transition1.animation as any)[0];

    expect(step1.styles).toEqual(animationStyle({ height: '*', 'overflow-y': 'hidden' }));
  });

  it('should contain a transition with height of * and timing of 0.2s ease-in-out for false => true', () => {
    const step1: ClrAnimationStyleMetadata = (transition2.animation as any)[0];
    const step2: ClrAnimationAnimateMetadata = (transition2.animation as any)[1];

    expect(step1).toEqual(animationStyle({ height: '*', 'overflow-y': 'hidden' }));
    expect(step2.timings).toEqual('0.2s ease-in-out');
  });
});
