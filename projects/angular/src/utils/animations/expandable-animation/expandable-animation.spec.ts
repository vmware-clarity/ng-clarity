/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { ClrExpandableAnimationDirective } from './expandable-animation.directive';
import { ClrExpandableAnimationModule } from './expandable-animation.module';

import { ClrExpandableAnimation } from './index';

@Component({
  template: `
    <clr-expandable-animation [clrExpandTrigger]="expanded">
      <div *ngFor="let item of data">{{ item }}</div>
    </clr-expandable-animation>
  `,
})
class TestComponent {
  @ViewChild(ClrExpandableAnimation, { static: true }) expandable: ClrExpandableAnimation;
  expanded = false;
  data = ['one'];
}
@Component({
  template: `
    <div [clrExpandableAnimation]="expanded">
      <div *ngFor="let item of data">{{ item }}</div>
    </div>
  `,
})
class TestComponentDirective {
  @ViewChild(ClrExpandableAnimationDirective, { static: true }) expandable: ClrExpandableAnimationDirective;
  expanded = false;
  data = ['one'];
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

function expandableAnimationSpec(testComponent, component) {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrExpandableAnimationModule, NoopAnimationsModule],
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
    it('updates startHeight property on expand and collapse', fakeAsync(() => {
      clarityDirective.updateStartHeight();
      const collapsedHeight = clarityDirective.startHeight;
      componentInstance.data.push('two');
      componentInstance.expanded = true;
      fixture.detectChanges();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight);
      tick();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight * 2);
      const expandedHeight = clarityDirective.startHeight;
      componentInstance.data.pop();
      componentInstance.expanded = false;
      fixture.detectChanges();
      expect(clarityDirective.startHeight).toEqual(expandedHeight);
      tick();
      expect(clarityDirective.startHeight).toEqual(collapsedHeight);
    }));
  });

  describe('DOM updates', () => {
    it('updates element height on expand and collapse', fakeAsync(() => {
      const collapsedHeight = clarityElement.clientHeight;
      expect(collapsedHeight).toBeGreaterThan(0);
      componentInstance.data.push('two');
      fixture.detectChanges();
      tick();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight * 2);
      componentInstance.data.pop();
      fixture.detectChanges();
      tick();
      expect(clarityElement.clientHeight).toEqual(collapsedHeight);
    }));
  });
}
