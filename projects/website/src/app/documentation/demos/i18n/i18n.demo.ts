/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';
import { I18nDemoModule } from './i18n.demo.module';

const KLINGON_TRANSLATION_EXAMPLE = `
export const klingonLocale: Partial<ClrCommonStrings> = {
  open: 'ghIt',
  close: 'SoQmoH',
};
`;

const LOCALIZE_COMMON_STRINGS_EXAMPLE = `
import { ClrCommonStringsService } from '@clr/angular';
import { klingonLocale } from './translations/klingon';

@Component({
  // ...
})
export class AppComponent {
  constructor(commonStrings: ClrCommonStringsService) {
    // Call this method to set the new locale values into the service, defaults for English
    // will be used for in any missing strings
    commonStrings.localize(klingonLocale);
  }
}
`;

const ASYNC_LOCALIZE_COMMON_STRINGS_EXAMPLE = `
@Injectable()
export class MyCommonStringsService implements ClrCommonStrings {
  constructor(
    @Inject(LOCALE_ID) locale: string,
    server: MyServer,
    commonStrings: ClrCommonStringsService
  ) {
    // Imagine this service loads a JSON object of strings for a locale
    server.fetchTexts(locale).subscribe(texts => {
      // Pass the new localization strings to the service
      commonStrings.localize(texts);
    });
  }
}
`;

const MIGRATE_STEP_1_EXAMPLE = `
@NgModule({
  providers: [{ provide: ClrCommonStrings, useClass: MyCommonStringsService }],
})
export class AppModule {}
`;

const MIGRATE_STEP_2_EXAMPLE = `
// Old class format
export class MyCommonStringsService implements ClrCommonStrings {
  open = 'ghIt';
  close = 'SoQmoH';
}

// New object format
export const klingonLocale: Partial<ClrCommonStrings> = {
  open: 'ghIt',
  close: 'SoQmoH',
};
`;

@Component({
  templateUrl: './i18n.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, CodeSnippetComponent, I18nDemoModule],
})
export class I18nDemo extends ClarityDocComponent {
  newLayout = true;

  klingonTranslationExample = KLINGON_TRANSLATION_EXAMPLE;
  localizeCommonStringsExample = LOCALIZE_COMMON_STRINGS_EXAMPLE;
  asyncLocalizeCommonStringsExample = ASYNC_LOCALIZE_COMMON_STRINGS_EXAMPLE;
  migrateStep1Example = MIGRATE_STEP_1_EXAMPLE;
  migrateStep2Example = MIGRATE_STEP_2_EXAMPLE;

