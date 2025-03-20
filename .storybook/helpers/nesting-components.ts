/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const baseComponentTemplates = {
  accordion: {
    description: `Nested Accordion component`,
    samples: `
<clr-accordion>
  <clr-accordion-panel [clrAccordionPanelOpen]="true">
    <clr-accordion-title>A11Y Rule: Short title</clr-accordion-title>
    <clr-accordion-content>
    A11Y Rules: <br />
    The Accordion header should include only a title and brief info (if needed). Clickable elements are not allowed.<br />
    Keep the Accordion Description short without any clickable elements or components.<br />
    Withing the Accordion Body you can nest components.<br />
    Accordions can be nested up to 2 levels</clr-accordion-content>
  </clr-accordion-panel>
  <clr-accordion-panel>
    <clr-accordion-title>Title</clr-accordion-title>
    <clr-accordion-content>Content</clr-accordion-content>
  </clr-accordion-panel>
  <clr-accordion-panel>
    <clr-accordion-title>Title</clr-accordion-title>
    <clr-accordion-description>Description</clr-accordion-description>
    <clr-accordion-content>Content</clr-accordion-content>
  </clr-accordion-panel>
</clr-accordion>`,
  },
  alert: {
    description: `Nested standard alert`,
    samples: `<clr-alert><clr-alert-item><span class="alert-text">Standard Alert text</span></clr-alert-item></clr-alert>`,
  },
  badge: `<span class="badge badge-info">2</span>`,
  button: {
    description: `You can nest all type of buttons`,
    samples: `
  <button class="btn">Default</button>
  <button class="btn btn-primary">Solid Button</button>
  <button class="btn outline">Outline Buttons</button>`,
  },
  'button-group': `
<clr-button-group>
  <clr-button><cds-icon shape="home"></cds-icon>Button 1</clr-button>
  <clr-button><cds-icon shape="home"></cds-icon>Button 2</clr-button>
</clr-button-group>`,
  card: `
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
  checkbox: `
<clr-checkbox-container>
  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox value="option1"/>
    <label>Option 1</label>
  </clr-checkbox-wrapper>
  <clr-checkbox-wrapper>
    <input type="checkbox" clrCheckbox value="option2"/>
    <label>Option 2</label>
  </clr-checkbox-wrapper>
</clr-checkbox-container>`,
  combobox: `
<clr-combobox-container>
  <clr-combobox>
    <clr-options>
      <clr-option clrValue="1">1</clr-option>
      <clr-option clrValue="2">2</clr-option>
      <clr-option clrValue="3">3</clr-option>
    </clr-options>
  </clr-combobox>
</clr-combobox-container>`,
  datagrid: `
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
  datalist: `
<clr-datalist-container>
  <input clrDatalistInput placeholder="Option" autocomplete="off" />
  <datalist>
    <option [value]="'1'"></option>
    <option [value]="'2'"></option>
    <option [value]="'3'"></option>
  </datalist>
</clr-datalist-container>`,
  'date-picker': `
<clr-date-container>
  <input type="date" autocomplete="off" clrDate required />
</clr-date-container>`,
  dropdown: `
<clr-dropdown>
  <button class="btn btn-outline-primary" clrDropdownTrigger>
    Dropdown
    <cds-icon shape="angle" direction="down"></cds-icon>
  </button>
  <clr-dropdown-menu>
    <div aria-label="Action 1" clrDropdownItem>Action 1</div>
    <div aria-label="Action 2" clrDropdownItem>Action 2</div>
    <div aria-label="Action 3" clrDropdownItem>Action 3</div>
  </clr-dropdown-menu>
</clr-dropdown>
`,
  'file-picker': `
<clr-file-input-container>
  <input type="file" multiple clrFileInput />
</clr-file-input-container>`,
  header: `
<clr-main-container>
  <clr-header>
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <div class="header-nav">
      <a href="javascript://" class="nav-link nav-text">Home</a>
      <a href="javascript://" class="nav-link nav-text">About</a>
      <a href="javascript://" class="nav-link nav-text">Services</a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link">
        <cds-icon shape="cog"></cds-icon>
      </a>
    </div>
  </clr-header>
</clr-main-container>`,
  icon: `<cds-icon shape="bell" title="bell" badge="none"></cds-icon>`,
  input: `
<clr-input-container>
  <input clrInput type="text" required />
</clr-input-container>`,
  label: `<span class="label">Admin</span>`,
  list: `
<ul class="list">
  <li>Chicken Breast</li>
  <li>Flour</li>
  <li>Garlic</li>
  <li>Honey</li>
</ul>`,
  login: `Login Page SHOULD not be nested anywhere.`,
  modal: `
<button class="btn btn-primary" (click)="modal.open()">Open Modal</button>
<clr-modal #modal >
  <h3 class="modal-title">I have a nice title</h3>
  <div class="modal-body">
    <p>But not much to say...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="modal.close()">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="modal.close()">Ok</button>
  </div>
</clr-modal>
    `,
  password: `
<clr-password-container>
  <input clrPassword autocomplete="current-password" required />
</clr-password-container>`,
  'progress-bar': `<clr-progress-bar clrValue="40" clrMax="100"></clr-progress-bar>`,
  radio: `
<clr-radio-container>
  <clr-radio-wrapper>
    <input type="radio" clrRadio value="option1"/>
    <label>Option 1</label>
  </clr-radio-wrapper>
  <clr-radio-wrapper>
    <input type="radio" clrRadio value="option2"/>
    <label>Option 2</label>
  </clr-radio-wrapper>
</clr-radio-container>`,
  range: `
<clr-range-container>
  <input type="range" clrRange required />
</clr-range-container>`,
  select: `
<clr-select-container>
  <select clrSelect required>
    <option value="one">One</option>
    <option value="two">Two</option>
    <option value="three">Three</option>
  </select>
</clr-select-container>`,
  'side-panel': `
<button class="btn btn-primary" (click)="sidePanel.open()">Open Side panel</button>
<clr-side-panel #sidePanel [clrSidePanelStaticBackdrop]="true">
  <h3 class="side-panel-title">I have a nice title</h3>
  <div class="side-panel-body">
    <p>But not much to say...</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-outline" (click)="sidePanel.close()">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="sidePanel.close()">Ok</button>
  </div>
</clr-side-panel>
    `,
  signpost: `
<clr-signpost>
  <clr-signpost-content *clrIfOpen>
    Default Signpost Position: right-middle
  </clr-signpost-content>
</clr-signpost>`,
  spinner: `<clr-spinner clrInline></clr-spinner><span>Downloading</span>`,
  'stack-view': `
<clr-stack-view>
  <clr-stack-header>Angular stack view</clr-stack-header>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 1</clr-stack-label>
    <clr-stack-content>Content 1</clr-stack-content>
  </clr-stack-block>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 2</clr-stack-label>
    <clr-stack-content>Content 2</clr-stack-content>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 1</clr-stack-label>
      <clr-stack-content>Sub-content 1</clr-stack-content>
    </clr-stack-block>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 2</clr-stack-label>
      <clr-stack-content>Sub-content 2</clr-stack-content>
    </clr-stack-block>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 3</clr-stack-label>
      <clr-stack-content>Sub-content 3</clr-stack-content>
    </clr-stack-block>
  </clr-stack-block>
</clr-stack-view>`,
  stepper: `
<form clrStepper [formGroup]="form">
  <clr-stepper-panel formGroupName="step1">
    <clr-step-title>Legal Name</clr-step-title>
    <clr-step-description>Description goes here.</clr-step-description>
    <clr-step-content>
      <clr-input-container>
        <label>First Name</label>
        <input clrInput formControlName="value" required/>
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
  table: `
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
</div>`,
  tabs: `
<clr-tabs>
  <clr-tab>
    <button clrTabLink>Dashboard</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">
        Content for Dashboard tab. Here is a
        <a href="javascript://">link</a>
        that can be accessed via clicking or through keyboard via tabbing.
      </p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Management</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Management tab.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Cloud</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Cloud tab.</p>
    </clr-tab-content>
  </clr-tab>
</clr-tabs>`,
  textarea: `
<clr-textarea-container>
  <textarea clrTextarea required></textarea>
</clr-textarea-container>`,
  toggle: `
<clr-toggle-container>
  <clr-toggle-wrapper>
    <input type="checkbox" clrToggle required value="option1" />
    <label>Option 1</label>
  </clr-toggle-wrapper>
  <clr-toggle-wrapper>
    <input type="checkbox" clrToggle required value="option2" />
    <label>Option 2</label>
  </clr-toggle-wrapper>
</clr-toggle-container>`,
  tooltip: `
<clr-tooltip>
  <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
  <clr-tooltip-content [clrPosition]="'top-right'" [clrSize]="'sm'">
    This is a basic tooltip
  </clr-tooltip-content>
</clr-tooltip>`,
  timeline: `
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
</clr-timeline>`,
  'tree-view': `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    A
    <clr-tree-node>A-1</clr-tree-node>
    <clr-tree-node [clrExpanded]="true">
      A-2
      <clr-tree-node>A-2.1</clr-tree-node>
      <clr-tree-node>A-2.2</clr-tree-node>
      <clr-tree-node>A-2.3</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node>A-3</clr-tree-node>
  </clr-tree-node>
</clr-tree>`,
  'vertical-nav': `
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
  wizard: `
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
};

export function renderNestedComponent(nestedComponentNames: string[]): string {
  return nestedComponentNames
    .map(name => {
      if (baseComponentTemplates[name]?.description) {
        return `<div><h5>${baseComponentTemplates[name].description}</h5>${baseComponentTemplates[name].samples}</div>`;
      }
      return `<div><h5>${name}</h5>${baseComponentTemplates[name]}</div>`;
    })
    .join('<hr/>');
}
