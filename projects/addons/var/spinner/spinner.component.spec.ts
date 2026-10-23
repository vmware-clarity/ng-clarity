/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';

import { SpinnerComponent } from './spinner.component';

interface ThisTest {
  fixture: ComponentFixture<MockComponent>;
  component: MockComponent;
}
describe('appfx-spinner', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrSpinnerModule],
      declarations: [SpinnerComponent, MockComponent],
    });
    testContext.fixture = TestBed.createComponent(MockComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.component.loading = true;
    testContext.fixture.detectChanges();
  });

  it('should show clarity spinner', () => {
    expect(testContext.fixture.debugElement.query(By.css('clr-spinner'))).toBeTruthy();
  });

  describe('WHEN there is a message', () => {
    beforeEach(() => {
      testContext.component.message = 'loading';
      testContext.fixture.detectChanges();
    });

    it('THEN, should have loading message', () => {
      expect(testContext.fixture.debugElement.query(By.css('span')).nativeElement.innerText).toEqual('loading');
    });

    it('THEN, should have aria-live attribute set', () => {
      expect(testContext.fixture.debugElement.query(By.css('span')).attributes['aria-live']).toEqual('assertive');
      testContext.component.politeness = 'polite';
      testContext.fixture.detectChanges();
      expect(testContext.fixture.debugElement.query(By.css('span')).attributes['aria-live']).toEqual('polite');
    });
  });

  it('should show progress status message', () => {
    expect(testContext.fixture.debugElement.query(By.css('span.progress-item'))).toBeFalsy();
    testContext.component.progressDetails = 'progress 50%';
    testContext.fixture.detectChanges();
    expect(testContext.fixture.debugElement.query(By.css('span.progress-item')).nativeElement.innerText).toEqual(
      'progress 50%'
    );
  });

  describe('WHEN there is custom action', () => {
    it('THEN, should render the action button', () => {
      const actionButtonSelector = 'button.btn';
      expect(testContext.fixture.debugElement.query(By.css(actionButtonSelector))).toBeFalsy();

      testContext.component.showActionButton = true;
      testContext.component.actionButtonLabel = 'cancel';
      testContext.fixture.detectChanges();

      // `.btn` applies text-transform: uppercase, so innerText reflects the rendered case.
      expect(
        testContext.fixture.debugElement.query(By.css(actionButtonSelector)).nativeElement.innerText.toLowerCase()
      ).toEqual('cancel');
      expect(testContext.component.actionInvoked).toBe(0);

      testContext.fixture.debugElement.query(By.css(actionButtonSelector)).nativeElement.click();
      expect(testContext.component.actionInvoked).toBe(1);
    });
  });
});

@Component({
  standalone: false,
  template: `<appfx-spinner
    *ngIf="loading"
    [message]="message"
    [politeness]="politeness"
    [progressDetails]="progressDetails"
    [showActionButton]="showActionButton"
    [actionButtonLabel]="actionButtonLabel"
    (actionClick)="onAction()"
  >
  </appfx-spinner>`,
})
class MockComponent {
  loading = false;
  message: string;
  politeness: 'assertive' | 'polite' | 'off' = 'assertive';
  progressDetails: string;
  showActionButton = false;
  actionButtonLabel = 'cancel';

  actionInvoked = 0;

  @ViewChild(SpinnerComponent, { static: false }) spinner: SpinnerComponent;

  onAction(): void {
    this.actionInvoked++;
  }
}
