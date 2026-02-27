/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrIcon,
  ClrIconModule,
  ClrIfActive,
  ClrPopoverHostDirective,
  ClrSpinnerModule,
  ClrStopEscapePropagationDirective,
  ClrTabsModule,
  ClrTimelineLayout,
  ClrTimelineModule,
  ClrTimelineStepState,
} from '@clr/angular';

import { TimelineDemo } from './timeline.demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = {
  staticHorizontal: `
<ul class="clr-timeline">
  <li class="clr-timeline-step disabled">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="circle" aria-label="Not started"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Add KMS</span>
      <span class="clr-timeline-step-description">Root CA certificate requested.</span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="dot-circle" aria-label="Current"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Add KMS</span>
      <span class="clr-timeline-step-description">
    Root CA certificate requested. Upload it to the KMS to complete the connection.
    <button class="btn btn-sm">Upload Certificate</button>
  </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-spinner clrMedium aria-label="In progress">Fetching data</clr-spinner>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Make vCenter trust KMS</span>
      <span class="clr-timeline-step-description">
    Root CA certificate requested. Upload it to the KMS to complete the connection. Third sentence is very long
    and very long.
  </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="success-standard" aria-label="Completed"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Make KMS trust vCenter</span>
      <span class="clr-timeline-step-description">Upload it to the KMS to complete the connection. Third
    sentence.
    <button class="btn btn-sm btn-link">Authorize</button>
  </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="error-standard" aria-label="Error"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Connected</span>
      <span class="clr-timeline-step-description">No. It's not connected.</span>
    </div>
  </li>
</ul>`,
  staticVertical: `
<ul class="clr-timeline clr-timeline-vertical">
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="circle" aria-label="Not started"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Add KMS</span>
      <span class="clr-timeline-step-description">Root CA certificate requested.</span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="dot-circle" aria-label="Current"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Add KMS</span>
      <span class="clr-timeline-step-description">
        Root CA certificate requested. Upload it to the KMS to complete the connection.
        <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of an Image in a Card" />
      </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <span class="clr-timeline-step-header">11:59 am</span>
    <clr-spinner clrMedium aria-label="In progress">Fetching data</clr-spinner>
      <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Make vCenter trust KMS</span>
      <span class="clr-timeline-step-description">
        Root CA certificate requested. Upload it to the KMS to complete the connection. Third sentence is very long
        and very long.
      </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header">11:59 am</div>
    <clr-icon role="img" shape="success-standard" aria-label="Completed"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Make KMS trust vCenter</span>
      <span class="clr-timeline-step-description">Upload it to the KMS to complete the connection. Third
        sentence.
        <button class="btn btn-sm">Refresh</button>
      </span>
    </div>
  </li>
  <li class="clr-timeline-step">
    <div class="clr-timeline-step-header"></div>
    <clr-icon role="img" shape="error-standard" aria-label="Error"></clr-icon>
    <div class="clr-timeline-step-body">
      <span class="clr-timeline-step-title">Connected</span>
      <span class="clr-timeline-step-description">No. It's not connected.</span>
    </div>
  </li>
</ul>
  `,
  componentHorizontal: `
<clr-timeline [clrLayout]="ClrTimelineLayout.HORIZONTAL" >
  <clr-timeline-step [clrState]="ClrTimelineStepState.NOT_STARTED">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Add KMS</clr-timeline-step-title>
    <clr-timeline-step-description>Root CA certificate requested.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.CURRENT">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Add KMS</clr-timeline-step-title>
    <clr-timeline-step-description>
      Root CA certificate requested. Upload it to the KMS to complete the connection.
      <button class="btn btn-sm">Upload Certificate</button>
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step class="gemini-ignore" [clrState]="ClrTimelineStepState.PROCESSING">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Make vCenter trust KMS</clr-timeline-step-title>
    <clr-timeline-step-description>
      Root CA certificate requested. Upload it to the KMS to complete the connection. Third sentence is very long
      and very long.
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.SUCCESS">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Make KMS trust vCenter</clr-timeline-step-title>
    <clr-timeline-step-description>Upload it to the KMS to complete the connection. Third
      sentence.
      <button class="btn btn-sm btn-link">Authorize</button>
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.ERROR">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Connected</clr-timeline-step-title>
    <clr-timeline-step-description>No. It's not connected.</clr-timeline-step-description>
  </clr-timeline-step>
</clr-timeline>
`,
  componentVertical: `
<clr-timeline [clrLayout]="ClrTimelineLayout.VERTICAL" style="width: 50%">
  <clr-timeline-step [clrState]="ClrTimelineStepState.NOT_STARTED">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Add KMS</clr-timeline-step-title>
    <clr-timeline-step-description>Root CA certificate requested.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.CURRENT">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Add KMS</clr-timeline-step-title>
    <clr-timeline-step-description>
      Root CA certificate requested. Upload it to the KMS to complete the connection.
        <img src="/assets/images/documentation/cards/placeholder_350x150.png" alt="Example of an Image in a Card" />
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step class="gemini-ignore" [clrState]="ClrTimelineStepState.PROCESSING">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Make vCenter trust KMS</clr-timeline-step-title>
    <clr-timeline-step-description>
      Root CA certificate requested. Upload it to the KMS to complete the connection. Third sentence is very long
      and very long.
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.SUCCESS">
    <clr-timeline-step-header>11:59 am</clr-timeline-step-header>
    <clr-timeline-step-title>Make KMS trust vCenter</clr-timeline-step-title>
    <clr-timeline-step-description>Upload it to the KMS to complete the connection. Third
      sentence.
      <button class="btn btn-sm">Refresh</button>
    </clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="ClrTimelineStepState.ERROR">
    <clr-timeline-step-header></clr-timeline-step-header>
    <clr-timeline-step-title>Connected</clr-timeline-step-title>
    <clr-timeline-step-description>No. It's not connected.</clr-timeline-step-description>
  </clr-timeline-step>
</clr-timeline>
`,
  angularClass: `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  
  imports: [ClrTimelineModule],
})
export class ExampleComponent {
  readonly ClrTimelineLayout = ClrTimelineLayout;
  readonly ClrTimelineStepState = ClrTimelineStepState;
}`,
};

@Component({
  selector: 'clr-timeline-full-demo',
  templateUrl: './timeline-full-demo.component.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrTabsModule,
    ClrIfActive,
    ClrIcon,
    ClrIconModule,
    ClrSpinnerModule,
    StackblitzExampleComponent,
    ClrTimelineModule,
    TimelineDemo,
  ],
})
export class TimelineFullDemo {
  staticHorizontal = code.staticHorizontal;
  staticVertical = code.staticVertical;
  componentHorizontal = code.componentHorizontal;
  componentVertical = code.componentVertical;
  angularClass = code.angularClass;

  ClrTimelineLayout = ClrTimelineLayout;
  ClrTimelineStepState = ClrTimelineStepState;
}
