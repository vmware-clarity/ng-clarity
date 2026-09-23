/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { CertViewerStoryWrapperComponent } from './certificate-viewer.storybook.component';

/** The story renders the wrapper component itself, so its public members are the args. */
type CertificateViewerArgs = CertViewerStoryWrapperComponent;

const meta: Meta<CertificateViewerArgs> = {
  title: 'Addons/Certificate Viewer',
  component: CertViewerStoryWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxCertificateViewerModule, CommonModule, CertViewerStoryWrapperComponent],
    }),
  ],
  argTypes: {
    topHeadingLevel: {
      control: { type: 'number', min: 1, max: 7, step: 1 },
    },
  },
  args: {
    topHeadingLevel: 5,
  },
  render: args => ({
    props: args,
    component: CertViewerStoryWrapperComponent,
  }),
};

export default meta;

type Story = StoryObj<CertificateViewerArgs>;

export const GoogleCertificateChain: Story = {};

export const HeadingLevel1: Story = {
  args: {
    topHeadingLevel: 1,
  },
};
