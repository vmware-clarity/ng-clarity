/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ViewChild } from '@angular/core';

import { COMPONENT_MAP, ComponentListElement } from './component-list';
import { DocTabsComponent } from '../../shared/doc-tabs/doc-tabs.component';

@Directive()
export class ClarityDocComponent {
  private readonly component: ComponentListElement | undefined;

  constructor(componentName: string) {
    this.component = COMPONENT_MAP.get(componentName);
  }

  @ViewChild(DocTabsComponent)
  set docTabs(docTabs: DocTabsComponent) {
    if (this.component) {
      docTabs.title = this.component.text;
      docTabs.type = this.component.type;
      docTabs.storybookPath = this.component.storybookPath;
    }
  }
}
