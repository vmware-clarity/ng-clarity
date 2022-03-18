/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from './destroy.service';

export default function (): void {
  describe('ClrDestroyService', () => {
    it('should teardown subscription once the view is destroyed', () => {
      // Arrange
      const finalizeSpy = jasmine.createSpy();

      @Component({
        template: '',
        providers: [ClrDestroyService],
      })
      class TestComponent implements OnInit {
        subject$ = new Subject<void>();

        constructor(private destroy$: ClrDestroyService) {}

        ngOnInit(): void {
          this.subject$.pipe(takeUntil(this.destroy$), finalize(finalizeSpy)).subscribe();
        }
      }

      TestBed.configureTestingModule({
        declarations: [TestComponent],
      });

      // Act
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      fixture.destroy();

      // Assert
      expect(finalizeSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.subject$.observers.length).toEqual(0);
    });
  });
}
