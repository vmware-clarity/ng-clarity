/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipIdService } from './providers/tooltip-id.service';
import { ClrTooltipContent } from './tooltip-content';
import { ClrTooltipModule } from './tooltip.module';
import { TestContext } from '../../utils/testing/helpers.spec';
import { ClrPopoverService } from '../common';
import { ClrTooltipTrigger } from './tooltip-trigger';
import { ClrPopoverPosition } from '../common/utils/popover-positions';

@Component({
  template: `
    <clr-tooltip>
      <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
      <clr-tooltip-content>Hello world</clr-tooltip-content>
    </clr-tooltip>
  `,
  standalone: false,
})
class DefaultTest {}

@Component({
  template: `
    <clr-tooltip>
      <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
      <clr-tooltip-content [id]="idValue">Hello world</clr-tooltip-content>
    </clr-tooltip>
  `,
  standalone: false,
})
class IdTest {
  idValue: string;
}

@Component({
  template: `
    <div style="padding: 150px">
      For top spacing
      <clr-tooltip>
        <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
        <clr-tooltip-content [clrPosition]="position" [clrSize]="size">Hello world</clr-tooltip-content>
      </clr-tooltip>
    </div>
  `,
  standalone: false,
})
class SimpleTest {
  position: ClrPopoverPosition;
  size: string;
}

interface TooltipContext<H> extends TestContext<ClrTooltipContent, H> {
  popoverService: ClrPopoverService;
  tooltipIdService: TooltipIdService;
}

