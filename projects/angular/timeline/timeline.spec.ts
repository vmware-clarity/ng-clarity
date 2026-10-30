/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrTimelineLayout } from './enums/timeline-layout.enum';
import { ClrTimeline } from './timeline';
import { ClrTimelineStep } from './timeline-step';
import { ClrTimelineModule } from './timeline.module';

describe('Timeline', () => {
  describe('ClrTimeline component', () => {
    describe('Template API', () => {
      let fixture: ComponentFixture<TestTimeline>;
      let testComponent: TestTimeline;

      let nativeElement: HTMLElement;
      let nativeComponent: ClrTimeline;

      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ClrTimeline, TestTimeline],
        });

        fixture = TestBed.createComponent(TestTimeline);
        renderFixture(fixture);

        testComponent = fixture.componentInstance;
        nativeElement = fixture.nativeElement.querySelector('#timeline');
        nativeComponent = testComponent.timeline;
      });

      it('should add host classes', () => {
        expect(nativeElement.className).toContain('clr-timeline');
      });

      it('has the right default layout', () => {
        expect(testComponent.noLayout.layout).toBe(ClrTimelineLayout.HORIZONTAL);
      });

      it('accepts a [clrLayout] input', () => {
        expect(nativeComponent.layout).toBe(ClrTimelineLayout.HORIZONTAL);

        testComponent.layout = ClrTimelineLayout.VERTICAL;
        renderFixture(fixture);
        expect(nativeComponent.layout).toBe(ClrTimelineLayout.VERTICAL);
      });

      it('renders correctly the layout', () => {
        expect(nativeElement.className).toContain('clr-timeline');

        testComponent.layout = ClrTimelineLayout.HORIZONTAL;
        renderFixture(fixture);
        expect(nativeElement.className).not.toContain('clr-timeline-vertical');

        testComponent.layout = ClrTimelineLayout.VERTICAL;
        renderFixture(fixture);
        expect(nativeElement.className).toContain('clr-timeline-vertical');
      });
    });

    describe('View', () => {
      let fixture: ComponentFixture<TestTimelineContent>;
      let timelineSteps: DebugElement[];

      beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [TestTimelineContent],
          imports: [ClrTimelineModule],
        });

        fixture = TestBed.createComponent(TestTimelineContent);
        renderFixture(fixture);

        timelineSteps = fixture.debugElement.queryAll(By.directive(ClrTimelineStep));
      });

      it('should project steps', () => {
        renderFixture(fixture);
        expect(timelineSteps.length).toBe(3);
      });
    });
  });
});

@Component({
  template: `
    <clr-timeline #noLayout id="no-layout"></clr-timeline>
    <clr-timeline [clrLayout]="layout" #timeline id="timeline"></clr-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestTimeline {
  @ViewChild('noLayout', { static: false }) noLayout: ClrTimeline;
  @ViewChild('timeline', { static: false }) timeline: ClrTimeline;

  layout: ClrTimelineLayout = ClrTimelineLayout.HORIZONTAL;
}

@Component({
  template: `
    <clr-timeline>
      <clr-timeline-step></clr-timeline-step>
      <clr-timeline-step></clr-timeline-step>
      <clr-timeline-step></clr-timeline-step>
    </clr-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestTimelineContent {}
