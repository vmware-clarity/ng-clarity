/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrOverlayPanelContent } from '../../../../angular/src/popover/overlay-panel';

@Component({
  selector: 'clr-overlay-panel-demo',
  styleUrls: ['./overlay-panel.demo.scss'],
  templateUrl: 'overlay-panel.demo.html',
})
export class OverlayPanelDemo {
  openState = false;
  positions = [
    {
      useCustomTrigger: false,
      icon: 'align-left',
      text: '',
      description: 'Top left',
      position: 'top-left',
      id: 'topLeftTrigger',
      minHeight: '100px',
      maxHeight: '150px',
    },
    {
      useCustomTrigger: false,
      icon: 'yen',
      text: '',
      description: 'Top middle',
      position: 'top-middle',
      id: 'topMiddleTrigger',
      minHeight: '50px',
      maxHeight: '100px',
    },
    {
      useCustomTrigger: false,
      icon: 'world',
      text: '',
      description: 'Top right',
      position: 'top-right',
      id: 'topRightTrigger',
      minHeight: '250px',
      maxHeight: '350px',
    },
    {
      useCustomTrigger: false,
      icon: 'user',
      text: '',
      description: 'Left top',
      position: 'left-top',
      id: 'leftTopTrigger',
      minHeight: '50px',
      maxHeight: '150px',
    },
    {
      useCustomTrigger: true,
      icon: 'search',
      text: 'Error',
      description: 'Left middle',
      position: 'left-middle',
      id: 'leftMiddleTrigger',
      minHeight: '50px',
      maxHeight: '450px',
    },
    {
      useCustomTrigger: true,
      icon: 'bell',
      text: 'Some text',
      description: 'Left bottom',
      position: 'left-bottom',
      id: 'leftBottomTrigger',
      minHeight: '150px',
      maxHeight: '250px',
    },
    {
      useCustomTrigger: true,
      icon: 'cloud',
      text: 'Warning',
      description: 'Right top',
      position: 'right-top',
      id: 'rightTopTrigger',
      minHeight: '150px',
      maxHeight: '250px',
    },
    {
      useCustomTrigger: true,
      icon: 'eye',
      text: '',
      description: 'Right middle',
      position: 'right-middle',
      id: 'rightMiddleTrigger',
      minWidth: '350px',
      maxWidth: '400px',
    },
    {
      useCustomTrigger: false,
      icon: 'help-info',
      text: '',
      description: 'Right bottom',
      position: 'right-bottom',
      id: 'rightBottomTrigger',
      minHeight: '50px',
      maxHeight: '300px',
      minWidth: '150px',
      maxWidth: '250px',
    },
    {
      useCustomTrigger: false,
      icon: 'pencil',
      text: '',
      description: 'Bottom left',
      position: 'bottom-left',
      id: 'bottomLeftTrigger',
      minHeight: '150px',
      maxHeight: '250px',
    },
    {
      useCustomTrigger: true,
      icon: 'info',
      text: 'Info',
      description: 'Bottom middle',
      position: 'bottom-middle',
      id: 'bottomMiddleTrigger',
      minHeight: '150px',
      maxHeight: '300px',
    },
    {
      useCustomTrigger: false,
      icon: 'bolt',
      text: '',
      description: 'Bottom right',
      position: 'bottom-right',
      id: 'bottomRightTrigger',
      minHeight: '150px',
      maxHeight: '250px',
      minWidth: '150px',
      maxWidth: '250px',
    },
    {
      useCustomTrigger: true,
      icon: 'success-standard',
      text: 'Default',
      description: 'Default',
      position: 'default',
      id: 'defaultTrigger',
      minHeight: '150px',
      maxHeight: '250px',
    },
  ];

  triggerClose(overlayPanelContent: ClrOverlayPanelContent) {
    overlayPanelContent.close();
  }
}
