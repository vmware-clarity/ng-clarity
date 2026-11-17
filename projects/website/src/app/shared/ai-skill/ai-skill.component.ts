/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClarityIcons, ClrIcon, copyIcon, downloadIcon } from '@clr/angular';

import RAW_AI_DOCS from '../../../compiled-content/ai-docs.json';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

const AI_DOCS = RAW_AI_DOCS as Record<string, (typeof RAW_AI_DOCS)[keyof typeof RAW_AI_DOCS]>;

@Component({
  selector: 'app-ai-skill',
  template: `
    @if (skillName && AI_DOCS[skillName]; as guide) {
      <section>
        <h2 cds-text="title" cds-layout="m-t:xl">AI agent guide</h2>
        <p cds-text="body" cds-layout="m-t:md">
          The <code cds-text="code">{{ skillName }}</code> guide ships in
          <code cds-text="code">{{ guide.packageName }}/ai/skills/{{ guide.packageSkill }}/references/</code> and
          teaches AI coding agents how to use this component. <a routerLink="/pages/ai">Set up AI agents</a>
        </p>
        <p cds-text="body" cds-layout="m-t:md">{{ guide.description }}</p>
        <div cds-layout="m-t:md">
          <button type="button" class="btn btn-sm btn-outline" (click)="copyGuide(guide.raw)">
            <clr-icon shape="copy"></clr-icon>
            {{ copied() ? 'Copied!' : 'Copy guide' }}
          </button>
          <a class="btn btn-sm btn-link" [href]="guide.url" [download]="skillName + '.md'">
            <clr-icon shape="download"></clr-icon>
            Download guide
          </a>
        </div>
        <div [innerHTML]="guide.html | appSafeHtml"></div>
      </section>
    }
  `,
  imports: [ClrIcon, RouterLink, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AiSkillComponent {
  @Input({ required: true }) skillName: string | undefined;

  readonly AI_DOCS = AI_DOCS;

  protected readonly copied = signal(false);

  constructor(private readonly liveAnnouncer: LiveAnnouncer) {
    ClarityIcons.addIcons(copyIcon, downloadIcon);
  }

  protected async copyGuide(raw: string) {
    await navigator.clipboard.writeText(raw);
    this.copied.set(true);
    await this.liveAnnouncer.announce(`${this.skillName} guide copied to clipboard`);
    setTimeout(() => {
      this.copied.set(false);
    }, 3000);
  }
}
