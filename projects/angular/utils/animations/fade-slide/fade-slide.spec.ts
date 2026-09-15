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

import { fadeSlide } from './index';

describe('FadeSlide', () => {
  describe('invalid direction', () => {
    it('should throw an error', () => {
      expect(() => {
        fadeSlide('invalid');
      }).toThrow();
    });
  });

  describe('up', () => {
    const mySlide: ClrAnimationMetadata[] = fadeSlide('up');
    const enterTransition: ClrAnimationTransitionMetadata = mySlide[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = mySlide[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(mySlide.length).toEqual(2);
    });

    it('should contain an AnimationStateTransitionMetadata for void => * ', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with correct style and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0, transform: 'translate(0, 25%)' }));

      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];
      expect(step1.styles).toEqual(animationStyle({ opacity: 0, transform: 'translate(0, 25%)' }));
    });
  });

  describe('down', () => {
    const mySlide: ClrAnimationMetadata[] = fadeSlide('down');
    const enterTransition: ClrAnimationTransitionMetadata = mySlide[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = mySlide[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(mySlide.length).toEqual(2);
    });

    it('should contain an AnimationStateTransitionMetadata for void => * ', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with correct style and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0, transform: 'translate(0, -25%)' }));
      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];
      expect(step1.styles).toEqual(animationStyle({ opacity: 0, transform: 'translate(0, -25%)' }));
    });
  });

  describe('left', () => {
    const mySlide: ClrAnimationMetadata[] = fadeSlide('left');
    const enterTransition: ClrAnimationTransitionMetadata = mySlide[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = mySlide[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(mySlide.length).toEqual(2);
    });

    it('should contain an AnimationStateTransitionMetadata for void => * ', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with correct style and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0, transform: 'translate(25%, 0)' }));
      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];
      expect(step1.styles).toEqual(animationStyle({ opacity: 0, transform: 'translate(25%, 0)' }));
    });
  });

  describe('right', () => {
    const mySlide: ClrAnimationMetadata[] = fadeSlide('right');
    const enterTransition: ClrAnimationTransitionMetadata = mySlide[0] as ClrAnimationTransitionMetadata;
    const exitTransition: ClrAnimationTransitionMetadata = mySlide[1] as ClrAnimationTransitionMetadata;

    it('should return an array of ClrAnimationMetadata', () => {
      expect(mySlide.length).toEqual(2);
    });

    it('should contain an AnimationStateTransitionMetadata for void => * ', () => {
      expect(enterTransition.expr).toEqual('void => *');
    });

    it('should contain a transition with correct style and timing of 0.2s ease-in-out for void => *', () => {
      const step1: ClrAnimationStyleMetadata = (enterTransition.animation as any)[0];
      const step2: ClrAnimationAnimateMetadata = (enterTransition.animation as any)[1];

      expect(step1).toEqual(animationStyle({ opacity: 0, transform: 'translate(-25%, 0)' }));
      expect(step2.timings).toEqual('0.2s ease-in-out');
    });

    it('should contain a transition for * => void', () => {
      expect(exitTransition.expr).toEqual('* => void');
    });

    it('should contain a transition with opacity of 0 and timing of 0.2s ease-in-out for * => void', () => {
      const step1: ClrAnimationAnimateMetadata = (exitTransition.animation as any)[0];
      expect(step1.styles).toEqual(animationStyle({ opacity: 0, transform: 'translate(-25%, 0)' }));
    });
  });
});
