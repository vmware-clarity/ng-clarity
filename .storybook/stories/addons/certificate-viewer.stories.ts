/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppfxCertificateViewerModule, CertificateViewerComponent } from '@clr/addons/certificate-viewer';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import googleCerts from '../../projects/website/src/app/documentation/demos/certificate-viewer/certs/google-certs.json';

// ─── Wrapper ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'clr-cert-viewer-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxCertificateViewerModule],
  template: `
    <div style="height: 500px; display: flex; flex-direction: column">
      <appfx-certificate-viewer
        [pemEncodedCertificatesChain]="pemChain"
        [topHeadingLevel]="topHeadingLevel"
        style="flex: 1 1 auto; overflow: auto"
      ></appfx-certificate-viewer>
    </div>
  `,
})
class CertViewerStoryWrapperComponent {
  @Input() pemChain: string[] = googleCerts;
  @Input() topHeadingLevel = 5;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Addons/Certificate Viewer',
  component: CertificateViewerComponent,
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
};

type Story = StoryObj<CertificateViewerComponent>;

const template: StoryFn<CertViewerStoryWrapperComponent> = args => ({
  props: args,
  component: CertViewerStoryWrapperComponent,
});

export const GoogleCertificateChain: Story = {
  render: template,
};

export const HeadingLevel1: Story = {
  render: template,
  args: {
    topHeadingLevel: 1,
  },
};
