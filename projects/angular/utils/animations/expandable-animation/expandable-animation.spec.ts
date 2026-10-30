/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { delay } from '@clr/angular/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { BaseExpandableAnimation } from './base-expandable-animation';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
describe('Expandable animation component height animation', () => {
  heightAnimationSpec(TestComponent, ClrExpandableAnimation);
});
describe('Expandable animation directive height animation', () => {
  heightAnimationSpec(TestComponentDirective, ClrExpandableAnimationDirective);
});
describe('Expandable animation component with noop animations', () => {
  noopAnimationsSpec(TestComponent, ClrExpandableAnimation);
});
describe('Expandable animation directive with noop animations', () => {
  noopAnimationsSpec(TestComponentDirective, ClrExpandableAnimationDirective);
});

function noopAnimationsSpec(testComponent, component) {
  it('does not animate the height', async () => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule],
      declarations: [testComponent],
      providers: [provideNoopAnimations()],
      animationsEnabled: true,
    });
    fixture = TestBed.createComponent(testComponent);
    renderFixture(fixture);
    await delay();
    const debugElement = fixture.debugElement.query(By.directive(component));
    const element: HTMLElement = debugElement.nativeElement;
    const expandable: BaseExpandableAnimation = debugElement.injector.get(component);

    expandable.updateStartHeight();
    const collapsedHeight = expandable.startHeight;
    fixture.componentInstance.data.push({ id: 2, value: 'two' });
    fixture.componentInstance.expanded = true;
    renderFixture(fixture);
    await delay();

    expect(element.getAnimations()).toEqual([]);
    expect(expandable.startHeight).toEqual(collapsedHeight * 2);
    fixture.destroy();
  });
}

function heightAnimationSpec(testComponent, component) {
  let expandable: BaseExpandableAnimation;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule],
      declarations: [testComponent],
      animationsEnabled: true,
    });
    fixture = TestBed.createComponent(testComponent);
    renderFixture(fixture);
    await delay();

    const debugElement = fixture.debugElement.query(By.directive(component));
    element = debugElement.nativeElement;
    expandable = debugElement.injector.get(component);
  });

  afterEach(() => {
    fixture.destroy();
  });

  function heightKeyframes() {
    return element
      .getAnimations()
      .flatMap(animation => (animation.effect as KeyframeEffect).getKeyframes().map(keyframe => keyframe.height));
  }

  it('animates the height from the start height to the new height', async () => {
    expandable.updateStartHeight();
    const collapsedHeight = expandable.startHeight;
    fixture.componentInstance.data.push({ id: 2, value: 'two' });
    fixture.componentInstance.expanded = true;
    renderFixture(fixture);
    await delay();

    expect(heightKeyframes()).toEqual([`${collapsedHeight}px`, `${collapsedHeight * 2}px`]);

    element.getAnimations().forEach(animation => animation.finish());
    await delay();
    expect(expandable.startHeight).toEqual(collapsedHeight * 2);
  });

  it('does not animate when the trigger does not change', async () => {
    fixture.componentInstance.data.push({ id: 2, value: 'two' });
    renderFixture(fixture);
    await delay();

    expect(element.getAnimations()).toEqual([]);
  });
}

function expandableAnimationSpec(testComponent, component) {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule],
      declarations: [testComponent],
      providers: [DomAdapter],
    });
    fixture = TestBed.createComponent(testComponent);
    renderFixture(fixture);

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
      renderFixture(fixture);
      expect(clarityDirective.startHeight).toEqual(collapsedHeight);
      await delay();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight * 2);
      const expandedHeight = clarityDirective.startHeight;
      componentInstance.data.pop();
      componentInstance.expanded = false;
      renderFixture(fixture);
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
      renderFixture(fixture);
      await delay();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight * 2);
      componentInstance.data.pop();
      renderFixture(fixture);
      await delay();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight);
    });
  });
}
