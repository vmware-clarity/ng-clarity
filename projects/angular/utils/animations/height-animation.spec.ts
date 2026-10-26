/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationCallbackEvent } from '@angular/core';

import { animateHeight, expandHeight } from './height-animation';

function keyframes(animation: Animation) {
  return (animation.effect as KeyframeEffect).getKeyframes();
}

function heightKeyframes(animation: Animation) {
  return keyframes(animation).map(keyframe => keyframe.height);
}

describe('expandHeight', () => {
  it('expands the added element from 0 to its height', () => {
    const element = document.createElement('div');
    element.style.cssText = 'height: 100px; --cds-global-animation-duration-quick: 0.2s';
    document.body.appendChild(element);

    expandHeight({ target: element } as unknown as AnimationCallbackEvent);

    expect(heightKeyframes(element.getAnimations()[0])).toEqual(['0px', '100px']);
    element.remove();
  });
});

describe('animateHeight', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.setProperty('--cds-global-animation-duration-quick', '0.2s');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('animates the height between the given heights and leaves no style behind', () => {
    const animation = animateHeight(element, { from: 20, to: 80 });

    expect(heightKeyframes(animation)).toEqual(['20px', '80px']);
    // `clip`, not `hidden`, which would loosen the `position: sticky` descendants (datagrid pinned columns, CDE-3127).
    expect(keyframes(animation).map(keyframe => keyframe.overflow)).toEqual(['clip', 'clip']);
    expect(animation.effect.getComputedTiming().duration).toBe(200);
    animation.finish();
    expect(element.getAnimations().length).toBe(0);
  });

  it('cancels the height animation it started before', () => {
    const first = animateHeight(element, { from: 0, to: 80 });
    animateHeight(element, { from: 40, to: 0 });

    expect(first.playState).toBe('idle');
    expect(element.getAnimations().length).toBe(1);
  });

  it('animates to the height of the element once the previous animation is canceled', () => {
    element.style.height = '60px';
    animateHeight(element, { from: 0, to: 20 });
    const animation = animateHeight(element, { from: 10 });

    expect(heightKeyframes(animation)).toEqual(['10px', '60px']);
  });

  it('uses the given easing', () => {
    const animation = animateHeight(element, { from: 0, to: 80, easing: 'linear' });

    expect(animation.effect.getTiming().easing).toBe('linear');
  });

  it('reads a duration token in milliseconds, whatever its case', () => {
    element.style.setProperty('--cds-global-animation-duration-quick', '150MS');

    expect(animateHeight(element, { from: 0, to: 80 }).effect.getComputedTiming().duration).toBe(150);
  });

  it('does not animate when the duration is 0', () => {
    element.style.setProperty('--cds-global-animation-duration-quick', '0s');

    expect(animateHeight(element, { from: 0, to: 80 })).toBeNull();
  });

  it('does not animate when the user prefers reduced motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    expect(animateHeight(element, { from: 0, to: 80 })).toBeNull();
  });

  it('does not animate when the height does not change', () => {
    expect(animateHeight(element, { from: 80, to: 80 })).toBeNull();
  });

  describe('outside of a browser', () => {
    const { getComputedStyle } = window;
    const serverElement = {} as HTMLElement;

    beforeEach(() => {
      window.getComputedStyle = undefined;
    });

    afterEach(() => {
      window.getComputedStyle = getComputedStyle;
    });

    it('does not animate', () => {
      expect(animateHeight(serverElement, { from: 0 })).toBeNull();
    });
  });
});
