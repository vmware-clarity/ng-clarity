/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomLevelServiceMock } from '@clr/addons/testing';

import { ZoomLevelIndicatorDirective } from './zoom-level-indicator.directive';
import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

interface ThisTest {
  component: DummyComponent;
  fixture: ComponentFixture<DummyComponent>;
  service: ZoomLevelService;
}

@Component({
  standalone: false,
  template: '<div zoomLevelIndicator></div>',
})
class DummyComponent {}
describe('ZoomLevelIndicatorDirective', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
      ],
      declarations: [ZoomLevelIndicatorDirective, DummyComponent],
    });

    this.fixture = TestBed.createComponent(DummyComponent);
    this.service = TestBed.inject(ZoomLevelService);
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  describe('When applied on element', () => {
    beforeEach(function (this: ThisTest) {
      (this.service as any).resizeSubject.next(ZoomLevel.none);
      this.fixture.detectChanges();
    });

    it('Then emitted class is applied on the DOM element', function (this: ThisTest) {
      expect(this.fixture.debugElement.query(By.css('.no-zoom'))).toBeTruthy();
    });
  });
});
