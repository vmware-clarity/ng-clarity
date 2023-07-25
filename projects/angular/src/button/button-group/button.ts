/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Optional, Output, SkipSelf, TemplateRef, ViewChild } from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import { ButtonInGroupService } from '../providers/button-in-group.service';

@Component({
  selector: 'clr-button',
  template: `
    <ng-template #buttonProjectedRef>
      <button
        [class]="classNames"
        (click)="emitClick()"
        [attr.type]="type"
        [attr.name]="name"
        [attr.disabled]="disabled"
        [attr.role]="role"
        [attr.id]="id"
      >
        <span class="spinner spinner-inline" *ngIf="loading"></span>
        <ng-content></ng-content>
      </button>
    </ng-template>
  `,
  providers: [{ provide: LoadingListener, useExisting: ClrButton }],
})
export class ClrButton implements LoadingListener {
  @Output('click') _click = new EventEmitter<boolean>(false);

  @ViewChild('buttonProjectedRef', { static: true }) templateRef: TemplateRef<ClrButton>;

  loading: boolean;

  private _inMenu = false;
  private _enableService = false;
  private _classNames = 'btn';
  private _name: string = null;
  private _type: string = null;
  private _disabled: any = null;
  private _id: string = uniqueIdFactory();

  constructor(
    @SkipSelf()
    @Optional()
    public buttonInGroupService: ButtonInGroupService
  ) {}

  @Input('clrInMenu')
  get inMenu(): boolean {
    return this._inMenu;
  }
  set inMenu(value: boolean) {
    value = !!value;
    if (this._inMenu !== value) {
      this._inMenu = value;
      // We check if the service flag is enabled
      // and if the service exists because the service is optional
      if (this._enableService && this.buttonInGroupService) {
        this.buttonInGroupService.updateButtonGroup(this);
      }
    }
  }

  @Input('class')
  get classNames(): string {
    return this._classNames;
  }
  set classNames(value: string) {
    if (typeof value === 'string') {
      const classNames: string[] = value.split(' ');
      if (classNames.indexOf('btn') === -1) {
        classNames.push('btn');
      }
      this._classNames = classNames.join(' ');
    }
  }

  @Input('name')
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    if (typeof value === 'string') {
      this._name = value;
    }
  }

  @Input('type')
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    if (typeof value === 'string') {
      this._type = value;
    }
  }

  @Input('id')
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    if (typeof value === 'string') {
      this._id = value;
    }
  }

  @Input('disabled')
  get disabled(): any {
    return this._disabled;
  }
  set disabled(value: any) {
    if (value !== null && value !== false) {
      this._disabled = '';
    } else {
      this._disabled = null;
    }
  }

  get role(): string {
    return this.inMenu ? 'menuitem' : null;
  }

  ngAfterViewInit() {
    this._enableService = true;
  }

  loadingStateChange(state: ClrLoadingState): void {
    this.loading = state === ClrLoadingState.LOADING;
  }

  emitClick(): void {
    this._click.emit(true);
  }
}
