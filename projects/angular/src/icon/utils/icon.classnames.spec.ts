/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrIcon } from '../icon.component';
import { ClrIconModule } from '../icon.module';
import { renderIcon } from '../icon.renderer';
import { ClarityIcons } from '../icon.service';
import {
  getIconSizeStylesToUpdate,
  getSizeValue,
  getUpdateSizeStrategy,
  SizeUpdateStrategies,
  updateIconSizeStyle,
} from './icon.classnames';

describe('Icon classname helpers: ', () => {
  // ---
  // Pure Unit Tests (No Angular/TestBed needed)
  // ---
  describe('getSizeValue', () => {
    it('should handle empty strings', () => {
      expect(getSizeValue('')).toEqual('');
    });
    it('should handle nil values', () => {
      expect(getSizeValue(void 0)).toEqual('');
    });
    it('should remove "fit" values', () => {
      expect(getSizeValue('fit')).toEqual('');
      expect(getSizeValue('xxl fit')).toEqual('xxl');
      expect(getSizeValue('bad value fit')).toEqual('bad value');
      expect(getSizeValue('2020 fit')).toEqual('2020');
    });
    it('return number or t-shirt values', () => {
      expect(getSizeValue('10')).toEqual('10');
      expect(getSizeValue('md')).toEqual('md');
    });
  });

  describe('getUpdateSizeStrategy', () => {
    it('should return "value-is-string" if passed a string that is also a recognized t-shirt size', () => {
      expect(getUpdateSizeStrategy('xs')).toEqual(SizeUpdateStrategies.ValidSizeString);
      expect(getUpdateSizeStrategy('sm')).toEqual(SizeUpdateStrategies.ValidSizeString);
      expect(getUpdateSizeStrategy('md')).toEqual(SizeUpdateStrategies.ValidSizeString);
      expect(getUpdateSizeStrategy('lg')).toEqual(SizeUpdateStrategies.ValidSizeString);
      expect(getUpdateSizeStrategy('xl')).toEqual(SizeUpdateStrategies.ValidSizeString);
      expect(getUpdateSizeStrategy('xxl')).toEqual(SizeUpdateStrategies.ValidSizeString);
    });
    it('should return "value-is-nil" if passed an empty string as the size', () => {
      expect(getUpdateSizeStrategy('')).toEqual(SizeUpdateStrategies.NilSizeValue);
    });
    it('should return "value-is-nil" if passed null or undefined as the size', () => {
      expect(getUpdateSizeStrategy(null)).toEqual(SizeUpdateStrategies.NilSizeValue);
      expect(getUpdateSizeStrategy(void 0)).toEqual(SizeUpdateStrategies.NilSizeValue);
    });
    it('should return "value-is-numeric" if passed a string that is also a number', () => {
      expect(getUpdateSizeStrategy('10')).toEqual(SizeUpdateStrategies.ValidNumericString);
    });
    it('should return "bad-value" if passed a string that is not a number and not a t-shirt size', () => {
      expect(getUpdateSizeStrategy('jabberwocky')).toEqual(SizeUpdateStrategies.BadSizeValue);
      expect(getUpdateSizeStrategy('xxxs')).toEqual(SizeUpdateStrategies.BadSizeValue);
      expect(getUpdateSizeStrategy('4d9rs')).toEqual(SizeUpdateStrategies.BadSizeValue); // test regex as this will pass parseInt
    });
  });

  describe('getIconSizeStylesToUpdate: ', () => {
    const myRem = '4rem';

    function testStyles(stylesArray: [string, string][], expectAuto = false) {
      stylesArray.forEach(tup => {
        const [style, value] = tup;
        if (expectAuto && (style === 'width' || style === 'height')) {
          expect(value).toBe('auto', `${style} is set to auto as expected`);
        } else {
          expect(value).toBe(myRem, `${style} is set to rem as expected`);
        }
      });
    }

    it('should set width and height to auto if size is "fit"', () => {
      const testme = getIconSizeStylesToUpdate('fit', myRem);
      testStyles(testme, true);
    });

    it('should set width and height to rem value if size is undefined', () => {
      const testme = getIconSizeStylesToUpdate(void 0, myRem);
      testStyles(testme);
    });

    it('should set width and height to rem value if size is null', () => {
      const testme = getIconSizeStylesToUpdate(null, myRem);
      testStyles(testme);
    });

    it('should set width and height to rem value if size is not "fit" or nil', () => {
      const testme = getIconSizeStylesToUpdate('500', myRem);
      testStyles(testme);
    });

    it('should set width and height to rem value even if size is empty', () => {
      const testme = getIconSizeStylesToUpdate('', myRem);
      testStyles(testme);
    });
  });

  // ---
  // Integration Tests (Uses TestBed)
  // ---
  describe('updateIconSizeStyle', () => {
    const testIcon = renderIcon('test');
    let fixture: ComponentFixture<TestComponent>;
    let component: ClrIcon;
    let nativeElement: HTMLElement;

    beforeAll(() => {
      ClarityIcons.addIcons(['testing', testIcon]);
    });

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [TestComponent],
      });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      component = fixture.componentInstance.icon;
      nativeElement = component.el.nativeElement;
    });

    it('should update size styles if passed a numeric string', async () => {
      const expectedSize = 'calc((15 / var(--cds-global-base)) * 1rem)';
      updateIconSizeStyle(nativeElement, '81 fit');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, '15');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual(expectedSize);
      expect(nativeElement.style.minWidth).toEqual(expectedSize);
      expect(nativeElement.style.height).toEqual(expectedSize);
      expect(nativeElement.style.minHeight).toEqual(expectedSize);
    });

    it('should update minimum size styles if passed a numeric string (fit sized)', async () => {
      updateIconSizeStyle(nativeElement, '15');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, '81 fit');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('auto');
      expect(nativeElement.style.height).toEqual('auto');
      expect(nativeElement.style.minWidth).toEqual('calc((81 / var(--cds-global-base)) * 1rem)');
      expect(nativeElement.style.minHeight).toEqual('calc((81 / var(--cds-global-base)) * 1rem)');
    });

    it('should remove size styles if passed a t-shirt size', async () => {
      component.size = '30';
      fixture.detectChanges();
      expect(nativeElement.style.height).toEqual('calc((30 / var(--cds-global-base)) * 1rem)');
      expect(nativeElement.style.width).toEqual('calc((30 / var(--cds-global-base)) * 1rem)');
      updateIconSizeStyle(nativeElement, 'xl');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.minWidth).toEqual('');
      expect(nativeElement.style.height).toEqual('');
      expect(nativeElement.style.minHeight).toEqual('');
    });

    it('should remove size styles if passed a t-shirt size (fit sized)', async () => {
      component.size = '30';
      fixture.detectChanges();
      expect(nativeElement.style.height).toEqual('calc((30 / var(--cds-global-base)) * 1rem)');
      expect(nativeElement.style.width).toEqual('calc((30 / var(--cds-global-base)) * 1rem)');
      updateIconSizeStyle(nativeElement, 'xl fit');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.minWidth).toEqual('');
      expect(nativeElement.style.height).toEqual('');
      expect(nativeElement.style.minHeight).toEqual('');
    });

    it('should remove size styles if passed a nil value', async () => {
      updateIconSizeStyle(nativeElement, 'lg fit');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, null);
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.height).toEqual('');
      updateIconSizeStyle(nativeElement, '48');
      fixture.detectChanges();
      const expectedSize = 'calc((48 / var(--cds-global-base)) * 1rem)';
      expect(nativeElement.style.width).toEqual(expectedSize);
      expect(nativeElement.style.minWidth).toEqual(expectedSize);
      expect(nativeElement.style.height).toEqual(expectedSize);
      expect(nativeElement.style.minHeight).toEqual(expectedSize);
      updateIconSizeStyle(nativeElement, void 0);
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.minWidth).toEqual('');
      expect(nativeElement.style.height).toEqual('');
      expect(nativeElement.style.minHeight).toEqual('');
    });

    it('should remove size styles if passed an empty string value', async () => {
      updateIconSizeStyle(nativeElement, 'xl');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, '');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.height).toEqual('');
      updateIconSizeStyle(nativeElement, '48 fit');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('auto');
      expect(nativeElement.style.minWidth).toEqual('calc((48 / var(--cds-global-base)) * 1rem)');
      expect(nativeElement.style.height).toEqual('auto');
      expect(nativeElement.style.minHeight).toEqual('calc((48 / var(--cds-global-base)) * 1rem)');
      updateIconSizeStyle(nativeElement, '');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual('');
      expect(nativeElement.style.height).toEqual('');
    });

    it('should do nothing if passed a string that is not a t-shirt size and is non-numeric', async () => {
      updateIconSizeStyle(nativeElement, 'sm');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, 'jabberwocky');
      fixture.detectChanges();
      updateIconSizeStyle(nativeElement, '24');
      fixture.detectChanges();
      const expectedSize = 'calc((24 / var(--cds-global-base)) * 1rem)';
      expect(nativeElement.style.width).toEqual(expectedSize);
      expect(nativeElement.style.minWidth).toEqual(expectedSize);
      expect(nativeElement.style.height).toEqual(expectedSize);
      expect(nativeElement.style.minHeight).toEqual(expectedSize);
      updateIconSizeStyle(nativeElement, '4d9rs');
      fixture.detectChanges();
      expect(nativeElement.style.width).toEqual(expectedSize);
      expect(nativeElement.style.minWidth).toEqual(expectedSize);
      expect(nativeElement.style.height).toEqual(expectedSize);
      expect(nativeElement.style.minHeight).toEqual(expectedSize);
    });
  });
});

@Component({
  template: ` <cds-icon></cds-icon> `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrIcon) icon: ClrIcon;
}
