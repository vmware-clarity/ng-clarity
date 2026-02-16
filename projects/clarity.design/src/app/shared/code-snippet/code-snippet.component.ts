/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input } from '@angular/core';
import { ClarityIcons, copyIcon } from '@cds/core/icon';
import { ClrIconModule } from '@clr/angular';
import prismjs from 'prismjs';

// add languages for code highlighting
import 'prismjs/components/prism-typescript';

/**
 * Describe ES5/6 module import
 * let something = require('!raw-loader!/path-to-file')
 * => { default: <content of path-to-file as string> }
 */
type ESModuleImport = { default: string };

@Component({
  selector: 'app-code-snippet',
  template: `<pre tabindex="0"><code [innerHTML]="highlightedCode"></code></pre>
    @if (copy) {
    <div class="addons">
      <button class="btn btn-link" (click)="copyCode()" [attr.aria-label]="'Copy example code to clipboard'">
        <cds-icon shape="copy"></cds-icon>
        {{ copied ? 'Copied!' : 'Copy Code' }}
      </button>
    </div>
    } `,
  styleUrl: './code-snippet.component.scss',
  standalone: true,
  imports: [ClrIconModule],
  host: {
    '[class.allow-copy]': 'copy',
  },
})
export class CodeSnippetComponent {
  @Input() copy = false;

  protected highlightedCode: string | undefined;
  protected copied = false;

  private _code: string | undefined;
  private _language = 'html';

  constructor(private liveAnnouncer: LiveAnnouncer) {
    ClarityIcons.addIcons(copyIcon);
  }

  @Input()
  set code(code: string | ESModuleImport | undefined) {
    if (typeof code === 'object') {
      this._code = code.default;
    } else if (typeof code === 'string') {
      this._code = code;
    } else {
      this._code = undefined;
    }

    this.highlight();
  }

  @Input()
  set language(language: string) {
    this._language = language;
    this.highlight();
  }

  getCode() {
    return this._code;
  }

  protected copyCode() {
    const code = this.getCode();

    if (code) {
      navigator.clipboard.writeText(code);
      this.liveAnnouncer.announce(`example code is copied to clipboard`);

      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }

  private highlight() {
    const code = this._code?.trim();
    const language = this._language;

    this.highlightedCode =
      code && language ? prismjs.highlight(code, prismjs.languages[language], language) : undefined;
  }
}
