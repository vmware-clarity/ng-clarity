/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { renderNestedComponent } from '../../helpers/nesting-components';

const alertNestedComponentNames = ['label', 'badge', 'icon'];

const actionSample1 = `<clr-dropdown>
    <button class="dropdown-toggle" clrDropdownTrigger>
      Actions
      <cds-icon shape="angle" direction="down"></cds-icon>
    </button>
    <clr-dropdown-menu clrPosition="bottom-right">
      <a href="..." class="dropdown-item" clrDropdownItem>Shutdown</a>
      <a href="..." class="dropdown-item" clrDropdownItem>Delete</a>
      <a href="..." class="dropdown-item" clrDropdownItem>Reboot</a>
    </clr-dropdown-menu>
  </clr-dropdown>`;

const actionSample2 = `<a href="#top">Test Link</a>`;

const stepperFormGroup = new FormGroup({
  step1: new FormGroup({
    value: new FormControl(undefined),
  }),
  step2: new FormGroup({
    value: new FormControl(undefined),
  }),
});

export default {
  title: 'Alert/Nested Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule],
    }),
  ],
  argTypes: {
    // story helpers
    form: { control: { disable: true }, table: { disable: true }, mapping: { ['form-mapping-key']: stepperFormGroup } },
  },
  args: {
    // story helpers
    form: 'form-mapping-key',
  },
};

const nestedComponents = renderNestedComponent(alertNestedComponentNames, false, false);
const nestedComponentsActions1 = `<div class="alert-actions">${actionSample1}</div>`;
const nestedComponentsActions2 = `<div class="alert-actions">${actionSample2}</div>`;
const nestedComponentsActions3 = `<div class="alert-actions">${actionSample1} ${actionSample2}</div>`;
const alertTypes = `
    <clr-alert [clrAlertType]="'info'" [clrAlertAppLevel]="true" [clrAlertClosable]="false"><clr-alert-item><span class="alert-text">This is app level alert.</span></clr-alert-item></clr-alert>
    <hr />
    <clr-alert [clrAlertType]="'info'" [clrAlertAppLevel]="true" [clrAlertClosable]="false"><clr-alert-item><span class="alert-text">This is app level alert.</span>${nestedComponentsActions1}</clr-alert-item></clr-alert>
    <hr />
    <clr-alert [clrAlertAppLevel]="true"><clr-alert-item><span class="alert-text">This is app level alert.</span><div class="alert-actions"><button class="btn alert-action">Fix</button></div></clr-alert-item></clr-alert>
    <hr/>
    <clr-alert [clrAlertType]="'danger'" [clrAlertAppLevel]="true"><clr-alert-item><span class="alert-text">This is app level alert.</span><div class="alert-actions"><button class="btn alert-action">Fix</button></div></clr-alert-item></clr-alert>
    <hr/>
    <clr-alert [clrAlertType]="'success'" [clrAlertAppLevel]="true"><clr-alert-item><span class="alert-text">This is app level alert.</span><div class="alert-actions"><button class="btn alert-action">Fix</button></div></clr-alert-item></clr-alert>
    <hr/>
    <clr-alert [clrAlertType]="'warning'" [clrAlertAppLevel]="true"><clr-alert-item><span class="alert-text">This is app level alert.</span><div class="alert-actions"><button class="btn alert-action">Fix</button></div></clr-alert-item></clr-alert>
`;

const template = `
  ${alertTypes}
  <hr />
  <clr-alerts>${alertTypes}</clr-alerts>
  <hr />
  <clr-alert [clrAlertClosable]="false">
    <clr-alert-item><span class="alert-text">Standard alert text</span></clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertClosable]="false">
    <clr-alert-item>
      <span class="alert-text">
        Standard alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard
        Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long
        text, Standard Alert long text, Standard Alert long text, Standard Alert long text ${nestedComponents}
      </span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'success'">
    <clr-alert-item>
      <span class="alert-text">Success alert text ${nestedComponents}</span>
      ${nestedComponentsActions1}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'danger'">
    <clr-alert-item>
      <span class="alert-text">Danger alert text ${nestedComponents}</span>
      ${nestedComponentsActions2}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'warning'">
    <clr-alert-item>
      <span class="alert-text">Warning alert text ${nestedComponents}</span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <hr />
  <clr-alert [clrAlertClosable]="false" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Small standard alert text</span>
      ${nestedComponentsActions1}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'success'" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Small success alert text</span>
      ${nestedComponentsActions1}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'danger'" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Small danger alert text</span>
      ${nestedComponentsActions2}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertType]="'warning'" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Small warning alert text</span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <hr />
  <clr-alert [clrAlertLightweight]="true" [clrAlertClosable]="false" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Lightweight small standard alert text</span>
      ${nestedComponentsActions1}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'success'" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Lightweight small success alert text</span>
      ${nestedComponentsActions2}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'danger'" [clrAlertSizeSmall]="true">
    <clr-alert-item>
      <span class="alert-text">Lightweight small danger alert text</span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'warning'" [clrAlertSizeSmall]="true">
    <clr-alert-item><span class="alert-text">Lightweight small warning alert text</span></clr-alert-item>
  </clr-alert>
  <hr />
  <clr-alert [clrAlertLightweight]="true" [clrAlertClosable]="false">
    <clr-alert-item>
      <span class="alert-text">Lightweight alert text</span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'success'">
    <clr-alert-item>
      <span class="alert-text">Lightweight success alert text</span>
      ${nestedComponentsActions2}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'danger'">
    <clr-alert-item>
      <span class="alert-text">Lightweight danger alert text</span>
      ${nestedComponentsActions3}
    </clr-alert-item>
  </clr-alert>
  <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'warning'">
    <clr-alert-item><span class="alert-text">Lightweight warning alert text</span></clr-alert-item>
  </clr-alert>
`;
//<clr-accordion-content>${nestedComponents}</clr-accordion-content>
const NestedComponentsTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const AlertNestedComponents: StoryObj = {
  render: NestedComponentsTemplate,
};
