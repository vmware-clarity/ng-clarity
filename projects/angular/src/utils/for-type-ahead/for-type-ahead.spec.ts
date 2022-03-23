/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrForTypeAhead } from './for-type-ahead';
import { ClrForTypeAheadModule } from './for-type-ahead.module';
import { ForTypeAheadProvider } from './for-type-ahead.service';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <span [clrForTypeAhead]="textContent">World</span> `,
})
class TestComponent {
  textContent: string;
}

describe('ClrForTypeAhead', () => {
  let fixture: ComponentFixture<any>;
  let component: TestComponent;

  let forTypeAheadDirectiveDE: DebugElement;
  let forTypeAheadProvider: ForTypeAheadProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrForTypeAheadModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    forTypeAheadDirectiveDE = fixture.debugElement.query(By.directive(ClrForTypeAhead));
    forTypeAheadProvider = forTypeAheadDirectiveDE.injector.get(ForTypeAheadProvider);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('can use textContent of element if nothing gets passed to clrForTypeAhead input', () => {
    fixture.detectChanges();
    expect(forTypeAheadProvider.textContent).toBe('world');
  });

  it('can prioritize and use clrForTypeAhead input value', () => {
    component.textContent = 'Hello';
    fixture.detectChanges();
    expect(forTypeAheadProvider.textContent).toBe('hello');
    component.textContent = ' Hai   ';
    fixture.detectChanges();
    expect(forTypeAheadProvider.textContent).toBe('hai');
    component.textContent = '';
    fixture.detectChanges();
    expect(forTypeAheadProvider.textContent).toBe('world');
  });
});
