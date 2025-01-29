/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './router-link-button-group.html',
  styleUrls: ['../../button-group.demo.scss'],
})
export class RouterLinkButtonGroupDemo {}

@Component({
  template: 'route-one works!',
})
export class RouterLinkButtonGroupDemoRouteOneComponent {}

@Component({
  template: 'route-two works!',
})
export class RouterLinkButtonGroupDemoRouteTwoComponent {}

@Component({
  template: 'route-three works!',
})
export class RouterLinkButtonGroupDemoRouteThreeComponent {}
