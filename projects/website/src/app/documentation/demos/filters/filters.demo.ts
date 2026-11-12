/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrAccordionModule, ClrIfExpanded } from '@clr/angular';

import { DatagridFiltersDateTimeDemoComponent } from './ng/date-time-filters';
import { DatagridFiltersModesDemoComponent } from './ng/filter-modes';
import { DatagridFiltersPredefinedDemoComponent } from './ng/predefined-filters';
import { DatagridFiltersPropertyDefinitionsDemoComponent } from './ng/property-definitions';
import { DatagridFiltersSemiPredefinedDemoComponent } from './ng/semi-predefined-filters';
import { DatagridFiltersToggleDemoComponent } from './ng/toggle-filters';
import { DatagridFiltersTwoWayDemoComponent } from './ng/two-way-binding';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

// StackBlitz loads the class as `ExampleComponent` in `example.component.ts`, with the template in `example.component.html`.
const replaceComponentName = (file: string) =>
  file
    .replace(/(export class )\w+/, '$1ExampleComponent')
    .replace(/selector: '[^']+'/, "selector: 'app-example'")
    .replace(/templateUrl: '[^']+'/, "templateUrl: './example.component.html'");

const AppliedFiltersTs = require('!raw-loader!./ng/applied-filters.ts').default;
const DateTimeHtml = require('!raw-loader!./ng/date-time-filters.html').default;
const DateTimeTs = replaceComponentName(require('!raw-loader!./ng/date-time-filters.ts').default);
const FilterModesHtml = require('!raw-loader!./ng/filter-modes.html').default;
const FilterModesTs = replaceComponentName(require('!raw-loader!./ng/filter-modes.ts').default);
const PredefinedHtml = require('!raw-loader!./ng/predefined-filters.html').default;
const PredefinedTs = replaceComponentName(require('!raw-loader!./ng/predefined-filters.ts').default);
const PropertyDefinitionsHtml = require('!raw-loader!./ng/property-definitions.html').default;
const PropertyDefinitionsTs = replaceComponentName(require('!raw-loader!./ng/property-definitions.ts').default);
const SemiPredefinedHtml = require('!raw-loader!./ng/semi-predefined-filters.html').default;
const SemiPredefinedTs = replaceComponentName(require('!raw-loader!./ng/semi-predefined-filters.ts').default);
const ToggleHtml = require('!raw-loader!./ng/toggle-filters.html').default;
const ToggleTs = replaceComponentName(require('!raw-loader!./ng/toggle-filters.ts').default);
const TwoWayHtml = require('!raw-loader!./ng/two-way-binding.html').default;
const TwoWayTs = replaceComponentName(require('!raw-loader!./ng/two-way-binding.ts').default);
const VmPropertiesTs = require('!raw-loader!./ng/vm-properties.ts').default;

// Files the examples import, added next to `example.component.ts` in StackBlitz.
const additionalFiles = {
  'applied-filters.ts': AppliedFiltersTs,
  'vm-properties.ts': VmPropertiesTs,
};

@Component({
  selector: 'clr-filters-demo',
  templateUrl: './filters.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    CodeSnippetComponent,
    StackblitzExampleComponent,
    AiSkillComponent,
    RouterLink,
    ClrAccordionModule,
    ClrIfExpanded,
    DatagridFiltersModesDemoComponent,
    DatagridFiltersPredefinedDemoComponent,
    DatagridFiltersSemiPredefinedDemoComponent,
    DatagridFiltersToggleDemoComponent,
    DatagridFiltersTwoWayDemoComponent,
    DatagridFiltersDateTimeDemoComponent,
    DatagridFiltersPropertyDefinitionsDemoComponent,
  ],
})
export class FiltersDemo extends ClarityDocComponent {
  filterModesHtml = FilterModesHtml;
  filterModesTs = FilterModesTs;
  predefinedHtml = PredefinedHtml;
  predefinedTs = PredefinedTs;
  semiPredefinedHtml = SemiPredefinedHtml;
  semiPredefinedTs = SemiPredefinedTs;
  toggleHtml = ToggleHtml;
  toggleTs = ToggleTs;
  twoWayHtml = TwoWayHtml;
  twoWayTs = TwoWayTs;
  dateTimeHtml = DateTimeHtml;
  dateTimeTs = DateTimeTs;
  vmPropertiesTs = VmPropertiesTs;
  appliedFiltersTs = AppliedFiltersTs;
  additionalFiles = additionalFiles;
  propertyDefinitionsHtml = PropertyDefinitionsHtml;
  propertyDefinitionsTs = PropertyDefinitionsTs;

  constructor() {
    super('filters');
  }
}
