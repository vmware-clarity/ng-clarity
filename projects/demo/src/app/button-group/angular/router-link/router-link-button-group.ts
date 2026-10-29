/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './router-link-button-group.html',
  styleUrls: ['../../button-group.demo.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RouterLinkButtonGroupDemo {}

@Component({
  template: 'route-one works!',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RouterLinkButtonGroupDemoRouteOneComponent {}

@Component({
  template: 'route-two works!',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RouterLinkButtonGroupDemoRouteTwoComponent {}

@Component({
  template: 'route-three works!',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RouterLinkButtonGroupDemoRouteThreeComponent {}
