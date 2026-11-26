/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZoomLevelServiceMock } from '@clr/addons/testing';
import { renderFixture } from '@clr/angular/utils/testing';
import { of } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div zoomLevelIndicator></div>',
})
class DummyComponent {}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div zoomLevelIndicator></div>',
})
class OnPushHostComponent {}
describe('ZoomLevelIndicatorDirective', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ZoomLevelService,
          useClass: ZoomLevelServiceMock,
        },
      ],
      declarations: [ZoomLevelIndicatorDirective, DummyComponent, OnPushHostComponent],
    });

    testContext.fixture = TestBed.createComponent(DummyComponent);
    testContext.service = TestBed.inject(ZoomLevelService);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('When applied on element', () => {
    beforeEach(() => {
      (testContext.service as any).resizeSubject.next(ZoomLevel.none);
      renderFixture(testContext.fixture);
    });

    it('Then emitted class is applied on the DOM element', () => {
      expect(testContext.fixture.debugElement.query(By.css('.no-zoom'))).toBeTruthy();
    });
  });

  describe('When the zoom level changes after an OnPush host was rendered', () => {
    it('Then the new class is applied on the DOM element', async () => {
      const fixture = TestBed.createComponent(OnPushHostComponent);
      fixture.autoDetectChanges();
      (testContext.service as any).resizeSubject.next(ZoomLevel.none);
      await fixture.whenStable();
      const element: HTMLElement = fixture.nativeElement.querySelector('div');
      expect(element.classList).toContain(ZoomLevel.none);

      (testContext.service as any).resizeSubject.next(ZoomLevel.x4);
      await fixture.whenStable();

      expect(element.classList).toContain(ZoomLevel.x4);
      expect(element.classList).not.toContain(ZoomLevel.none);
      fixture.destroy();
    });
  });
});

describe('ZoomLevelIndicatorDirective API compatibility', () => {
  it('tolerates a ZoomLevelService test double without `level`', () => {
    const directive = new ZoomLevelIndicatorDirective({ onChange: of(ZoomLevel.x4) } as unknown as ZoomLevelService);

    expect(directive.zoomLevel).toBeUndefined();
  });

  it('keeps `zoomLevel` writable and the lifecycle methods callable', () => {
    const directive = new ZoomLevelIndicatorDirective(new ZoomLevelServiceMock() as unknown as ZoomLevelService);

    directive.zoomLevel = ZoomLevel.x2;

    expect(directive.zoomLevel).toBe(ZoomLevel.x2);
    expect(() => {
      directive.ngOnInit();
      directive.ngOnDestroy();
    }).not.toThrow();
  });
});
