/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Directive, NgModule, Type, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrHostWrappingModule } from '@clr/angular/src/utils';

import { ClrCommonFormsModule } from './common.module';
import { ControlIdService } from './providers/control-id.service';
import { WrappedFormControl } from './wrapped-control';

/*
 * Components representing generic form controls.
 */
@Component({
  selector: 'generic-wrapper',
  template: `
    <label id="container-view-label-before"></label>
    <ng-content></ng-content>
    <label id="container-view-label-after"></label>
  `,
  providers: [ControlIdService],
  standalone: false,
})
class GenericWrapper {}

@Directive({
  selector: '[genericControl]',
  standalone: false,
})
class GenericControl extends WrappedFormControl<GenericWrapper> {
  constructor(vcr: ViewContainerRef) {
    super(vcr, GenericWrapper, null, null, null, null);
  }
}

@NgModule({
  imports: [ClrCommonFormsModule, ClrHostWrappingModule],
  declarations: [GenericWrapper, GenericControl],
  exports: [ClrCommonFormsModule, GenericWrapper, GenericControl],
})
class CommonFormsTestModule {}

/*
 * Actual test components, one for each case we support
 */
@Component({
  template: `<input genericControl />`,
  standalone: false,
})
class NoWrapperNoId {}

@Component({
  template: `<input genericControl id="hello" />`,
  standalone: false,
})
class NoWrapperWithId {}

@Component({
  template: `
    <generic-wrapper>
      <label id="test-view-label-before"></label>
      <input genericControl />
      <label id="test-view-label-after"></label>
    </generic-wrapper>
  `,
  standalone: false,
})
class WithWrapperNoId {}

@Component({
  template: `
    <generic-wrapper>
      <label id="test-view-label-before"></label>
      <input genericControl id="hello" />
      <label id="test-view-label-after"></label>
    </generic-wrapper>
  `,
  standalone: false,
})
class WithWrapperWithId {}

export default function (): void {
  describe('Common forms integration', () => {
    function assertMatching<T>(testComponent: Type<T>, projectedLabels: boolean, expectedId?: string) {
      return function () {
        TestBed.configureTestingModule({ imports: [CommonFormsTestModule], declarations: [testComponent] });
        const fixture = TestBed.createComponent(testComponent);
        fixture.detectChanges();
        if (!expectedId) {
          const wrapperDebug = fixture.debugElement.query(By.directive(GenericWrapper));
          expectedId = wrapperDebug.injector.get(ControlIdService).id;
        }
        const input = fixture.nativeElement.querySelector('input');
        expect(input.getAttribute('id')).toBe(expectedId, 'input has the wrong id attribute');

        const labels = ['#container-view-label-before', '#container-view-label-after'];
        if (projectedLabels) {
          labels.push('#test-view-label-before', '#test-view-label-after');
        }
        for (const labelSelector of labels) {
          const label = fixture.nativeElement.querySelector(labelSelector);
          expect(label.getAttribute('for')).toBe(expectedId, labelSelector + ' has the wrong for attribute');
        }
      };
    }

    it('works without an explicit wrapper and without an id', assertMatching(NoWrapperNoId, false));

    it('works without an explicit wrapper and with an id', assertMatching(NoWrapperWithId, false, 'hello'));

    it('works with an explicit wrapper and without an id', assertMatching(WithWrapperNoId, true));

    it('works with an explicit wrapper and with an id', assertMatching(WithWrapperWithId, true, 'hello'));
  });
}
