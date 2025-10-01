/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrLoadingModule } from '@clr/angular';

import { elements } from '../../helpers/elements.data';

interface OptionGroup {
  groupName: string;
  options: string[];
}

@Component({
  selector: 'storybook-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule, ClrComboboxModule, ClrLoadingModule],
  template: `
    <clr-combobox-container>
      <label [for]="id">{{ label }}</label>
      <clr-combobox
        [clrEditable]="clrEditable"
        [clrMulti]="clrMulti"
        [placeholder]="placeholder"
        [id]="id"
        [clrLoading]="clrLoading"
        [ngModel]="clrMulti ? multiModel : singleModel"
        (ngModelChange)="onModelChange($event)"
        (clrInputChange)="clrInputChange.emit($event)"
        (clrOpenChange)="clrOpenChange.emit($event)"
        (clrSelectionChange)="clrSelectionChange.emit($event)"
        [disabled]="controlDisabled"
        [required]="controlRequired"
      >
        <ng-container *clrOptionSelected="let selected">
          {{ objectValues ? selected.symbol : selected }}
        </ng-container>
        <clr-options>
          @if (useGroups) {
            @for (group of optionGroups; track group) {
              <clr-option-group [clrOptionGroupLabel]="group.groupName">
                <ng-template
                  clrOptionItems
                  [clrOptionItemsOf]="group.options"
                  [clrOptionItemsField]="objectValues ? 'symbol' : undefined"
                  let-option
                >
                  <clr-option [clrValue]="objectValues ? option : option.symbol">
                    <ng-container *ngTemplateOutlet="defaultTemplate; context: { option: option }"></ng-container>
                  </clr-option>
                </ng-template>
              </clr-option-group>
            }
          } @else {
            <ng-container *ngTemplateOutlet="flatOptions"></ng-container>
          }
          <ng-template #flatOptions>
            <ng-template
              clrOptionItems
              [clrOptionItemsOf]="elements"
              [clrOptionItemsField]="objectValues ? 'symbol' : undefined"
              let-element
            >
              <clr-option [clrValue]="objectValues ? element : element.symbol">
                <ng-container *ngTemplateOutlet="defaultTemplate; context: { option: element }"></ng-container>
              </clr-option>
            </ng-template>
          </ng-template>
        </clr-options>
      </clr-combobox>
      @if (controlHelper) {
        <clr-control-helper>
          {{ helperText }}
        </clr-control-helper>
      }
    </clr-combobox-container>
    <ng-template #defaultTemplate let-option="option">
      @if (multiLineItems) {
        <div cds-layout="vertical">
          <span>{{ option.name }}</span>
          <span>{{ option.name }}</span>
          <span>{{ option.name }}</span>
        </div>
      } @else {
        {{ option.name }}
      }
    </ng-template>
  `,
})
export class StorybookComboboxComponent {
  @Input() clrEditable = false;
  @Input() clrMulti = false;
  @Input() placeholder = 'Placeholder text';
  @Input() id = '';
  @Input() label = 'Combobox';
  @Input() clrLoading = false;
  @Input() controlDisabled = false;
  @Input() controlRequired = false;
  @Input() controlHelper = false;
  @Input() helperText = 'Helper text';
  @Input() useGroups = true;
  @Input() multiLineItems = false;
  @Input() objectValues = false;

  /**
   * If true, expects `elements` as array of strings (flat list).
   * If useGroups is true, `elements` should be the raw data objects for grouping.
   */
  @Input() elements: any[] = elements;

  @Input() singleModel = '';
  @Input() multiModel: string[] = [];

  @Output() clrInputChange = new EventEmitter<string>();
  @Output() clrOpenChange = new EventEmitter<boolean>();
  @Output() clrSelectionChange = new EventEmitter<any>();

  optionGroups = [...this.elements]
    .sort((a, b) => a.number - b.number)
    .reduce<OptionGroup[]>((groups, element) => {
      const x = Math.floor(element.number / 10);
      const groupName = `Elements ${x * 10} to ${x * 10 + 9}`;
      let group = groups.find(g => g.groupName === groupName);
      if (!group) {
        group = { groupName, options: [] };
        groups.push(group);
      }
      group.options.push(element);
      return groups;
    }, []);

  onModelChange(value: string | string[]) {
    if (this.clrMulti) {
      this.multiModel = value as string[];
    } else {
      this.singleModel = value as string;
    }
  }
}
