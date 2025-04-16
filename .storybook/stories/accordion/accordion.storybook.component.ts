/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrAccordionModule } from '@clr/angular';
import { createArray } from 'helpers/common';

@Component({
  selector: 'storybook-accordion',
  standalone: true,
  template: `
    <clr-accordion [clrAccordionMultiPanel]="clrAccordionMultiPanel">
      <clr-accordion-panel
        *ngFor="let _ of createArray(panelCount); let i = index"
        [clrAccordionPanelOpen]="openIndices[i]"
        [clrAccordionPanelHeadingEnabled]="clrAccordionPanelHeadingEnabled"
        [clrAccordionPanelHeadingLevel]="clrAccordionPanelHeadingLevel"
      >
        <clr-accordion-title>
          {{ title }} {{ i + 1 }} {{ alignmentTest && i === 2 ? '(alignment test)' : '' }}
        </clr-accordion-title>
        <clr-accordion-description *ngIf="showDescriptions">Panel {{ i + 1 }} description.</clr-accordion-description>
        <clr-accordion-content
          >{{ content }} {{ i + 1 }}
          <storybook-accordion
            *ngIf="showNestedAccordion"
            [panelCount]="panelCount"
            [openIndices]="openIndices"
          ></storybook-accordion>
        </clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
  `,
  imports: [NgFor, NgIf, NgTemplateOutlet, ClrAccordionModule],
})
export class AccordionStorybookComponent {
  @Input() clrAccordionMultiPanel = false;
  @Input() clrAccordionPanelHeadingEnabled = false;
  @Input() clrAccordionPanelHeadingLevel = 1;
  @Input() panelCount = 5;
  @Input() title = 'Title';
  @Input() content = 'Hello World!';
  @Input() showDescriptions = false;
  @Input() openIndices = [];
  @Input() alignmentTest = false;
  @Input() showNestedAccordion = false;
  @Input() openNestedAccordion = false;
  createArray = createArray;
}
