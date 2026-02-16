/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ClarityIcons, copyIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { ClrIconModule, ClrTabsModule } from '@clr/angular';
import stackblitz from '@stackblitz/sdk';

import { CondenseComponentClassPipe } from './condense-component-class.pipe';
import STACKBLITZ_EXAMPLE_TEMPLATE from '../../../compiled-content/stackblitz-example-template.json';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';

const stackblitzIcon: IconShapeTuple = [
  'stackblitz',
  '<svg width="16" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M4.75247 9.45171H0L8.68822 0.0163574L6.34957 6.54823H11.102L2.41318 15.9836L4.75183 9.45171H4.75247Z" fill="#0079AD"/></g></svg>',
];

@Component({
  selector: 'app-stackblitz-example',
  templateUrl: './stackblitz-example.component.html',
  styleUrl: './stackblitz-example.component.scss',
  imports: [CommonModule, ClrIconModule, ClrTabsModule, CodeSnippetComponent, CondenseComponentClassPipe],
})
export class StackblitzExampleComponent {
  @Input({ required: true }) name: string | undefined;
  @Input({ required: true }) componentTemplate: string | undefined;
  @Input() componentTemplateSnippet: string | undefined;
  @Input() componentStyles: string | undefined;
  @Input() componentClass: string | undefined;
  @Input() additionalFiles: { [filePath: string]: string } | undefined;
  @Input() showComponentStyles = true;
  @Input() showComponentClass = true;
  @Input() showComponentTemplate = true;

  protected copied = false;

  @ViewChild(CodeSnippetComponent) private readonly activeCodeSnippet: CodeSnippetComponent | undefined;

  constructor(private liveAnnouncer: LiveAnnouncer) {
    ClarityIcons.addIcons(copyIcon, stackblitzIcon);
  }

  protected openInStackBlitz() {
    // This should never happen, but we need to make TypeScript happy.
    if (!this.componentTemplate) {
      return;
    }

    const indexHtmlFilePath = 'src/index.html';
    const appComponentTemplateFilePath = 'src/app/app.component.html';
    const exampleComponentClassFilePath = 'src/app/example.component.ts';
    const exampleComponentTemplateFilePath = 'src/app/example.component.html';
    const exampleComponentStylesFilePath = 'src/app/example.component.scss';
    const filesToOpen = [exampleComponentTemplateFilePath];

    // clone the template files
    const files: Record<string, string> = { ...STACKBLITZ_EXAMPLE_TEMPLATE };

    // build the app component template
    files[appComponentTemplateFilePath] = buildAppComponentTemplate(this.componentTemplate);

    // add the example component template
    files[exampleComponentTemplateFilePath] = `${this.componentTemplate.trim()}\n`
      // make image paths absolute
      .replace(/src="\/assets\//g, 'crossorigin="annoymous" src="https://clarity.design/assets/');

    // add the example component styles
    if (this.componentStyles) {
      filesToOpen.unshift(exampleComponentStylesFilePath);
      files[exampleComponentStylesFilePath] = `${this.componentStyles.trim()}\n`;
    }

    // add the example component class
    if (this.componentClass) {
      filesToOpen.unshift(exampleComponentClassFilePath);
      files[exampleComponentClassFilePath] = `${this.componentClass.trim()}\n`;
    }

    // add additional files
    if (this.additionalFiles) {
      for (const [relativeFilePath, fileContents] of Object.entries(this.additionalFiles)) {
        const filePath = `src/app/${relativeFilePath}`;

        filesToOpen.unshift(filePath);
        files[filePath] = fileContents;
      }
    }

    // set the theme
    const theme = document.body.getAttribute('cds-theme');
    files[indexHtmlFilePath] = files[indexHtmlFilePath].replace('cds-theme="light"', `cds-theme="${theme}"`);

    // open in StackBlitz
    stackblitz.openProject(
      {
        files,
        template: 'node',
        title: `Clarity Example: ${this.name} (${theme} theme)`,
      },
      {
        newWindow: true,
        openFile: filesToOpen.join(),
      }
    );
  }

  protected copyCode() {
    const code = this.activeCodeSnippet?.getCode();

    if (code) {
      navigator.clipboard.writeText(code);
      this.liveAnnouncer.announce(`${this.name} example code is copied to clipboard`);

      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}

function buildAppComponentTemplate(exampleComponentTemplate: string) {
  const exampleElement = document.createElement('div');
  exampleElement.innerHTML = exampleComponentTemplate;

  let appComponentTemplate = '<app-example></app-example>';

  if (!exampleElement.querySelector('.main-container') && !exampleElement.querySelector('clr-main-container')) {
    appComponentTemplate = `
<div class="main-container">
  <div class="content-container">
    <div class="content-area">
      ${appComponentTemplate}
    </div>
  </div>
</div>
`;
  }

  return `${appComponentTemplate.trim()}\n`;
}
