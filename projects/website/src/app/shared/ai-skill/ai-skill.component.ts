/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClarityIcons, ClrIcon, copyIcon, downloadIcon } from '@clr/angular';

import RAW_AI_DOCS from '../../../compiled-content/ai-docs.json';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

const AI_DOCS = RAW_AI_DOCS as Record<string, (typeof RAW_AI_DOCS)[keyof typeof RAW_AI_DOCS]>;

@Component({
  selector: 'app-ai-skill',
  template: `
    @if (skillName && AI_DOCS[skillName]; as skill) {
      <section>
        <h2 cds-text="title" cds-layout="m-t:xl">AI agent skill</h2>
        <p cds-text="body" cds-layout="m-t:md">
          The <code cds-text="code">{{ skillName }}</code> skill ships in
          <code cds-text="code">{{ skill.packageName }}/ai/skills/</code> and teaches AI coding agents how to use this
          component. <a routerLink="/pages/ai">Set up AI agents</a>
        </p>
        <p cds-text="body" cds-layout="m-t:md">{{ skill.description }}</p>
        <div cds-layout="m-t:md">
          <button type="button" class="btn btn-sm btn-outline" (click)="copySkill(skill.raw)">
            <clr-icon shape="copy"></clr-icon>
            {{ copied ? 'Copied!' : 'Copy SKILL.md' }}
          </button>
          <a class="btn btn-sm btn-link" [href]="skill.url" download="SKILL.md">
            <clr-icon shape="download"></clr-icon>
            Download SKILL.md
          </a>
        </div>
        <div [innerHTML]="skill.html | appSafeHtml"></div>
      </section>
    }
  `,
  imports: [ClrIcon, RouterLink, SafeHtmlPipe],
})
export class AiSkillComponent {
  @Input({ required: true }) skillName: string | undefined;

  readonly AI_DOCS = AI_DOCS;

  protected copied = false;

  constructor(private readonly liveAnnouncer: LiveAnnouncer) {
    ClarityIcons.addIcons(copyIcon, downloadIcon);
  }

  protected async copySkill(raw: string) {
    await navigator.clipboard.writeText(raw);
    this.copied = true;
    await this.liveAnnouncer.announce(`${this.skillName} SKILL.md copied to clipboard`);
    setTimeout(() => (this.copied = false), 3000);
  }
}
