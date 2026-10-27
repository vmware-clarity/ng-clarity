/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAccordionModule } from '@clr/angular';

import AI_AGENTS from '../../../compiled-content/ai-agents.json';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

// Rendered inside Markdown content pages as the <app-ai-agents> custom element.
@Component({
  selector: 'app-ai-agents',
  template: `
    <clr-accordion cds-layout="m-t:md">
      @for (agents of AI_AGENTS; track agents.packageName) {
        <clr-accordion-panel>
          <clr-accordion-title>AGENTS.md for {{ agents.packageName }}</clr-accordion-title>
          <clr-accordion-content>
            <div [innerHTML]="agents.html | appSafeHtml"></div>
            <p cds-text="body" cds-layout="m-t:md">
              <a [href]="agents.url" download="AGENTS.md">Download AGENTS.md</a>
            </p>
          </clr-accordion-content>
        </clr-accordion-panel>
      }
    </clr-accordion>
  `,
  imports: [ClrAccordionModule, SafeHtmlPipe],
})
export class AiAgentsComponent {
  readonly AI_AGENTS = AI_AGENTS;
}
