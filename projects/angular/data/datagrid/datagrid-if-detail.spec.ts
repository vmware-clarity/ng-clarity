/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrIfDetail } from './datagrid-if-detail';
import { DetailService } from './providers/detail.service';

const content = 'Detail Pane';

describe('ClrIfDetail Directive', function () {
  let fixture, testElement;
  let detailService: DetailService;
  let testComponent: IfDetailTest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClrIfDetail, IfDetailTest],
      providers: [DetailService],
    });
    fixture = TestBed.createComponent(IfDetailTest);
    testComponent = fixture.debugElement.componentInstance;
    testElement = fixture.debugElement.nativeElement;
    detailService = TestBed.inject(DetailService);
    vi.spyOn(detailService, 'close');
    renderFixture(fixture);
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Typescript API', () => {
    it('should initialize the detail service', () => {
      expect(detailService.close).toHaveBeenCalled();
    });

    it('should project input state', () => {
      const input = 'projected state';
      testComponent.detailState = input;
      renderFixture(fixture);
      expect(testElement.querySelector('.state').textContent).toBe(input);
    });

    it('should emit changes', () => {
      expect(testComponent.detailState).toBeNull();
      detailService.open(content);
      renderFixture(fixture);
      expect(testComponent.detailState).toEqual(content);
      detailService.close();
      renderFixture(fixture);
      expect(testComponent.detailState).toBeNull();
    });

    it('should not update the service when showing the panel through state change', () => {
      vi.spyOn(detailService, 'toggle').mockImplementation(() => undefined);
      vi.spyOn(testComponent.detail.stateChange, 'emit');
      detailService.open(content);
      renderFixture(fixture);
      expect(detailService.toggle).not.toHaveBeenCalled();
      expect(testComponent.detail.stateChange.emit).toHaveBeenCalledWith(testComponent.detailState);
    });
  });

  describe('Template API', () => {
    it('should show and hide the panel', () => {
      expect(testElement.innerHTML).not.toContain(content);
      detailService.open({});
      renderFixture(fixture);
      expect(testElement.innerHTML).toContain(content);
      detailService.close();
      renderFixture(fixture);
      expect(testElement.innerHTML).not.toContain(content);
    });

    it('should update the service when input changes', () => {
      vi.spyOn(detailService, 'toggle');
      testComponent.detailState = true;
      renderFixture(fixture);
      expect(detailService.toggle).toHaveBeenCalled();
      expect(testElement.innerHTML).toContain(content);
    });
  });
});

@Component({
  template: `<ng-template [(clrIfDetail)]="detailState" let-detail
    >${content}<span class="state">{{ detail }}</span></ng-template
  >`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class IfDetailTest {
  @ViewChild(ClrIfDetail) detail: ClrIfDetail;
  detailState = null;
}
