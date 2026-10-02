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
  ClrAnimationStyleMetadata,
  ClrAnimationTransitionMetadata,
} from '../animation-metadata';

import { fade } from './index';

describe('Fade', () => {
  describe('default', () => {
    const defaultFade: ClrAnimationMetadata[] = fade();
    const enterTransition: ClrAnimationTransitionMetadata = defaultFade[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = defaultFade[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(defaultFade.length).toEqual(2);
    });

    it('should contain a transition for void => *', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0 }));
      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];

      expect(step1.styles).toEqual(animationStyle({ opacity: 0 }));
    });
  });

  describe('fade with custom opacity', () => {
    const opacityValue = 0.8;
    const customOpacityFade: ClrAnimationMetadata[] = fade(opacityValue);
    const enterTransition: ClrAnimationTransitionMetadata = customOpacityFade[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = customOpacityFade[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(customOpacityFade.length).toEqual(2);
    });

    it('should contain a transition for void => * ', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0 }));
      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];

      expect(step1.styles).toEqual(animationStyle({ opacity: 0 }));
    });
  });
});
