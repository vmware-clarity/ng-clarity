/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-signpost-demo',
  styleUrls: ['./signpost.demo.scss'],
  templateUrl: 'signpost.demo.html',
})
export class SignpostDemo {
  openState = false;
  positions = [
    {
      useCustomTrigger: false,
      icon: 'align-left',
      text: '',
      description: 'Top left',
      position: 'top-left',
      id: 'topLeftTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'yen',
      text: '',
      description: 'Top middle',
      position: 'top-middle',
      id: 'topMiddleTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'world',
      text: '',
      description: 'Top right',
      position: 'top-right',
      id: 'topRightTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'user',
      text: '',
      description: 'Left top',
      position: 'left-top',
      id: 'leftTopTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'search',
      text: 'Error',
      description: 'Left middle',
      position: 'left-middle',
      id: 'leftMiddleTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'bell',
      text: 'Some text',
      description: 'Left bottom',
      position: 'left-bottom',
      id: 'leftBottomTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'cloud',
      text: 'Warning',
      description: 'Right top',
      position: 'right-top',
      id: 'rightTopTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'eye',
      text: '',
      description: 'Right middle',
      position: 'right-middle',
      id: 'rightMiddleTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'help-info',
      text: '',
      description: 'Right bottom',
      position: 'right-bottom',
      id: 'rightBottomTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'pencil',
      text: '',
      description: 'Bottom left',
      position: 'bottom-left',
      id: 'bottomLeftTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'info',
      text: 'Info',
      description: 'Bottom middle',
      position: 'bottom-middle',
      id: 'bottomMiddleTrigger',
    },
    {
      useCustomTrigger: false,
      icon: 'bolt',
      text: '',
      description: 'Bottom right',
      position: 'bottom-right',
      id: 'bottomRightTrigger',
    },
    {
      useCustomTrigger: true,
      icon: 'success-standard',
      text: 'Default',
      description: 'Default',
      position: 'default',
      id: 'defaultTrigger',
    },
  ];
}
