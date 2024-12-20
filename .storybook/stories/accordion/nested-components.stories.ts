/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { nestingComponents } from '../../helpers/nesting-components';

export default {
  title: 'Accordion/Nested Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule],
    }),
  ],
  args: {
    // story helpers
    variableLengthUsers: [
      {
        id: 1,
        name: 'John',
        color: 'green',
      },
      {
        id: 2,
        name: 'Jack',
        color: 'blue',
      },
    ],
    openWizard: false,
  },
};

const template = `
  <clr-accordion>
    <clr-accordion-panel [clrAccordionPanelOpen]="true">
      <clr-accordion-title>Parent Title</clr-accordion-title>
      <clr-accordion-content>
        ${nestingComponents.map(a => a.template).join('')}
        <div class="clr-example nomargin">
          <div class="clr-row">
            <div class="clr-col-lg-5 clr-col-md-8 clr-col-12">
              <div class="card">
                <h3 class="card-header">Header</h3>
                <div class="card-block">
                  <h4 class="card-title">Block</h4>
                  <div class="card-text">
                    Card content can contain text, links, images, data visualizations, lists and more.
                  </div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-sm btn-link">Footer Action 1</button>
                  <button class="btn btn-sm btn-link">Footer Action 2</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox />
          <label>Yes?</label>
        </clr-checkbox-wrapper>
        <clr-combobox name="one" required [disabled]="disabled" aria-label="one" class="foo">
          <clr-options>
            <clr-option clrValue="1" id="custom-id-1">1</clr-option>
            <clr-option clrValue="2">2</clr-option>
            <clr-option clrValue="3">3</clr-option>
          </clr-options>
        </clr-combobox>
        <clr-datagrid id="basic-custom-cell">
          <clr-dg-column>User ID</clr-dg-column>
          <clr-dg-column>Name</clr-dg-column>
          <clr-dg-column>Favorite color</clr-dg-column>
          <clr-dg-row *ngFor="let user of variableLengthUsers">
            <clr-dg-cell>{{ user.id }}</clr-dg-cell>
            <clr-dg-cell>{{ user.name }}</clr-dg-cell>
            <clr-dg-cell>
              <span class="color-square" [style.backgroundColor]="user.color"></span>
            </clr-dg-cell>
          </clr-dg-row>
          <clr-dg-footer>3 users</clr-dg-footer>
        </clr-datagrid>
        <clr-datalist-container>
          <label>Datalist</label>
          <input clrDatalistInput placeholder="Option" name="Option" autocomplete="off" />
          <datalist id="clr-custom-datalistid-1">
            <option [value]="'1'"></option>
            <option [value]="'2'"></option>
            <option [value]="'3'"></option>
          </datalist>
        </clr-datalist-container>
        <div>
          <h6>[(clrDate)]</h6>
          <p></p>
          <input type="date" autocomplete="off" [(clrDate)]="date" />
        </div>
        <div class="clr-row">
          <div class="clr-col-12 clr-col-md-10 clr-col-lg-5">
            <table class="table">
              <thead>
                <tr>
                  <th>[(clrDate)]</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--          <div>-->
        <!--            <div class="dropdown open">-->
        <!--              <button class="dropdown-toggle btn btn-link">-->
        <!--                Dropdown Toggle-->
        <!--                <cds-icon shape="angle" direction="down"></cds-icon>-->
        <!--              </button>-->
        <!--              <div class="dropdown-menu">-->
        <!--                <h4 class="dropdown-header" aria-hidden="true">Dropdown header</h4>-->
        <!--                <a aria-label="Dropdown header Lorem" href="javascript://" class="dropdown-item">Lorem.</a>-->
        <!--                <a aria-label="Dropdown header Lorem ipsum" href="javascript://" class="dropdown-item">Lorem ipsum.</a>-->
        <!--                <a aria-label="Dropdown header Lorem ipsum dolor" href="javascript://" class="dropdown-item">-->
        <!--                  Lorem ipsum dolor.-->
        <!--                </a>-->
        <!--                <div class="dropdown-divider" role="separator" aria-hidden="true"></div>-->
        <!--                <a href="javascript://" class="dropdown-item">Link</a>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <clr-file-input-container>Alert</clr-file-input-container>-->
        <cds-icon shape="bell" title="bell" badge="none"></cds-icon>
        <br />
        <clr-input-container>
          <input clrInput placeholder="No label, wrapper" name="two" />
        </clr-input-container>
        <br />
        <span class="label">Admin</span>
        <!--          <clr-list>Alert</clr-list>-->
        <!--          <clr-modal>Alert</clr-modal>-->
        <!--          <clr-password-container>Alert</clr-password-container>-->
        <!--          <clr-progress-bar>Alert</clr-progress-bar>-->
        <!--          <clr-radio-container>Alert</clr-radio-container>-->
        <!--          <clr-range-containerAlert</clr-range-container>-->
        <!--          <clr-select-container>Alert</clr-select-container>-->
        <!--          <clr-signpost>Alert</clr-radio-container>-->
        <br />
        <span class="spinner spinner-sm">Loading...</span>
        <br />

        <div class="clr-row">
          <div class="clr-col-12 clr-col-lg-10 clr-col-xl-8">
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
        <clr-textarea-container>
          <label>Textarea</label>
          <textarea clrTextarea name="two" required></textarea>
          <clr-control-helper>Helper text</clr-control-helper>
        </clr-textarea-container>
        <ul class="clr-timeline">
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header">11:59 am</div>
            <cds-icon shape="circle" aria-label="Not started"></cds-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Add KMS</span>
              <span class="clr-timeline-step-description">Root CA certificate requested.</span>
            </div>
          </li>
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header">11:59 am</div>
            <cds-icon shape="dot-circle" status="info" aria-current="true" aria-label="Current"></cds-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Add KMS</span>
              <span class="clr-timeline-step-description">
                Root CA certificate requested. Upload it to the KMS to complete the connection.
                <button class="btn btn-sm">Action</button>
              </span>
            </div>
          </li>
          <li class="clr-timeline-step gemini-ignore">
            <div class="clr-timeline-step-header">11:59 am</div>
            <clr-spinner clrMedium aria-label="In progress">Fetching data</clr-spinner>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Make vCenter trust KMS</span>
              <span class="clr-timeline-step-description">
                Root CA certificate requested. Upload it to the KMS to complete the connection. Third sentence is very
                long and very long.
              </span>
            </div>
          </li>
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header">11:59 am</div>
            <cds-icon status="success" shape="success-standard" aria-label="Completed"></cds-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Make KMS trust vCenter</span>
              <span class="clr-timeline-step-description">
                Upload it to the KMS to complete the connection. Third sentence.
                <button class="btn btn-sm btn-link">Action</button>
              </span>
            </div>
          </li>
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header">11:59 am</div>
            <cds-icon status="danger" shape="error-standard" aria-label="Error"></cds-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Connected</span>
              <span class="clr-timeline-step-description">No. It's not connected.</span>
            </div>
          </li>
        </ul>
        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle />
          <label>Toggle</label>
        </clr-toggle-wrapper>
        <div class="clr-example squeeze example-center">
          <span role="tooltip" aria-haspopup="true" class="tooltip tooltip-sm">
            <input type="text" placeholder="I have a top-left tooltip" style="width: 300px" />
            <span class="tooltip-content">Warning!</span>
          </span>
        </div>
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
        </clr-tree>
        <button class="btn btn-primary" (click)="wizard.open()">Open Wizard</button>
        <clr-wizard #wizard [clrWizardSize]="fullScreen ? 'full-screen' : 'xl'" [(clrWizardOpen)]="openWizard">
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
        </clr-wizard>
      </clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

const NestedComponentsTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const NestedComponents: StoryObj = {
  render: NestedComponentsTemplate,
};
