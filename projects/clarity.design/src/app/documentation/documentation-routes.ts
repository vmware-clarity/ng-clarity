/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Route, Routes, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { DocumentationComponent } from './documentation.component';

export const documentationRoutes: Routes = [
  {
    path: `documentation`,
    component: DocumentationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/pages/introduction',
      },
      {
        path: 'get-started',
        redirectTo: '/pages/introduction',
      },
      {
        path: 'support',
        redirectTo: '/pages/support-policies',
      },
      {
        path: 'updating',
        redirectTo: '/pages/updating',
      },
      {
        path: 'accordion/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/accordion/accordion.demo.module').then(m => m.AccordionDemoModule),
      },
      {
        path: 'alert/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/alert/alerts.demo.module').then(m => m.AlertsDemoModule),
      },
      {
        path: 'app-layout/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/app-layout/app-layout.demo.module').then(m => m.AppLayoutDemoModule),
      },
      {
        path: 'accessibility',
        redirectTo: '/pages/accessibility',
      },
      {
        path: 'badge/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/badges/badges.demo.module').then(m => m.BadgesDemoModule),
      },
      {
        path: 'breadcrumbs/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/breadcrumbs/breadcrumbs.demo.module').then(m => m.BreadcrumbsDemoModule),
      },
      {
        path: 'button/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/buttons/buttons.demo.module').then(m => m.ButtonsDemoModule),
      },
      {
        path: 'button-group/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/button-group/button-group.demo.module').then(m => m.ButtonGroupDemoModule),
      },
      {
        path: 'card/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/card/cards.demo.module').then(m => m.CardsDemoModule),
      },
      {
        path: 'charts/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/charts/charts.demo.module').then(m => m.ChartsDemoModule),
      },
      {
        path: 'checkbox/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/checkboxes/checkboxes.demo.module').then(m => m.CheckboxesDemoModule),
      },
      {
        path: 'color/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/color/color.demo.module').then(m => m.ColorDemoModule),
      },
      {
        path: 'combobox/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/combobox/combobox.demo.module').then(m => m.ComboboxDemoModule),
      },
      {
        path: 'datagrid/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/datagrid/datagrid.demo.module').then(m => m.DatagridDemoModule),
      },
      {
        path: 'datalist/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/datalist/datalist.module').then(m => m.DatalistDemoModule),
      },
      {
        path: 'datepicker/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/datepicker/datepicker.demo.module').then(m => m.DatepickerDemoModule),
      },
      {
        path: 'date-range-picker/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/date-range-picker/date-range-picker.demo.module').then(m => m.DateRangePickerDemoModule),
      },
      {
        path: 'dropdown/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/dropdown/dropdown.demo.module').then(m => m.DropdownDemoModule),
      },
      {
        path: 'file-picker/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/file-picker/file-picker.demo.module').then(m => m.FilePickerDemoModule),
      },
      {
        path: 'forms/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/forms/forms.demo.module').then(m => m.FormsDemoModule),
      },
      {
        path: 'grid/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/grid/grid.demo.module').then(m => m.GridDemoModule),
      },
      {
        path: 'header/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/header/header.demo.module').then(m => m.HeaderDemoModule),
      },
      {
        path: 'icons/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/icons/icons.demo.module').then(m => m.IconsDemoModule),
      },
      {
        path: 'input/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/input/input.demo.module').then(m => m.InputDemoModule),
      },
      {
        path: 'internationalization/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/i18n/i18n.demo.module').then(m => m.I18nDemoModule),
      },
      {
        path: 'label/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/labels/labels.demo.module').then(m => m.LabelsDemoModule),
      },
      {
        path: 'list/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/lists/lists.demo.module').then(m => m.ListsDemoModule),
      },
      {
        path: 'login/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/login/login.demo.module').then(m => m.LoginDemoModule),
      },
      {
        path: 'modal/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/modal/modal.demo.module').then(m => m.ModalDemoModule),
      },
      {
        path: 'side-panel/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/side-panel/side-panel.demo.module').then(m => m.SidePanelDemoModule),
      },
      {
        path: 'multi-step-workflow/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/multi-step-workflow/multi-step-workflow.demo.module').then(
            m => m.MultiStepWorkflowDemoModule
          ),
      },
      {
        path: 'navigation/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/nav/nav.demo.module').then(m => m.NavDemoModule),
      },
      {
        path: 'onboarding/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/onboarding/onboarding.demo.module').then(m => m.OnboardingDemoModule),
      },
      {
        path: 'notifications/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/notifications/notifications.demo.module').then(m => m.NotificationsDemoModule),
      },
      {
        path: 'password/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/password/password.demo.module').then(m => m.PasswordDemoModule),
      },
      {
        path: 'progress/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/progress-bars/progress-bars.demo.module').then(m => m.ProgressBarsDemoModule),
      },
      {
        path: 'radio/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/radio/radio.demo.module').then(m => m.RadioDemoModule),
      },
      {
        path: 'range/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/range/range.module').then(m => m.RangeDemoModule),
      },
      {
        path: 'select/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/select/select.demo.module').then(m => m.SelectDemoModule),
      },
      {
        path: 'signpost/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/signposts/signpost.demo.module').then(m => m.SignpostDemoModule),
      },
      {
        path: 'spacing/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/spacing/spacing.demo.module').then(m => m.SpacingDemoModule),
      },
      {
        path: 'spinner/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/spinners/spinners.demo.module').then(m => m.SpinnersDemoModule),
      },
      {
        path: 'stack-view/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/stack-view/stack-view.demo.module').then(m => m.StackViewDemoModule),
      },
      {
        path: 'stepper/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/stepper/stepper.demo.module').then(m => m.StepperDemoModule),
      },
      {
        path: 'table/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/tables/tables.demo.module').then(m => m.TablesDemoModule),
      },
      {
        path: 'tabs/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/tabs/tabs.demo.module').then(m => m.TabsDemoModule),
      },
      {
        path: 'textarea/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/textarea/textarea.demo.module').then(m => m.TextareaDemoModule),
      },
      {
        path: 'themes/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/themes/themes.demo.module').then(m => m.ThemesDemoModule),
      },
      {
        path: 'density/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/density/density.demo.module').then(m => m.DensityDemoModule),
      },
      {
        path: 'timeline/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/timeline/timeline.demo.module').then(m => m.TimelineDemoModule),
      },
      {
        path: 'toggle-switch/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/toggles/toggles.demo.module').then(m => m.TogglesDemoModule),
      },
      {
        path: 'tokens/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/tokens/tokens.demo.module').then(m => m.TokensDemoModule),
      },
      {
        path: 'tooltip/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/tooltips/tooltips.demo.module').then(m => m.TooltipsDemoModule),
      },
      {
        path: 'tree-view/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/tree-view/tree-view.demo.module').then(m => m.TreeDemoModule),
      },
      {
        path: 'typography/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/typography/typography.demo.module').then(m => m.TypographyDemoModule),
      },
      {
        path: 'vertical-nav/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/vertical-nav/vertical-nav.demo.module').then(m => m.VerticalNavDemoModule),
      },
      {
        path: 'wizard/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/wizard/wizard.demo.module').then(m => m.WizardDemoModule),
      },
      {
        path: 'a11y/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/a11y/a11y.demo.module').then(m => m.AccessibilityAddonDemoModule),
      },
      {
        path: 'advanced-datagrid/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/advanced-datagrid/advanced-datagrid.demo.module').then(m => m.AdvancedDatagridDemoModule),
      },
      {
        path: 'drag-and-drop/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () =>
          import('./demos/drag-and-drop/drag-and-drop.demo.module').then(m => m.DragAndDropDemoModule),
      },
      {
        path: 'translate/:tab?',
        matcher: documentationRouteMatcher,
        loadChildren: () => import('./demos/translate/translate.demo.module').then(m => m.TranslateAddonDemoModule),
      },
    ],
  },
];

