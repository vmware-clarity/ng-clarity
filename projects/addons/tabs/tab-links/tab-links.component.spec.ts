/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrIcon } from '@clr/angular/icon';

import { TabLinksComponent } from './tab-links.component';

describe('TabLinksComponent', () => {
  let fixture: ComponentFixture<TabLinksComponent>;
  let component: TabLinksComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrIcon],
      declarations: [TabLinksComponent],
      providers: [WorkflowStrings],
    });

    fixture = TestBed.createComponent(TabLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts closed', () => {
    expect(component.opened).toBe(false);
    expect(fixture.debugElement.classes['opened']).toBeFalsy();
  });

  it('sets the title', () => {
    component.title = 'My Step';
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.nav-step-title'));
    expect(title.nativeElement.textContent).toBe('My Step');
  });

  it('opens and emits openedChange when the show-tabs button is clicked', () => {
    const emitted: boolean[] = [];
    component.openedChange.subscribe((value: boolean) => emitted.push(value));

    fixture.debugElement.query(By.css('.btn-show-tabs')).nativeElement.click();
    fixture.detectChanges();

    expect(component.opened).toBe(true);
    expect(fixture.debugElement.classes['opened']).toBe(true);
    expect(emitted).toEqual([true]);
  });

  it('closes and emits openedChange when the close-tabs button is clicked', () => {
    component.changeOpened(true);
    fixture.detectChanges();

    const emitted: boolean[] = [];
    component.openedChange.subscribe((value: boolean) => emitted.push(value));

    fixture.debugElement.query(By.css('.btn-close-tabs')).nativeElement.click();
    fixture.detectChanges();

    expect(component.opened).toBe(false);
    expect(fixture.debugElement.classes['opened']).toBeFalsy();
    expect(emitted).toEqual([false]);
  });

  it('exposes the workflow strings used for the aria-labels', () => {
    const showButton = fixture.debugElement.query(By.css('.btn-show-tabs'));
    const closeButton = fixture.debugElement.query(By.css('.btn-close-tabs'));

    expect(showButton.attributes['aria-label']).toBe(component.workflowStrings.openStepNavAriaLabel);
    expect(closeButton.attributes['aria-label']).toBe(component.workflowStrings.closeStepNavAriaLabel);
  });
});
