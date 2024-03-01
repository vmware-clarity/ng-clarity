/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModalModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Modal/Static',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrModalModule],
    }),
  ],
  argTypes: {
    size: { defaultValue: 'md', control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl'] } },
  },
  args: {
    title: 'Small Modal',
    body: 'This is a small modal.',
    size: 'sm',
  },
};

const ModalStaticTemplate: Story = args => ({
  template: `
    <style>
      .backdrop-example-container {
        position: relative;
        padding: 24px;
      }
      .modal.static {
        position: relative;
        padding: 72px;
      }
        
      .modal-backdrop.static {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    </style>
    <div class="backdrop-example-container">
      <div class="modal static">
        <div class="modal-dialog modal-{{size}}" role="dialog" aria-hidden="true">
          <div class="modal-content">
            <div class="modal-header">
              <button aria-label="Close" class="close" type="button">
                <cds-icon aria-hidden="true" shape="window-close"></cds-icon>
              </button>
              <h3 class="modal-title">{{title}}</h3>
            </div>
            <div class="modal-body">{{body}}</div>
            <div class="modal-footer">
              <button class="btn btn-primary" type="button">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop static" aria-hidden="true"></div>
    </div>
  `,
  props: args,
});

export const SmallModal: StoryObj = {
  render: ModalStaticTemplate,
};

export const MediumModal: StoryObj = {
  render: ModalStaticTemplate,
  args: {
    title: 'Medium Modal',
    body: 'This is a medium modal.',
    size: 'md',
  },
};

export const LargeModal: StoryObj = {
  render: ModalStaticTemplate,
  args: {
    title: 'Large Modal',
    body: 'This is a large modal.',
    size: 'lg',
  },
};

export const ExtraLargeModal: StoryObj = {
  render: ModalStaticTemplate,
  args: {
    title: 'Extra Large Modal',
    body: 'This is a extra Large modal.',
    size: 'xl',
  },
};