  // List of the string keys and what they mean
  strings = [
    {
      key: 'open',
      role: 'Open button text',
    },
    {
      key: 'close',
      role: 'Close button text',
    },
    {
      key: 'show',
      role: 'Show button text',
    },
    {
      key: 'hide',
      role: 'Hide button text',
    },
    {
      key: 'expand',
      role: 'Expandable components: expand caret',
    },
    {
      key: 'collapse',
      role: 'Expandable components: collapse caret',
    },
    {
      key: 'more',
      role: 'Overflow menus: ellipsis button',
    },
    {
      key: 'select',
      role: 'Selectable components: checkbox or radio',
    },
    {
      key: 'selectAll',
      role: 'Selectable components: checkbox to select all',
    },
    {
      key: 'previous',
      role: 'Pagination: previous button',
    },
    {
      key: 'next',
      role: 'Pagination: next button',
    },
    {
      key: 'current',
      role: 'Pagination: go to current',
    },
    {
      key: 'info',
      role: 'Alert levels: info',
    },
    {
      key: 'success',
      role: 'Alert levels: success',
    },
    {
      key: 'warning',
      role: 'Alert levels: warning',
    },
    {
      key: 'danger',
      role: 'Alert levels: danger',
    },
    {
      key: 'rowActions',
      role: 'Datagrid: row actions icon alt text',
    },
    {
      key: 'pickColumns',
      role: 'Datagrid: show and hide columns icon alt text',
    },
    {
      key: 'showColumns',
      role: 'Datagrid: show columns title',
    },
    {
      key: 'sortColumn',
      role: 'Datagrid: sort columns title',
    },
    {
      key: 'firstPage',
      role: 'Datagrid: pagination first page button text',
    },
    {
      key: 'lastPage',
      role: 'Datagrid: pagination last page button text',
    },
    {
      key: 'nextPage',
      role: 'Datagrid: pagination next page button text',
    },
    {
      key: 'previousPage',
      role: 'Datagrid: pagination previous page button text',
    },
    {
      key: 'currentPage',
      role: 'Datagrid: pagination current page button text',
    },
    {
      key: 'totalPages',
      role: 'Datagrid: pagination total pages button text',
    },
    {
      key: 'filterItems',
      role: 'Datagrid: placeholder and aria-label for builtin filter inputs',
    },
    {
      key: 'minValue',
      role: 'Datagrid: minimum value (numeric filters)',
    },
    {
      key: 'maxValue',
      role: 'Datagrid: maximum value (numeric filters)',
    },
    {
      key: 'modalContentStart',
      role: 'Modal: screen reader text for start of modal',
    },
    {
      key: 'modalContentEnd',
      role: 'Modal: screen reader text for end of modal',
    },
    {
      key: 'showColumnsMenuDescription',
      role: 'Datagrid: screen reader only description of the Show/Hide columns menu',
    },
    {
      key: 'allColumnsSelected',
      role: 'Datagrid: screen reader only confirmation that all columns were selected',
    },
    {
      key: 'signpostToggle',
      role: 'Applies the aria-label value to the signpost trigger.',
    },
    {
      key: 'signpostClose',
      role: 'Applies the aria-label value to the signpost close button.',
    },
    {
      key: 'loading',
      role: 'Display loading text (Default: Loading)',
    },
    {
      key: 'detailPaneStart',
      role: 'Datagrid: screen reader text for start of detail pane',
    },
    {
      key: 'detailPaneEnd',
      role: 'Datagrid: screen reader text for end of detail pane',
    },
    {
      key: 'singleSelectionAriaLabel',
      role: 'Datagrid: aria label for header single selection header column',
    },
    {
      key: 'singleActionableAriaLabel',
      role: 'Datagrid: aria label for row action header column',
    },
    {
      key: 'detailExpandableAriaLabel',
      role: 'Datagrid: aria label for expandable row toggle button',
    },
    {
      key: 'datagridFilterAriaLabel',
      role: 'Datagrid: aria label for filter toggle button',
    },
    {
      key: 'datagridFilterDialogAriaLabel',
      role: 'Datagrid: aria label for filter dialog',
    },
    {
      key: 'columnSeparatorAriaLabel',
      role: 'Datagrid: aria label for column resize handle',
    },
    {
      key: 'columnSeparatorDescription',
      role: 'Datagrid: screen reader text for column resize handle',
    },
    {
      key: 'alertCloseButtonAriaLabel',
      role: 'Alert: aria label for closing alert',
    },
    {
      key: 'datepickerDialogLabel',
      role: 'aria-label for datepicker dialog',
    },
    {
      key: 'datepickerToggleChooseDateLabel',
      role: 'aria-label for datepicker dialog toggle button if no date selected',
    },
    {
      key: 'datepickerToggleChangeDateLabel',
      role: 'aria-label for datepicker dialog toggle button if date selected',
    },
    {
      key: 'datepickerPreviousMonth',
      role: 'The button that navigates daypicker to a monthpicker',
    },
    {
      key: 'datepickerCurrentMonth',
      role: 'The button that navigates a daypicker to current month',
    },
    {
      key: 'datepickerNextMonth',
      role: 'The button that navigates a daypicker to the next month',
    },
    {
      key: 'datepickerPreviousDecade',
      role: 'The button that navigates a yearpicker to previous decade',
    },
    {
      key: 'datepickerNextDecade',
      role: 'The button that navigates a yearpicker to next decade',
    },
    {
      key: 'datepickerCurrentDecade',
      role: 'The button that navigates the yearpicker to current decade',
    },
    {
      key: 'datepickerSelectMonthText',
      role: 'Populates aria-label and title for monthpicker button. Is concatenated with the (localized) value for calendarMonth as well as this value',
    },
    {
      key: 'datepickerSelectYearText',
      role: 'Populates aria-label and title for yearpicker button. Is concatenated with the (localized) value for calendarYear as well as this value',
    },
    {
      key: 'datepickerSelectedLabel',
      role: 'Populates aria-label for selected daypicker button. Is concatenated with the (localized) value for the selected date as well as this value',
    },
    {
      key: 'stackViewChanged',
      role: 'Stack View: describes a particular stack block has changed',
    },
    {
      key: 'responsiveNavToggleOpen',
      role: 'Header: aria-label for nav toggle trigger when menu is closed',
    },
    {
      key: 'responsiveNavToggleClose',
      role: 'Header: aria-label for nav toggle trigger when menu is open',
    },
    {
      key: 'responsiveNavOverflowOpen',
      role: 'Header: aria-label for overflow trigger when menu is closed',
    },
    {
      key: 'responsiveNavOverflowClose',
      role: 'Header: aria-label for overflow trigger when menu is open',
    },
    {
      key: 'verticalNavToggle',
      role: 'Applies expanded/collapsed state to an aria-expanded attribute for screen readers when vertical nav button  expands/collapses the entire menu',
    },
    {
      key: 'timelineStepNotStarted',
      role: 'Used in the aria-label for the not started step icon',
    },
    {
      key: 'timelineStepCurrent',
      role: 'Used in the aria-label for the current step icon',
    },
    {
      key: 'timelineStepSuccess',
      role: 'Used in the aria-label for the success step icon',
    },
    {
      key: 'timelineStepError',
      role: 'Used in the aria-label for the error step icon',
    },
    {
      key: 'timelineStepProcessing',
      role: 'Used in the aria-label for the processing step icon',
    },
    {
      key: 'comboboxDelete',
      role: 'Used in the aria-label the remove item button',
    },
    {
      key: 'comboboxSearching',
      role: 'Used in the text displayed when searching',
    },
    {
      key: 'comboboxSelection',
      role: 'Used in the aria-label for the list of selected items',
    },
    {
      key: 'comboboxSelected',
      role: 'Screen reader text for selected items',
    },
    {
      key: 'comboboxNoResults',
      role: 'Displayed when there are no results',
    },
    {
      key: 'comboboxOpen',
      role: 'aria-label for for the open button',
    },
    {
      key: 'datagridExpandableBeginningOf',
      role: 'Beginning of expandable row',
    },
    {
      key: 'datagridExpandableEndOf',
      role: 'End of expandable row',
    },
    {
      key: 'datagridExpandableRowContent',
      role: 'Describe expandable content region',
    },
    {
      key: 'datagridExpandableRowsHelperText',
      role: 'Provide helper text related to expandable rows Accessibility limitation inside the Datagrid',
    },
    {
      key: 'wizardStepSuccess',
      role: 'Screen reader text for completed wizard steps with no error(s)',
    },
    {
      key: 'wizardStepError',
      role: 'Screen reader text for wizard steps with error(s)',
    },
    {
      key: 'passwordHide',
      role: 'Screen reader text for hide password button',
    },
    {
      key: 'passwordShow',
      role: 'Screen reader text for show password button',
    },
    {
      key: 'selectedRows',
      role: 'Screen reader text for number of selected datagrid rows in datagrid footer',
    },
  ].sort(({ key: key1 }, { key: key2 }) => key1.localeCompare(key2));

  constructor() {
    super('internationalization');
  }
}
