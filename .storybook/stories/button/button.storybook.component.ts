/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrIconModule, ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';
import { BUTTON_STYLES, BUTTON_TYPES, getButtonClass } from 'helpers/button-class.helper';
import { createArray } from 'helpers/common';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-button',
  standalone: true,
  imports: [CommonModule, ClrIconModule, ClrLoadingButtonModule, ClrLoadingModule],
  template: `
    <ng-container [ngSwitch]="templateMode">
      <!-- Default Button Template -->
      <ng-container *ngSwitchCase="'default'">
        <button class="btn" [ngClass]="getButtonClass({ buttonType, buttonStyle, btnSmallSize })" [disabled]="disabled">
          <cds-icon *ngIf="iconShape" [attr.shape]="iconShape"></cds-icon>
          {{ content }}
          <ng-container #renderContainer></ng-container>
        </button>
      </ng-container>

      <!-- Link Button Template -->
      <ng-container *ngSwitchCase="'link'">
        <a
          href="javascript://"
          class="btn"
          [ngClass]="getButtonClass({ buttonType, buttonStyle, btnSmallSize })"
          [disabled]="disabled"
        >
          <cds-icon *ngIf="iconShape" [attr.shape]="iconShape"></cds-icon>
          {{ content }}
        </a>
      </ng-container>

      <ng-container *ngSwitchCase="'loading'">
        <h6>{{ stateName }}</h6>
        <button [clrLoading]="validateState" class="btn btn-sm btn-primary">
          <cds-icon shape="home"></cds-icon>
          Validate
        </button>
        <button [clrLoading]="validateState" class="btn btn-primary">Validate</button>
        <button [clrLoading]="submitState" type="submit" class="btn btn-success-outline">
          <cds-icon shape="home"></cds-icon>
          Submit
        </button>
      </ng-container>

      <!-- Showcase Template -->
      <ng-container *ngSwitchCase="'showcase'">
        <h6>Default Button</h6>
        <button class="btn">Default</button>

        <h6>Primary Buttons</h6>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type">
          <cds-icon shape="user"></cds-icon>
          {{ type }}
        </button>

        <h6>Old Outline Buttons</h6>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type + '-outline'">
          {{ type }}
          <cds-icon shape="home"></cds-icon>
        </button>

        <h6>New Outline Buttons</h6>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-outline-' + type">{{ type }}</button>

        <h6>Link Buttons</h6>
        <button class="btn btn-link">Default</button>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{ type }}</button>

        <h6>Inverse Buttons</h6>
        <div style="background: #313131; padding: 24px">
          <button class="btn btn-inverse">Inverse</button>
        </div>

        <h6>Block Buttons</h6>
        <button href="javascript://" class="btn btn-block">
          <cds-icon shape="user"></cds-icon>
          Block Button
          <cds-icon shape="home"></cds-icon>
        </button>

        <h6>Small Primary Buttons</h6>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type">{{ type }}</button>

        <h6>Small Outline Buttons</h6>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type + '-outline'">
          <cds-icon shape="user"></cds-icon>
          {{ type }}
          <cds-icon shape="home"></cds-icon>
        </button>

        <!-- Links -->
        <h6>Default Link</h6>
        <a href="javascript://" class="btn">Default</a>

        <h6>Primary Links</h6>
        <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type">{{ type }}</a>

        <h6>Old Outline Links</h6>
        <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type + '-outline'">{{
          type
        }}</a>

        <h6>New Outline Links</h6>
        <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-outline-' + type">
          <cds-icon shape="user"></cds-icon>
          {{ type }}
          <cds-icon shape="home"></cds-icon>
        </a>

        <h6>Flat Links</h6>
        <a href="javascript://" class="btn btn-link">Default</a>
        <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-link-' + type">{{ type }}</a>
        <a href="javascript://" class="btn btn-link btn-sm">
          <cds-icon shape="user"></cds-icon>
          Link
          <cds-icon shape="home"></cds-icon>
        </a>

        <h6>Flat Buttons</h6>
        <button class="btn btn-link">Default</button>
        <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{ type }}</button>
        <button class="btn btn-link btn-sm">
          <cds-icon shape="user"></cds-icon>
          Flat
          <cds-icon shape="home"></cds-icon>
        </button>

        <h6>Inverse Links</h6>
        <div style="background: #313131; padding: 24px">
          <a href="javascript://" class="btn btn-inverse">Inverse</a>
        </div>

        <h6>Block Links</h6>
        <a href="javascript://" class="btn btn-block">Block</a>
      </ng-container>
    </ng-container>
  `,
})
export class ButtonStorybookComponent extends RenderComponentStorybook {
  BUTTON_STYLES = BUTTON_STYLES;
  BUTTON_TYPES = BUTTON_TYPES;
  getButtonClass = getButtonClass;
  createArray = createArray;

  // Determines which template to render: "default", "link", or "showcase"
  @Input() templateMode: 'default' | 'link' | 'showcase' | 'loading' = 'default';

  // Common inputs
  @Input() disabled = false;
  @Input() content = 'Hello World!';
  @Input() btnSmallSize = false;
  @Input() iconShape = '';
  @Input() buttonType = 'primary';
  @Input() buttonStyle = 'outline';
  @Input() stateName = 'Default Buttons';
  @Input() validateState = ClrLoadingState.DEFAULT;
  @Input() submitState = ClrLoadingState.DEFAULT;

  // Output action (wired from Storybook)
  @Output() click: EventEmitter<Event> = new EventEmitter();
}
