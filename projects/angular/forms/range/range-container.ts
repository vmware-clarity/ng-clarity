/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  Optional,
  Renderer2,
  signal,
} from '@angular/core';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  LayoutService,
  NgControlService,
} from '@clr/angular/forms/common';

import { ClrRange } from './range';

@Component({
  selector: 'clr-range-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-range-wrapper" [class.progress-fill]="hasProgress">
        <ng-content select="[clrRange]"></ng-content>
        @if (hasProgress) {
          <span class="fill-input" [style.width]="getRangeProgressFillWidth()"></span>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'controlState().disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [NgControlService, ControlIdService, ControlClassService],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrRangeContainer extends ClrAbstractContainer implements AfterContentChecked {
  private _hasProgress = false;
  private readonly track = signal<RangeTrack | null>(null, { equal: sameTrack });

  @ContentChild(forwardRef(() => ClrRange), { read: ElementRef }) private input!: ElementRef<HTMLInputElement>;

  constructor(
    @Optional() layoutService: LayoutService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    /** @deprecated No longer used. Kept so subclasses calling `super()` with five arguments still compile. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderer?: Renderer2,
    /** @deprecated No longer used. Kept so subclasses calling `super()` with five arguments still compile. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    idService?: ControlIdService
  ) {
    super(layoutService, controlClassService, ngControlService);
  }

  @Input('clrRangeHasProgress')
  get hasProgress() {
    return this._hasProgress;
  }
  set hasProgress(val: boolean) {
    const valBool = !!val;
    if (valBool !== this._hasProgress) {
      this._hasProgress = valBool;
    }
  }

  // The fill depends on the input's min, max and width, which consumer bindings and layout change.
  // Reading them here, during the consumer's check, keeps this OnPush view in step with them.
  ngAfterContentChecked() {
    const input = this.input?.nativeElement;
    if (this.hasProgress && input) {
      this.track.set({ min: +input.min, max: +input.max, width: input.offsetWidth });
    }
  }

  getRangeProgressFillWidth(): string {
    const track = this.track();
    const value = this.control ? (this.controlState().value as number) : undefined;
    return track ? rangeFillWidth(track, value) : '';
  }
}

interface RangeTrack {
  min: number;
  max: number;
  width: number;
}

function sameTrack(a: RangeTrack | null, b: RangeTrack | null) {
  return a?.min === b?.min && a?.max === b?.max && a?.width === b?.width;
}

/** Width in pixels of the progress fill for a range input. Without a value the thumb sits in the middle. */
function rangeFillWidth({ min, max, width }: RangeTrack, value: number | undefined): string {
  if (min === 0 && max === 0) {
    max = 100;
  }
  const current = value !== undefined ? value : (min + max) / 2;
  const percent = ((current - min) * 100) / (max - min);
  return (percent * width) / 100 + 'px';
}
