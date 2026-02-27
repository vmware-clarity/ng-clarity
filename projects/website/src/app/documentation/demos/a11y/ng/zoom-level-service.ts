/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  standalone: true,
})
export class ExampleComponent {
  private subscription!: Subscription;

  constructor(private zoomLevelService: ZoomLevelService) {}

  ngOnInit() {
    if (this.zoomLevelService) {
      this.subscription = this.zoomLevelService.onChange.subscribe(zoom => {
        switch (zoom) {
          case ZoomLevel.none:
            // do something when no zoom is detected
            break;

          case ZoomLevel.x2:
            // do something when zoom 200% is detected
            break;

          case ZoomLevel.x4:
            // do something when zoom 400% is detected
            break;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
