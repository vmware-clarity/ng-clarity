/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { animateHeight, ClrHeightAnimation } from './height-animation';
import { delay } from '../testing/helpers.spec';

@Component({
  template: `
    <div class="host" style="--cds-global-animation-duration-quick: 0.2s">
      @if (shown) {
        <div class="content" [clrHeightAnimation]="animateEnter" style="height: 100px"></div>
      }
    </div>
  `,
  imports: [ClrHeightAnimation],
})
class TestComponent {
  shown = false;
  animateEnter = true;
}

function heightKeyframes(animation: Animation) {
  return (animation.effect as KeyframeEffect).getKeyframes().map(keyframe => keyframe.height);
}

describe('ClrHeightAnimation', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestComponent], animationsEnabled: true });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  function content(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.content');
  }

  async function show(shown: boolean) {
    fixture.componentInstance.shown = shown;
    fixture.detectChanges();
    await delay();
  }

  it('expands the element from 0 to its height when it is added', async () => {
    await show(true);

    const animations = content().getAnimations();
    expect(animations.length).toBe(1);
    expect(heightKeyframes(animations[0])).toEqual(['0px', '100px']);
  });

  it('adds the element without animation when the input is false', async () => {
    fixture.componentInstance.animateEnter = false;
    await show(true);

    expect(content().getAnimations().length).toBe(0);
  });

  it('collapses the element to 0 before it is removed', async () => {
    await show(true);
    content().getAnimations()[0].finish();
    await show(false);

    const animations = content().getAnimations();
    expect(heightKeyframes(animations[0])).toEqual(['100px', '0px']);

    animations[0].finish();
    await delay();
    expect(content()).toBeNull();
  });

  it('removes the element at once when there is nothing to animate', async () => {
    await show(true);
    content().getAnimations()[0].finish();
    content().style.setProperty('--cds-global-animation-duration-quick', '0s');
    await show(false);

    expect(content()).toBeNull();
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
});
