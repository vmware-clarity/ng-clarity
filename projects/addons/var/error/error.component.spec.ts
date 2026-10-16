/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrStackViewModule } from '@clr/angular/data/stack-view';
import { ClrIcon } from '@clr/angular/icon';

import { ErrorComponent } from './error.component';
import { ActivationError } from './interfaces';

interface ThisTest {
  fixture: ComponentFixture<ErrorComponent>;
  component: ErrorComponent;
  error: ActivationError;
  button: DebugElement;
  strings: WorkflowStrings;
}

function expandStackBlock(fixture: ComponentFixture<ErrorComponent>): void {
  const sbLabel = fixture.debugElement.query(By.css('.stack-block-label'));
  sbLabel.nativeElement.click();
  fixture.detectChanges();
}

describe('ErrorComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrStackViewModule, ClrIcon, CommonModule, NoopAnimationsModule],
      declarations: [ErrorComponent],
      providers: [WorkflowStrings],
    });
    testContext.fixture = TestBed.createComponent(ErrorComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.error = {
      data: {
        message: 'Error Message',
        stackTrace: 'Error stack trace',
      },
    };
    testContext.strings = TestBed.inject(WorkflowStrings);
    testContext.component.error = testContext.error;
    testContext.fixture.detectChanges();
  });
  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('should render', () => {
    it('title', () => {
      const element = testContext.fixture.debugElement.query(By.css('.card-header span'));
      expect(element.nativeElement.innerText).toEqual(testContext.strings.error.title);
    });

    it('error loading description', () => {
      const element = testContext.fixture.debugElement.query(By.css('.card-block > div'));
      expect(element.nativeElement.innerText).toEqual(testContext.strings.error.description);
    });

    it('error details label', () => {
      const element = testContext.fixture.debugElement.query(By.css('clr-stack-view  clr-stack-block clr-stack-label'));
      expect(element.nativeElement.innerText).toEqual(testContext.strings.error.details);
    });

    it('error details message', () => {
      expandStackBlock(testContext.fixture);
      const element = testContext.fixture.debugElement.query(
        By.css('clr-stack-view  clr-stack-block .error-details-block span')
      );
      expect(element.nativeElement.innerText).toEqual(testContext.error.data.message as string);
    });

    it('error details stack trace', () => {
      expandStackBlock(testContext.fixture);
      const element = testContext.fixture.debugElement.query(
        By.css('clr-stack-view  clr-stack-block .error-details-block .stack-trace')
      );
      expect(element.nativeElement.innerText.trim()).toEqual(testContext.error.data.stackTrace as string);
    });

    it('error-details-block stack-view-key should not be visible', () => {
      expandStackBlock(testContext.fixture);
      const element: Element = testContext.fixture.debugElement.nativeElement;
      const stackViewKey = element.querySelector('.error-details-block div.stack-view-key');
      expect(stackViewKey).not.toBeNull();
      const computedStyle = getComputedStyle(stackViewKey as Element);
      expect(computedStyle.display).toEqual('none');
    });

    it('error-details-block stack-block-label is visible', () => {
      expandStackBlock(testContext.fixture);
      const element: Element = testContext.fixture.debugElement.nativeElement;
      const stackBlockLabel = element.querySelector('.error-details-block div.stack-block-label');
      expect(stackBlockLabel).not.toBeNull();
      const computedStyle = getComputedStyle(stackBlockLabel as Element);
      expect(computedStyle.display).not.toEqual('none');
    });
  });

  describe('retry button', () => {
    beforeEach(() => {
      testContext.button = testContext.fixture.debugElement.query(By.css('div.card-footer.text-right button'));
    });

    it('should have icon', () => {
      const icon = testContext.fixture.debugElement.query(By.css('div.card-footer.text-right button cds-icon'));
      expect(icon.nativeElement.attributes.getNamedItem('shape').value).toEqual('refresh');
    });

    it('should render retry text', () => {
      // `.btn` applies text-transform: uppercase, so innerText reflects the rendered case.
      expect(testContext.button.nativeElement.innerText.toLowerCase()).toEqual(
        testContext.strings.error.retry.toLowerCase()
      );
    });

    it('click, should emit retry event', () => {
      spyOn(testContext.component.onRetry, 'emit').and.callThrough();
      const button = testContext.fixture.debugElement.query(By.css('div.card-footer.text-right button')).nativeElement;
      button.click();
      expect(testContext.component.onRetry.emit).toHaveBeenCalled();
    });
  });
});
