/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
        matcher: documentationRouteMatcher,
        data: { routePath: 'accordion/:tab?' },
        loadChildren: () => import('./demos/accordion/accordion.demo.module').then(m => m.AccordionDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'alert/:tab?' },
        loadChildren: () => import('./demos/alert/alerts.demo.module').then(m => m.AlertsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'app-layout/:tab?' },
        loadChildren: () => import('./demos/app-layout/app-layout.demo.module').then(m => m.AppLayoutDemoModule),
      },
      {
        path: 'accessibility',
        redirectTo: '/pages/accessibility',
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'badge/:tab?' },
        loadChildren: () => import('./demos/badges/badges.demo.module').then(m => m.BadgesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'breadcrumbs/:tab?' },
        loadChildren: () => import('./demos/breadcrumbs/breadcrumbs.demo.module').then(m => m.BreadcrumbsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'button/:tab?' },
        loadChildren: () => import('./demos/buttons/buttons.demo.module').then(m => m.ButtonsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'button-group/:tab?' },
        loadChildren: () => import('./demos/button-group/button-group.demo.module').then(m => m.ButtonGroupDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'card/:tab?' },
        loadChildren: () => import('./demos/card/cards.demo.module').then(m => m.CardsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'charts/:tab?' },
        loadChildren: () => import('./demos/charts/charts.demo.module').then(m => m.ChartsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'checkbox/:tab?' },
        loadChildren: () => import('./demos/checkboxes/checkboxes.demo.module').then(m => m.CheckboxesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'color/:tab?' },
        loadChildren: () => import('./demos/color/color.demo.module').then(m => m.ColorDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'combobox/:tab?' },
        loadChildren: () => import('./demos/combobox/combobox.demo.module').then(m => m.ComboboxDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'datagrid/:tab?' },
        loadChildren: () => import('./demos/datagrid/datagrid.demo.module').then(m => m.DatagridDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'datalist/:tab?' },
        loadChildren: () => import('./demos/datalist/datalist.module').then(m => m.DatalistDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'datepicker/:tab?' },
        loadChildren: () => import('./demos/datepicker/datepicker.demo.module').then(m => m.DatepickerDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'date-range-picker/:tab?' },
        loadChildren: () =>
          import('./demos/date-range-picker/date-range-picker.demo.module').then(m => m.DateRangePickerDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'divider/:tab?' },
        loadChildren: () => import('./demos/divider/divider.demo.module').then(m => m.DividerDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'dropdown/:tab?' },
        loadChildren: () => import('./demos/dropdown/dropdown.demo.module').then(m => m.DropdownDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'file-picker/:tab?' },
        loadChildren: () => import('./demos/file-picker/file-picker.demo.module').then(m => m.FilePickerDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'forms/:tab?' },
        loadChildren: () => import('./demos/forms/forms.demo.module').then(m => m.FormsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'grid/:tab?' },
        loadChildren: () => import('./demos/grid/grid.demo.module').then(m => m.GridDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'header/:tab?' },
        loadChildren: () => import('./demos/header/header.demo.module').then(m => m.HeaderDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'icons/:tab?' },
        loadChildren: () => import('./demos/icons/icons.demo.module').then(m => m.IconsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'input/:tab?' },
        loadChildren: () => import('./demos/input/input.demo.module').then(m => m.InputDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'internationalization/:tab?' },
        loadChildren: () => import('./demos/i18n/i18n.demo.module').then(m => m.I18nDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'layout-utilities/:tab?' },
        loadChildren: () =>
          import('./demos/layout-utilities/layout-utilities.demo.module').then(m => m.LayoutUtilitiesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'label/:tab?' },
        loadChildren: () => import('./demos/labels/labels.demo.module').then(m => m.LabelsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'list/:tab?' },
        loadChildren: () => import('./demos/lists/lists.demo.module').then(m => m.ListsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'login/:tab?' },
        loadChildren: () => import('./demos/login/login.demo.module').then(m => m.LoginDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'modal/:tab?' },
        loadChildren: () => import('./demos/modal/modal.demo.module').then(m => m.ModalDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'side-panel/:tab?' },
        loadChildren: () => import('./demos/side-panel/side-panel.demo.module').then(m => m.SidePanelDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'multi-step-workflow/:tab?' },
        loadChildren: () =>
          import('./demos/multi-step-workflow/multi-step-workflow.demo.module').then(
            m => m.MultiStepWorkflowDemoModule
          ),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'navigation/:tab?' },
        loadChildren: () => import('./demos/nav/nav.demo.module').then(m => m.NavDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'onboarding/:tab?' },
        loadChildren: () => import('./demos/onboarding/onboarding.demo.module').then(m => m.OnboardingDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'notifications/:tab?' },
        loadChildren: () =>
          import('./demos/notifications/notifications.demo.module').then(m => m.NotificationsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'password/:tab?' },
        loadChildren: () => import('./demos/password/password.demo.module').then(m => m.PasswordDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'popover/:tab?' },
        loadChildren: () => import('./demos/popover/popover.demo.module').then(m => m.PopoverDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'progress/:tab?' },
        loadChildren: () =>
          import('./demos/progress-bars/progress-bars.demo.module').then(m => m.ProgressBarsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'radio/:tab?' },
        loadChildren: () => import('./demos/radio/radio.demo.module').then(m => m.RadioDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'range/:tab?' },
        loadChildren: () => import('./demos/range/range.module').then(m => m.RangeDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'select/:tab?' },
        loadChildren: () => import('./demos/select/select.demo.module').then(m => m.SelectDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'signpost/:tab?' },
        loadChildren: () => import('./demos/signposts/signpost.demo.module').then(m => m.SignpostDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'spacing/:tab?' },
        loadChildren: () => import('./demos/spacing/spacing.demo.module').then(m => m.SpacingDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'spinner/:tab?' },
        loadChildren: () => import('./demos/spinners/spinners.demo.module').then(m => m.SpinnersDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'stack-view/:tab?' },
        loadChildren: () => import('./demos/stack-view/stack-view.demo.module').then(m => m.StackViewDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'stepper/:tab?' },
        loadChildren: () => import('./demos/stepper/stepper.demo.module').then(m => m.StepperDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'table/:tab?' },
        loadChildren: () => import('./demos/tables/tables.demo.module').then(m => m.TablesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'tabs/:tab?' },
        loadChildren: () => import('./demos/tabs/tabs.demo.module').then(m => m.TabsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'textarea/:tab?' },
        loadChildren: () => import('./demos/textarea/textarea.demo.module').then(m => m.TextareaDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'themes/:tab?' },
        loadChildren: () => import('./demos/themes/themes.demo.module').then(m => m.ThemesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'density/:tab?' },
        loadChildren: () => import('./demos/density/density.demo.module').then(m => m.DensityDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'timeline/:tab?' },
        loadChildren: () => import('./demos/timeline/timeline.demo.module').then(m => m.TimelineDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'toggle-switch/:tab?' },
        loadChildren: () => import('./demos/toggles/toggles.demo.module').then(m => m.TogglesDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'tokens/:tab?' },
        loadChildren: () => import('./demos/tokens/tokens.demo.module').then(m => m.TokensDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'tooltip/:tab?' },
        loadChildren: () => import('./demos/tooltips/tooltips.demo.module').then(m => m.TooltipsDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'tree-view/:tab?' },
        loadChildren: () => import('./demos/tree-view/tree-view.demo.module').then(m => m.TreeDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'typography/:tab?' },
        loadChildren: () => import('./demos/typography/typography.demo.module').then(m => m.TypographyDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'vertical-nav/:tab?' },
        loadChildren: () => import('./demos/vertical-nav/vertical-nav.demo.module').then(m => m.VerticalNavDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'wizard/:tab?' },
        loadChildren: () => import('./demos/wizard/wizard.demo.module').then(m => m.WizardDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'a11y/:tab?' },
        loadChildren: () => import('./demos/a11y/a11y.demo.module').then(m => m.AccessibilityAddonDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'advanced-datagrid/:tab?' },
        loadChildren: () =>
          import('./demos/advanced-datagrid/advanced-datagrid.demo.module').then(m => m.AdvancedDatagridDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'drag-and-drop/:tab?' },
        loadChildren: () =>
          import('./demos/drag-and-drop/drag-and-drop.demo.module').then(m => m.DragAndDropDemoModule),
      },
      {
        matcher: documentationRouteMatcher,
        data: { routePath: 'translate/:tab?' },
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
  const routePath = (route.data as any)?.routePath ?? route.path;
  const pathParts = routePath?.split('/');
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