export default function (): void {
  describe('TooltipContent component', function () {
    describe('Template API', function () {
      describe('defaults', function () {
        let fixture: ComponentFixture<DefaultTest>;
        let popoverService: ClrPopoverService;
        let tooltipContent: HTMLElement;

        beforeEach(async () => {
          TestBed.configureTestingModule({
            imports: [ClrTooltipModule],
            declarations: [DefaultTest],
            providers: [ClrPopoverService, TooltipIdService],
          });

          fixture = TestBed.createComponent(DefaultTest);
          popoverService = fixture.debugElement.query(By.directive(ClrTooltipTrigger)).injector.get(ClrPopoverService);

          popoverService.open = true;
          fixture.detectChanges();

          tooltipContent = document.body.querySelector('clr-tooltip-content') as HTMLElement;
        });

        afterEach(() => {
          fixture.destroy();
        });

        it('sets the correct default classes', function (this: TooltipContext<DefaultTest>) {
          expect(tooltipContent.classList).toContain('tooltip-content');
          expect(tooltipContent.classList).toContain('tooltip-sm');
          expect(tooltipContent.parentElement.classList).toContain('right');
        });
      });

      describe('handles values for custom id', function () {
        let fixture: ComponentFixture<IdTest>;
        let popoverService: ClrPopoverService;
        let tooltipContent: HTMLElement;

        beforeEach(async () => {
          TestBed.configureTestingModule({
            imports: [ClrTooltipModule],
            declarations: [IdTest],
            providers: [ClrPopoverService, TooltipIdService],
          });

          fixture = TestBed.createComponent(IdTest);
          popoverService = fixture.debugElement.query(By.directive(ClrTooltipTrigger)).injector.get(ClrPopoverService);

          popoverService.open = true;
          fixture.detectChanges();

          tooltipContent = document.body.querySelector('clr-tooltip-content') as HTMLElement;
        });

        it('accepts an [id] when an undefined id is provided', function () {
          // IdTest component starts with idValue undefined
          expect(tooltipContent.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when a null id is provided', function () {
          fixture.componentInstance.idValue = null;
          fixture.detectChanges();
          expect(tooltipContent.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when an empty string id is provided', function () {
          fixture.componentInstance.idValue = '';
          fixture.detectChanges();
          expect(tooltipContent.getAttribute('id')).toEqual('');
        });

        it('accepts an [id] when an custom string id is provided', function () {
          fixture.componentInstance.idValue = 'custom-id';
          fixture.detectChanges();
          expect(tooltipContent.getAttribute('id')).toEqual('custom-id');
        });
      });

      describe('handles inputs for position and size', function () {
        let fixture: ComponentFixture<SimpleTest>;
        let popoverService: ClrPopoverService;
        let tooltipContent: HTMLElement;

        beforeEach(async () => {
          TestBed.configureTestingModule({
            imports: [ClrTooltipModule],
            declarations: [SimpleTest],
            providers: [ClrPopoverService, TooltipIdService],
          });

          fixture = TestBed.createComponent(SimpleTest);
          popoverService = fixture.debugElement.query(By.directive(ClrTooltipTrigger)).injector.get(ClrPopoverService);

          popoverService.open = true;
          fixture.detectChanges();

          tooltipContent = document.body.querySelector('clr-tooltip-content') as HTMLElement;
        });

        it('sets an id when no id is provided', function () {
          const clrTooltipContent = fixture.debugElement
            .query(By.directive(ClrTooltipContent))
            .injector.get(ClrTooltipContent);
          expect(clrTooltipContent.id).toEqual(tooltipContent.getAttribute('id'));
        });

        it('accepts a [clrPosition] input', function () {
          const tooltipContainer = tooltipContent.parentElement;
          // Default is right
          expect(tooltipContainer.classList).toContain(ClrPopoverPosition.RIGHT);

          fixture.componentInstance.position = ClrPopoverPosition.BOTTOM_RIGHT;
          fixture.detectChanges();

          expect(tooltipContainer.classList).not.toContain(ClrPopoverPosition.RIGHT);
          expect(tooltipContainer.classList).toContain(ClrPopoverPosition.BOTTOM_RIGHT);

          fixture.componentInstance.position = ClrPopoverPosition.TOP_LEFT;
          fixture.detectChanges();

          console.log(tooltipContainer.classList);
          expect(tooltipContainer.classList).not.toContain(ClrPopoverPosition.BOTTOM_RIGHT);
          expect(tooltipContainer.classList).toContain(ClrPopoverPosition.TOP_LEFT);
        });

        it('accepts a [clrSize] input', function () {
          const clrTooltipContent = fixture.debugElement
            .query(By.directive(ClrTooltipContent))
            .injector.get(ClrTooltipContent);
          // Default is small
          expect(clrTooltipContent.size).toEqual('sm');
          expect(tooltipContent.classList).toContain('tooltip-sm');

          fixture.componentInstance.size = 'lg';
          fixture.detectChanges();

          expect(clrTooltipContent.size).toEqual('lg');
          expect(tooltipContent.classList).not.toContain('tooltip-sm');
          expect(tooltipContent.classList).toContain('tooltip-lg');
        });
      });
    });

    describe('View basics', function () {
      let fixture: ComponentFixture<SimpleTest>;
      let popoverService: ClrPopoverService;
      let tooltipContent: HTMLElement;

      beforeEach(async () => {
        TestBed.configureTestingModule({
          imports: [ClrTooltipModule],
          declarations: [SimpleTest],
          providers: [ClrPopoverService, TooltipIdService],
        });

        fixture = TestBed.createComponent(SimpleTest);
        popoverService = fixture.debugElement.query(By.directive(ClrTooltipTrigger)).injector.get(ClrPopoverService);

        popoverService.open = true;
        fixture.detectChanges();

        tooltipContent = document.body.querySelector('clr-tooltip-content') as HTMLElement;
      });

      it('projects content', function () {
        expect(tooltipContent.textContent.trim()).toMatch('Hello world');
      });

      it('adds the .tooltip-content class to the host', function () {
        expect(tooltipContent.classList).toContain('tooltip-content');
      });

      it('has the correct role', function () {
        expect(tooltipContent.getAttribute('role')).toBe('tooltip');
      });

      it('has an id', function () {
        expect(tooltipContent.getAttribute('id')).toBeTruthy();
      });
    });
  });
}
