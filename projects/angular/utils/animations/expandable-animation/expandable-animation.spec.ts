/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { delay, finishAnimations } from '@clr/angular/testing';

import { ClrExpandableAnimationDirective } from './expandable-animation.directive';
import { ClrExpandableAnimationModule } from './expandable-animation.module';
import { DomAdapter } from '../../dom-adapter/dom-adapter';

import { ClrExpandableAnimation } from './index';

@Component({
  template: `
    <clr-expandable-animation [clrExpandTrigger]="expanded">
      @for (item of data; track item.id) {
        <div>{{ item.value }}</div>
      }
    </clr-expandable-animation>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrExpandableAnimation, { static: true }) expandable: ClrExpandableAnimation;
  expanded = false;
  data = [{ id: 1, value: 'one' }];
}
@Component({
  template: `
    <div [clrExpandableAnimation]="expanded">
      @for (item of data; track item.id) {
        <div>{{ item.value }}</div>
      }
    </div>
  `,
  standalone: false,
})
class TestComponentDirective {
  @ViewChild(ClrExpandableAnimationDirective, { static: true }) expandable: ClrExpandableAnimationDirective;
  expanded = false;
  data = [{ id: 1, value: 'one' }];
}

let fixture: ComponentFixture<any>;
let componentInstance: TestComponent;

let directiveDebugElement: DebugElement;
let clarityDirective: ClrExpandableAnimationDirective;
let clarityElement: HTMLElement;

describe('Expandable animation component', () => {
  expandableAnimationSpec(TestComponent, ClrExpandableAnimation);
});
describe('Expandable animation directive', () => {
  expandableAnimationSpec(TestComponentDirective, ClrExpandableAnimationDirective);
});
describe('Expandable animation component with animations enabled', () => {
  animatedExpandableAnimationSpec(TestComponent, ClrExpandableAnimation);
});
describe('Expandable animation directive with animations enabled', () => {
  animatedExpandableAnimationSpec(TestComponentDirective, ClrExpandableAnimationDirective);
});

function expandableAnimationSpec(testComponent, component) {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule],
      declarations: [testComponent],
      providers: [DomAdapter],
    });
    fixture = TestBed.createComponent(testComponent);
    fixture.detectChanges();

    componentInstance = fixture.componentInstance;

    directiveDebugElement = fixture.debugElement.query(By.directive(component));
    clarityElement = directiveDebugElement.nativeElement;
    clarityDirective = directiveDebugElement.injector.get(component);
  });

  describe('Model', () => {
    it('start height initializes and updates', () => {
      expect(clarityDirective.startHeight).toEqual(0);
      clarityDirective.updateStartHeight();
      expect(clarityDirective.startHeight).toBeGreaterThan(0);
    });

    // We test startHeight property separately from the DOM updates, because it has slightly different lifecycle
    // which though related to the DOM heights does not correspond 1:1 on all lifecycle steps.
    it('updates startHeight property on expand and collapse', async () => {
      clarityDirective.updateStartHeight();
      const collapsedHeight = clarityDirective.startHeight;
      componentInstance.data.push({ id: 2, value: 'two' });
      componentInstance.expanded = true;
      fixture.detectChanges();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight);
      await delay();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight * 2);
      const expandedHeight = clarityDirective.startHeight;
      componentInstance.data.pop();
      componentInstance.expanded = false;
      fixture.detectChanges();
      expect(clarityDirective.startHeight).toEqual(expandedHeight);
      await delay();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight);
    });
  });

  describe('DOM updates', () => {
    it('updates element height on expand and collapse', async () => {
      const collapsedHeight = clarityElement.clientHeight;
      expect(collapsedHeight).toBeGreaterThan(0);
      componentInstance.data.push({ id: 2, value: 'two' });
      fixture.detectChanges();
      await delay();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight * 2);
      componentInstance.data.pop();
      fixture.detectChanges();
      await delay();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight);
    });
  });
}

function animatedExpandableAnimationSpec(testComponent, component) {
  let animatedFixture: ComponentFixture<TestComponent | TestComponentDirective>;
  let expandable: ClrExpandableAnimation | ClrExpandableAnimationDirective;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule],
      declarations: [testComponent],
      providers: [DomAdapter],
      animationsEnabled: true,
    });
    animatedFixture = TestBed.createComponent(testComponent);
    animatedFixture.detectChanges();
    const debugElement = animatedFixture.debugElement.query(By.directive(component));
    element = debugElement.nativeElement;
    expandable = debugElement.injector.get(component);
  });

  afterEach(() => {
    animatedFixture.destroy();
  });

  it('animates the height from the start height to the height of the new content', async () => {
    expandable.updateStartHeight();
    const startHeight = expandable.startHeight;
    animatedFixture.componentInstance.data.push({ id: 2, value: 'two' });
    animatedFixture.componentInstance.expanded = true;
    animatedFixture.detectChanges();

    const animations = element.getAnimations();
    expect(animations.length).toBe(1);
    expect(element.classList).toContain('clr-expandable-animation-active');
    expect(element.style.overflow).toBe('clip');
    animations[0].pause();
    animations[0].currentTime = 0;
    expect(element.getBoundingClientRect().height).toBe(startHeight);

    finishAnimations(element);
    await delay();

    expect(element.getAnimations().length).toBe(0);
    expect(element.classList).not.toContain('clr-expandable-animation-active');
    expect(element.style.overflow).toBe('');
    expect(expandable.startHeight).toBe(startHeight * 2);
  });

  it('replaces a running animation', async () => {
    expandable.updateStartHeight();
    animatedFixture.componentInstance.data.push({ id: 2, value: 'two' });
    animatedFixture.componentInstance.expanded = true;
    animatedFixture.detectChanges();
    const firstAnimation = element.getAnimations()[0];

    animatedFixture.componentInstance.data.pop();
    animatedFixture.componentInstance.expanded = false;
    animatedFixture.detectChanges();

    expect(firstAnimation.playState).toBe('idle'); // cancelled
    finishAnimations(element);
    await delay();
    expect(element.classList).not.toContain('clr-expandable-animation-active');
  });
}
