/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrHeightAnimation } from './height-animation';

describe('ClrHeightAnimation', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.height = '100px';
    element.style.overflow = 'hidden';
    element.style.setProperty('--cds-global-animation-duration-quick', '200ms');
    element.style.setProperty('--cds-global-animation-easing-in-out', 'ease-in');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  function heightAnimation(easing?: string) {
    return new ClrHeightAnimation(TestBed.inject(Injector), easing);
  }

  function keyframeHeights(animation: Animation): string[] {
    return (animation.effect as KeyframeEffect).getKeyframes().map(keyframe => keyframe.height as string);
  }

  describe('with animations disabled (TestBed default)', () => {
    it('does not animate', () => {
      heightAnimation().collapse(element);
      heightAnimation().expand(() => element, 0);
      TestBed.tick();

      expect(element.getAnimations()).toEqual([]);
    });
  });

  describe('with animations enabled', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ animationsEnabled: true });
    });

    it('collapses from the current height to 0, with the timing of the animation tokens', () => {
      heightAnimation().collapse(element);

      const [animation] = element.getAnimations();
      expect(keyframeHeights(animation)).toEqual(['100px', '0px']);
      expect(animation.effect.getTiming().duration).toBe(200);
      expect(animation.effect.getTiming().easing).toBe('ease-in');
    });

    it('reads durations in seconds', () => {
      element.style.setProperty('--cds-global-animation-duration-quick', '0.3s');
      heightAnimation().collapse(element);

      expect(element.getAnimations()[0].effect.getTiming().duration).toBe(300);
    });

    it('uses the easing it is given instead of the token', () => {
      heightAnimation('linear').collapse(element);

      expect(element.getAnimations()[0].effect.getTiming().easing).toBe('linear');
    });

    it('expands to the height the element has after the next render', () => {
      heightAnimation().expand(() => element, 0);
      expect(element.getAnimations()).toEqual([]);

      element.style.height = '150px';
      TestBed.tick();

      const [animation] = element.getAnimations();
      expect(keyframeHeights(animation)).toEqual(['0px', '150px']);
    });

    it('expands from the current height of a collapse it interrupts', () => {
      const animation = heightAnimation();
      animation.collapse(element);
      const collapse = element.getAnimations()[0];
      collapse.pause();
      collapse.currentTime = 100; // halfway

      animation.expand(() => element);
      TestBed.tick();

      expect(collapse.playState).toBe('idle'); // cancelled
      const [expand] = element.getAnimations();
      expect(expand).not.toBe(collapse);
      expect(parseFloat(keyframeHeights(expand)[0])).toBeGreaterThan(0);
      expect(parseFloat(keyframeHeights(expand)[0])).toBeLessThan(100);
      expect(keyframeHeights(expand)[1]).toBe('100px');
    });

    it('does not animate when the duration is 0 (low motion theme)', () => {
      element.style.setProperty('--cds-global-animation-duration-quick', '0s');
      heightAnimation().collapse(element);

      expect(element.getAnimations()).toEqual([]);
    });

    it('does not animate when the user prefers reduced motion', () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
      heightAnimation().collapse(element);

      expect(element.getAnimations()).toEqual([]);
    });
  });
});
