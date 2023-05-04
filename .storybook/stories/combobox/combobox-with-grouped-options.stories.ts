/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComboboxModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { elements } from 'helpers/elements.data';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-combobox-container>
      <label>Options:</label>
      <clr-combobox [clrMulti]="clrMulti">
        <ng-container *clrOptionSelected="let selected">
          {{selected}}
        </ng-container>
        <clr-options>
          <clr-option-group
            *ngFor="let optionGroup of optionGroups"
            [clrOptionGroupLabel]="optionGroup.groupName"
          >
            <clr-option
              *clrOptionItems="let option of optionGroup.options"
              [clrValue]="option"
            >
              {{option}}
            </clr-option>
          </clr-option-group>
        </clr-options>
      </clr-combobox>
    </clr-combobox-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Combobox/Combobox with grouped options',
  argTypes: {
    // inputs
    clrMulti: { defaultValue: false, control: { type: 'boolean' } },
    // story helpers
    optionGroups: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    optionGroups: [...elements]
      .sort((a, b) => a.number - b.number)
      .reduce<{ groupName: string; options: string[] }[]>((groups, element) => {
        const x = Math.floor(element.number / 10);
        const groupName = `Elements ${x * 10} to ${x * 10 + 9}`;
        let group = groups.find(group => group.groupName === groupName);

        if (!group) {
          group = { groupName, options: [] };
          groups.push(group);
        }

        group.options.push(`${element.name} (#${element.number})`);

        return groups;
      }, []),
  },
};

setupStorybook(ClrComboboxModule, defaultStory, defaultParameters);
