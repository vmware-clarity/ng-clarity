/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class WizardHelper {
  readonly #navPanelSelector = '.clr-wizard-stepnav-wrapper';
  readonly #navitemSelector = 'clr-wizard-stepnav .clr-wizard-stepnav-item';
  readonly #showStepNavBinSelector = '.btn-show-stepnav';
  readonly #closeStepNavBinSelector = '.btn-close-stepnav';

  constructor(private wizard: DebugElement) {}

  get pageNavTitles(): Array<string | undefined> {
    // getlastTextNode is needed because cds-icon contains a span with text labels for
    // the icons which we don't care about.
    return this.wizard
      .queryAll(By.css(this.#navitemSelector + ' .clr-wizard-stepnav-link-title'))
      .map((v: DebugElement) => this.getLastTextNode(v));
  }

  get isVisible(): boolean {
    return getComputedStyle(this.wizard.nativeElement)['visibility'] === 'visible';
  }

  get activePageNavTitle(): string | undefined {
    const activeNavItem: DebugElement = this.wizard.query(
      By.css(this.#navitemSelector + '.active .clr-wizard-stepnav-link-title')
    );
    if (!activeNavItem) {
      return '';
    }

    return this.getLastTextNode(activeNavItem);
  }

  get activePageTitle(): string {
    return this.wizard.query(By.css('.clr-wizard-page-title')).nativeElement.innerText.trim();
  }

  get size(): string | undefined {
    return (Array.from(this.wizard.nativeElement.classList) as string[])
      .map((value: string) => {
        const matches = value.match(/^wizard-(sm|md|lg|xl)$/);
        return (matches || [])[1];
      })
      .filter(v => !!v)
      .pop();
  }

  get buttons(): DebugElement[] {
    return this.wizard.queryAll(By.css('clr-wizard-button button'));
  }

  get visibleButtons(): DebugElement[] {
    return this.buttons.filter((value: DebugElement) => {
      return value.nativeElement.parentElement.getAttribute('aria-hidden') === 'false';
    });
  }

  get cancelButton(): DebugElement {
    return this.buttons[0];
  }

  get cancelButtonText(): string {
    return this.cancelButton.nativeElement.innerText.trim();
  }

  get backButton(): DebugElement {
    return this.buttons[1];
  }

  get backButtonText(): string {
    return this.backButton.nativeElement.innerText.trim();
  }

  get nextButton(): DebugElement {
    return this.buttons[2];
  }

  get nextButtonText(): string {
    return this.nextButton.nativeElement.innerText.trim();
  }

  get finishButton(): DebugElement {
    return this.buttons[3];
  }

  get finishButtonText(): string {
    return this.finishButton.nativeElement.innerText.trim();
  }

  private get stepNavPanel(): DebugElement {
    return this.wizard.query(By.css(this.#navPanelSelector));
  }

  private get stepNavs(): Array<DebugElement> {
    return this.wizard.queryAll(By.css(this.#navitemSelector + ' .clr-wizard-stepnav-link'));
  }

  private get showStepNavBtn(): DebugElement {
    return this.wizard.query(By.css(this.#showStepNavBinSelector));
  }

  private get closeStepNavBtn(): DebugElement {
    return this.wizard.query(By.css(this.#closeStepNavBinSelector));
  }

  navigateToStep(stepIndex: number) {
    this.click(this.stepNavs[stepIndex]);
  }

  isNavVisible(): boolean {
    return getComputedStyle(this.stepNavPanel.nativeElement)['display'] !== 'none';
  }

  isStepNavEnabled(stepIndex: number): boolean {
    return this.stepNavs[stepIndex].attributes['disabled'] === undefined;
  }

  isShowNavIconVisible(): boolean {
    return getComputedStyle(this.showStepNavBtn.nativeElement)['display'] !== 'none';
  }

  showNavigator(): void {
    this.click(this.showStepNavBtn);
  }

  closeNavigator(): void {
    this.click(this.closeStepNavBtn);
  }

  cancel(): void {
    this.click(this.cancelButton);
  }

  back(): void {
    this.click(this.backButton);
  }

  next(): void {
    this.click(this.nextButton);
  }

  finish(): void {
    this.click(this.finishButton);
  }

  private click(el: DebugElement) {
    el.triggerEventHandler('click', null);
  }

  private getLastTextNode(debugElement: DebugElement): string {
    // Find the last child node of type text (3)
    const childNodes: NodeList = debugElement.nativeElement.childNodes;
    let result = '';
    childNodes.forEach((node: Node) => {
      if (node.nodeType === 3) {
        const text = node.textContent?.trim() || '';
        // comments included by Angular are seen as text nodes, but terxtContent returns
        // an empty string. We should ignore those.
        if (text !== '') {
          result = text;
        }
      }
    });
    return result;
  }
}