function documentationRouteMatcher(
  urlSegments: UrlSegment[],
  segmentGroup: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  const pathParts = route.path?.split('/');
  const posParams: { [key: string]: UrlSegment } = {};
  const consumed: UrlSegment[] = [];

  for (const pathPart of pathParts || []) {
    const pathPartIsParam = pathPart.startsWith(':');
    const pathPartIsOptionalParam = pathPartIsParam && pathPart.endsWith('?');
    const paramName = pathPartIsParam ? /^:?(.+?)\??$/.exec(pathPart)?.[1] : null;
    const currentUrlSegment = urlSegments[consumed.length];

    // missing required param
    if (!currentUrlSegment && pathPartIsParam && !pathPartIsOptionalParam) {
      return null;
    }

    // mismatched literal
    if (!pathPartIsParam && pathPart !== currentUrlSegment.path) {
      return null;
    }

    // invalid param value
    if (currentUrlSegment && paramName && !urlSegmentMatchesParam(paramName, currentUrlSegment)) {
      return null;
    }

    // consume segment and add param
    if (currentUrlSegment) {
      consumed.push(currentUrlSegment);

      if (paramName) {
        posParams[paramName] = currentUrlSegment;
      }
    }
  }

  // incomplete match
  if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || consumed.length < urlSegments.length)) {
    return null;
  }

  return { consumed, posParams };
}

const tabs = ['overview', 'themes', 'usage', 'colors', 'code', 'api', 'accessibility', 'shapes', 'design'];

function urlSegmentMatchesParam(paramName: string, currentUrlSegment: UrlSegment) {
  switch (paramName) {
    case 'tab':
      return tabs.includes(currentUrlSegment.path);
    default:
      return true;
  }
}
