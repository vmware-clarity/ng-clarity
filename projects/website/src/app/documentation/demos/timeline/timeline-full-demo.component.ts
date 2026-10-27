/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIfActive, ClrTabsModule } from '@clr/angular';
import { TIMELINE_EXAMPLES } from '@clr/examples/timeline';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-timeline-full-demo',
  templateUrl: './timeline-full-demo.component.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [ClrTabsModule, ClrIfActive, DocExampleComponent],
})
export class TimelineFullDemo {
  readonly examples = TIMELINE_EXAMPLES;
}
