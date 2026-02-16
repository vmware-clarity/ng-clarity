/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@cds/core/icon';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

/* eslint-disable @typescript-eslint/no-var-requires */
const RequiredFieldsHtml = require('!raw-loader!./ng/required-fields.html').default;
const RequiredFieldsTs = require('!raw-loader!./ng/required-fields.ts').default;
const TabsOverflowHtml = require('!raw-loader!./ng/tabs-overflow.html').default;
const TabsOverflowTs = require('!raw-loader!./ng/tabs-overflow.ts').default;
const ZoomLevelServiceTs = require('!raw-loader!./ng/zoom-level-service.ts').default;
const ZoomLevelHtml = require('!raw-loader!./ng/zoom-level.html').default;
const ZoomLevelScss = require('!raw-loader!./ng/zoom-level.scss').default;
const ZoomLevelTs = require('!raw-loader!./ng/zoom-level.ts').default;

const ModuleImportExample = `
import { AppfxA11yModule } from '@vmw/appfx/a11y';

@NgModule({
  imports: [AppfxA11yModule],
})
export class MyModule {}
`;

@Component({
  selector: 'clr-accessibility-addon-demo',
  templateUrl: './a11y.demo.html',
  styleUrl: './a11y.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class AcessibilityAddonDemo extends ClarityDocComponent {
  moduleImportExample = ModuleImportExample;
  zoomLevelServiceTs = ZoomLevelServiceTs;

  tabsOverflowHtml = TabsOverflowHtml;
  tabsOverflowTs = TabsOverflowTs;

  requiredFieldsHtml = RequiredFieldsHtml;
  requiredFieldsTs = RequiredFieldsTs;

  zoomLevelHtml = ZoomLevelHtml;
  zoomLevelStyles = ZoomLevelScss;
  zoomLevelTs = ZoomLevelTs;

  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('accessibility');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
