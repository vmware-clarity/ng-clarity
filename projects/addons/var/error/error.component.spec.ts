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
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [ClrStackViewModule, ClrIcon, CommonModule, NoopAnimationsModule],
      declarations: [ErrorComponent],
      providers: [WorkflowStrings],
    });
    this.fixture = TestBed.createComponent(ErrorComponent);
    this.component = this.fixture.componentInstance;
    this.error = {
      data: {
        message: 'Error Message',
        stackTrace: 'Error stack trace',
      },
    };
    this.strings = TestBed.inject(WorkflowStrings);
    this.component.error = this.error;
    this.fixture.detectChanges();
  });
  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  describe('should render', () => {
    it('title', function (this: ThisTest) {
      const element = this.fixture.debugElement.query(By.css('.card-header span'));
      expect(element.nativeElement.innerText).toEqual(this.strings.error.title);
    });

    it('error loading description', function (this: ThisTest) {
      const element = this.fixture.debugElement.query(By.css('.card-block > div'));
      expect(element.nativeElement.innerText).toEqual(this.strings.error.description);
    });

    it('error details label', function (this: ThisTest) {
      const element = this.fixture.debugElement.query(By.css('clr-stack-view  clr-stack-block clr-stack-label'));
      expect(element.nativeElement.innerText).toEqual(this.strings.error.details);
    });

    it('error details message', function (this: ThisTest) {
      expandStackBlock(this.fixture);
      const element = this.fixture.debugElement.query(
        By.css('clr-stack-view  clr-stack-block .error-details-block span')
      );
      expect(element.nativeElement.innerText).toEqual(this.error.data.message as string);
    });

    it('error details stack trace', function (this: ThisTest) {
      expandStackBlock(this.fixture);
      const element = this.fixture.debugElement.query(
        By.css('clr-stack-view  clr-stack-block .error-details-block .stack-trace')
      );
      expect(element.nativeElement.innerText.trim()).toEqual(this.error.data.stackTrace as string);
    });

    it('error-details-block stack-view-key should not be visible', function (this: ThisTest) {
      expandStackBlock(this.fixture);
      const element: Element = this.fixture.debugElement.nativeElement;
      const stackViewKey = element.querySelector('.error-details-block div.stack-view-key');
      expect(stackViewKey).not.toBeNull();
      const computedStyle = getComputedStyle(stackViewKey as Element);
      expect(computedStyle.display).toEqual('none');
    });

    it('error-details-block stack-block-label is visible', function (this: ThisTest) {
      expandStackBlock(this.fixture);
      const element: Element = this.fixture.debugElement.nativeElement;
      const stackBlockLabel = element.querySelector('.error-details-block div.stack-block-label');
      expect(stackBlockLabel).not.toBeNull();
      const computedStyle = getComputedStyle(stackBlockLabel as Element);
      expect(computedStyle.display).not.toEqual('none');
    });
  });

  describe('retry button', () => {
    beforeEach(function (this: ThisTest) {
      this.button = this.fixture.debugElement.query(By.css('div.card-footer.text-right button'));
    });

    it('should have icon', function (this: ThisTest) {
      const icon = this.fixture.debugElement.query(By.css('div.card-footer.text-right button cds-icon'));
      expect(icon.nativeElement.attributes.getNamedItem('shape').value).toEqual('refresh');
    });

    it('should render retry text', function (this: ThisTest) {
      // `.btn` applies text-transform: uppercase, so innerText reflects the rendered case.
      expect(this.button.nativeElement.innerText.toLowerCase()).toEqual(this.strings.error.retry.toLowerCase());
    });

    it('click, should emit retry event', function (this: ThisTest) {
      spyOn(this.component.onRetry, 'emit').and.callThrough();
      const button = this.fixture.debugElement.query(By.css('div.card-footer.text-right button')).nativeElement;
      button.click();
      expect(this.component.onRetry.emit).toHaveBeenCalled();
    });
  });
});
