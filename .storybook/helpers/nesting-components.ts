/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface Component {
  name: string;
  template: string;
}

export const nestingComponents: Component[] = [
  {
    name: 'accordion',
    template: `
<clr-accordion>
  <clr-accordion-panel [clrAccordionPanelOpen]="true">
    <clr-accordion-title>Nested Title</clr-accordion-title>
    <clr-accordion-content>Nested content</clr-accordion-content>
  </clr-accordion-panel>
</clr-accordion>`,
  },
  {
    name: 'alert',
    template: `<clr-alert><clr-alert-item><span class="alert-text">Alert text</span></clr-alert-item></clr-alert>`,
  },
  {
    name: 'badge',
    template: `<span class="badge badge-info">2</span>`,
  },
  {
    name: 'button',
    template: `<button class="btn">Default</button>`,
  },
  {
    name: 'button-group',
    template: `
<clr-button-group>
  <clr-button><cds-icon shape="home"></cds-icon>Button 1</clr-button>
  <clr-button><cds-icon shape="home"></cds-icon>Button 2</clr-button>
</clr-button-group>`,
  },
  {
    name: 'card',
    template: `
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-block">
    <div class="card-title">Block</div>
    <div class="card-text">
      Card content can contain text, links, images, data visualizations, lists and more.
    </div>
  </div>
  <div class="card-footer">
    <button class="btn btn-sm btn-link">Footer Action 1</button>
    <button class="btn btn-sm btn-link">Footer Action 2</button>
  </div>
</div>
`,
  },
  {
    name: 'checkbox',
    template: `
<clr-checkbox-container>
  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox value="option1" name="options1"/>
    <label>Option 1</label>
  </clr-checkbox-wrapper>
</clr-checkbox-container>`,
  },
  {
    name: 'combobox',
    template: `
<clr-combobox name="one" required aria-label="one" class="foo">
  <clr-options>
    <clr-option clrValue="1" id="custom-id-1">1</clr-option>
    <clr-option clrValue="2">2</clr-option>
    <clr-option clrValue="3">3</clr-option>
  </clr-options>
</clr-combobox>`,
  },
  {
    name: 'datagrid',
    template: `
<clr-datagrid>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>First Name</clr-dg-column>
  <clr-dg-column>Family Name</clr-dg-column>
  <clr-dg-row>
    <clr-dg-cell>1</clr-dg-cell>
    <clr-dg-cell>John</clr-dg-cell>
    <clr-dg-cell>Smith</clr-dg-cell>
  </clr-dg-row>
  <clr-dg-row>
    <clr-dg-cell>2</clr-dg-cell>
    <clr-dg-cell>Jack</clr-dg-cell>
    <clr-dg-cell>Jones</clr-dg-cell>
  </clr-dg-row>
  <clr-dg-footer>2 users</clr-dg-footer>
</clr-datagrid>`,
  },
  {
    name: 'datalist',
    template: `
<clr-datalist-container>
  <label>Datalist</label>
  <input clrDatalistInput placeholder="Option" name="Option" autocomplete="off" />
  <datalist id="clr-custom-datalistid-1">
    <option [value]="'1'"></option>
    <option [value]="'2'"></option>
    <option [value]="'3'"></option>
  </datalist>
</clr-datalist-container>`,
  },
  {
    name: 'date-picker',
    template: ``,
  },
  {
    name: 'dropdown',
    template: ``,
  },
  {
    name: 'file-picker',
    template: ``,
  },
  {
    name: 'header',
    template: ``,
  },
  {
    name: 'icon',
    template: `<cds-icon shape="bell" title="bell" badge="none"></cds-icon>`,
  },
  {
    name: 'input',
    template: ``,
  },
  {
    name: 'label',
    template: `<span class="label">Admin</span>`,
  },
  {
    name: 'list',
    template: ``,
  },
  {
    name: 'modal',
    template: ``,
  },
  {
    name: 'password',
    template: ``,
  },
  {
    name: 'progress-bar',
    template: ``,
  },
  {
    name: 'radio',
    template: ``,
  },
  {
    name: 'range',
    template: ``,
  },
  {
    name: 'select',
    template: ``,
  },
  {
    name: 'side-panel',
    template: ``,
  },
  {
    name: 'signpost',
    template: ``,
  },

  {
    name: 'spinner',
    template: `<clr-spinner clrInline></clr-spinner><span>Downloading</span>`,
  },
  {
    name: 'stack-view',
    template: ``,
  },
  {
    // stepper depends on form creation function in the story. Check accordion nesting for more info.
    name: 'stepper',
    template: `
<form clrStepper [formGroup]="form">
  <clr-stepper-panel formGroupName="step1">
    <clr-step-title>Legal Name</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content>
      <clr-input-container>
        <label>First Name</label>
        <input clrInput formControlName="value" />
      </clr-input-container>

      <button clrStepButton="next">next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel formGroupName="step2">
    <clr-step-title>Contact Information</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content>
      <clr-input-container>
        <label>Email</label>
        <input clrInput formControlName="value" />
      </clr-input-container>

      <button clrStepButton="submit">submit</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>`,
  },
  {
    name: 'table',
    template: `
<div class="clr-row">
  <div class="clr-col-12">
    <table class="table">
      <thead>
        <tr>
          <th class="left">Name</th>
          <th class="hidden-xs-down">A/B</th>
          <th class="left">Comment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left">Beetlejuice</td>
          <td class="hidden-xs-down">B</td>
          <td class="left">Lorem</td>
        </tr>
        <tr>
          <td class="left">Mytzlplk</td>
          <td class="hidden-xs-down">A</td>
          <td class="left">Excepteur sint occaecat cupidatat non proident.</td>
        </tr>
        <tr>
          <td class="left">Q</td>
          <td class="hidden-xs-down">A</td>
          <td class="left">Lorem</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },
  {
    name: 'toggle',
    template: `
<clr-toggle-wrapper>
  <input type="checkbox" clrToggle />
  <label>Toggle</label>
</clr-toggle-wrapper>`,
  },
  {
    name: 'tabs',
    template: ``,
  },
  {
    name: 'textarea',
    template: ``,
  },
  {
    name: 'toggle',
    template: ``,
  },
  {
    name: 'tooltip',
    template: `
<clr-tooltip>
  <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
  <clr-tooltip-content [clrPosition]="'top-right'" [clrSize]="'sm'">
    This is a basic tooltip
  </clr-tooltip-content>
</clr-tooltip>`,
  },
  {
    name: 'timeline',
    template: `
<clr-timeline [clrLayout]="'horizontal'">
  <clr-timeline-step [clrState]="'success'">
    <clr-timeline-step-header>1:00 pm</clr-timeline-step-header>
    <clr-timeline-step-title>Success</clr-timeline-step-title>
    <clr-timeline-step-description>This is step was successful.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="'error'">
    <clr-timeline-step-header>2:00 pm</clr-timeline-step-header>
    <clr-timeline-step-title>Error</clr-timeline-step-title>
    <clr-timeline-step-description>There was an error on this step.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="'processing'">
    <clr-timeline-step-header>3:00 pm</clr-timeline-step-header>
    <clr-timeline-step-title>Processing</clr-timeline-step-title>
    <clr-timeline-step-description>This step is being processed.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="'current'">
    <clr-timeline-step-header>4:00 pm</clr-timeline-step-header>
    <clr-timeline-step-title>Current</clr-timeline-step-title>
    <clr-timeline-step-description>This is the current step.</clr-timeline-step-description>
  </clr-timeline-step>
  <clr-timeline-step [clrState]="'not-started'">
    <clr-timeline-step-header>5:00 pm</clr-timeline-step-header>
    <clr-timeline-step-title>Not Started</clr-timeline-step-title>
    <clr-timeline-step-description>This step has not been started.</clr-timeline-step-description>
  </clr-timeline-step>
</clr-timeline>
    `,
  },
  {
    name: 'tree-view',
    template: `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    A
    <clr-tree-node [clrDisabled]="true">A-1</clr-tree-node>
    <clr-tree-node [clrExpanded]="true" [clrDisabled]="true">
      A-2
      <clr-tree-node [clrDisabled]="true">A-2.1</clr-tree-node>
      <clr-tree-node>A-2.2</clr-tree-node>
      <clr-tree-node>A-2.3</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node>A-3</clr-tree-node>
  </clr-tree-node>
</clr-tree>`,
  },

  {
    name: 'vertical-nav',
    template: `
<clr-vertical-nav [clrVerticalNavCollapsible]="true">
  <clr-vertical-nav-group [clrVerticalNavGroupExpanded]="true">
    <cds-icon shape="bars" clrVerticalNavIcon></cds-icon>
    Menu
    <clr-vertical-nav-group-children>
      <a clrVerticalNavLink class="active" href="javascript:void(0)">
        <cds-icon shape="bell" clrVerticalNavIcon></cds-icon>
        Notifications
      </a>
      <a clrVerticalNavLink href="javascript:void(0)">
        <cds-icon shape="home" clrVerticalNavIcon></cds-icon>
        Dashboard
      </a>
      <a clrVerticalNavLink href="javascript:void(0)">
        <cds-icon shape="search" clrVerticalNavIcon></cds-icon>
        Search
      </a>
      <a clrVerticalNavLink href="javascript:void(0)">
        <cds-icon shape="calendar" clrVerticalNavIcon></cds-icon>
        Calendar
      </a>
    </clr-vertical-nav-group-children>
  </clr-vertical-nav-group>
  </clr-vertical-nav>`,
  },
  {
    name: 'wizard',
    template: `
<button class="btn btn-primary" (click)="wizard.open()">Open Wizard</button>
<clr-wizard #wizard [clrWizardSize]="'xl'">
  <clr-wizard-title>Wizard Title</clr-wizard-title>
  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>
  <clr-wizard-page>
    <ng-template clrPageTitle>Title for page 1</ng-template>
    <ng-template clrPageNavTitle>Step 1</ng-template>
    <p class="content-for-page-1">Content for step 1</p>
  </clr-wizard-page>
  <clr-wizard-page>
    <ng-template clrPageTitle>Title for page 2</ng-template>
    <ng-template clrPageNavTitle>Step 2</ng-template>
    <p class="content-for-page-2">Content for step 2</p>
  </clr-wizard-page>
  <clr-wizard-page>
    <ng-template clrPageTitle>Title for page 3</ng-template>
    <ng-template clrPageNavTitle>Step 3</ng-template>
    <p class="content-for-page-3">Content for step 3</p>
  </clr-wizard-page>
</clr-wizard>`,
  },
];
