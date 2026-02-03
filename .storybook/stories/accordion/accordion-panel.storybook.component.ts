/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrAccordionModule } from '@clr/angular';

@Component({
  selector: 'storybook-accordion-panel',
  standalone: true,
  template: `
    <clr-accordion>
      <clr-accordion>
        <clr-accordion-panel
          [clrAccordionPanelOpen]="clrAccordionPanelOpen"
          [clrAccordionPanelDisabled]="clrAccordionPanelDisabled"
          [clrAccordionPanelHeadingEnabled]="clrAccordionPanelHeadingEnabled"
          [clrAccordionPanelHeadingLevel]="clrAccordionPanelHeadingLevel"
          (clrAccordionPanelOpenChange)="clrAccordionPanelOpenChange.emit($event)"
        >
          <clr-accordion-title>{{ title }}</clr-accordion-title>
          <clr-accordion-content>{{ content }}</clr-accordion-content>
        </clr-accordion-panel>
      </clr-accordion>
    </clr-accordion>
  `,
  imports: [NgFor, NgIf, ClrAccordionModule],
})
export class AccordionPanelStorybookComponent {
  @Input() clrAccordionPanelOpen = false;
  @Input() clrAccordionPanelDisabled = false;
  @Input() clrAccordionPanelHeadingEnabled = false;
  @Input() clrAccordionPanelHeadingLevel = 1;
  @Input() title = 'Title';
  @Input() content = 'Hello World!';

  @Output() clrAccordionPanelOpenChange: EventEmitter<boolean> = new EventEmitter();
}
