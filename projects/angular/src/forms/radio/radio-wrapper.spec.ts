/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrRadio } from './radio';
import { ClrRadioContainer } from './radio-container';
import { ClrRadioWrapper } from './radio-wrapper';
import { WrapperContainerSpec, WrapperFullSpec, WrapperNoLabelSpec } from '../tests/wrapper.spec';

@Component({
  template: `
    <clr-radio-wrapper>
      <label>Hello World</label>
      <input type="radio" clrRadio name="model" [(ngModel)]="model" />
    </clr-radio-wrapper>
  `,
  standalone: false,
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <clr-radio-wrapper>
      <input type="radio" clrRadio name="model" [(ngModel)]="model" />
    </clr-radio-wrapper>
  `,
  standalone: false,
})
class NoLabelTest {
  model = '';
}

@Component({
  template: `
    <clr-radio-container>
      <clr-radio-wrapper>
        <input type="radio" clrRadio name="model" [(ngModel)]="model" />
      </clr-radio-wrapper>
    </clr-radio-container>
  `,
  standalone: false,
})
class ContainerTest {
  model = '';
}

export default function (): void {
  describe('ClrRadioWrapper', () => {
    WrapperNoLabelSpec(ClrRadioWrapper, ClrRadio, NoLabelTest);
    WrapperFullSpec(ClrRadioWrapper, ClrRadio, FullTest, 'clr-radio-wrapper');
    WrapperContainerSpec(ClrRadioContainer, ClrRadioWrapper, ClrRadio, ContainerTest, 'clr-radio-wrapper');
  });
}
