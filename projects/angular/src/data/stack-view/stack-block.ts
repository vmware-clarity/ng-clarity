/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrStackViewLabel } from './stack-view-custom-tags';

@Component({
  selector: 'clr-stack-block',
  template: `
    <!-- The 'preventDefault' for the space keydown event prevents the page
         from scrolling when a stack block is toggled via the space key. -->
    <div class="stack-block-heading" [attr.role]="sbAriaRole" [attr.aria-level]="headingLevel">
      <div
        class="stack-block-label"
        (click)="toggleExpand($event)"
        (keyup.enter)="toggleExpand($event)"
        (keyup.space)="toggleExpand($event)"
        (keydown.space)="preventDefaultIfNotInputEvent($event)"
        (focus)="focused = true"
        (blur)="focused = false"
        [id]="uniqueId"
        [attr.role]="role"
        [attr.tabindex]="tabIndex"
        [attr.aria-expanded]="ariaExpanded"
        [attr.aria-controls]="getStackChildrenId()"
      >
        <cds-icon
          shape="angle"
          class="stack-block-caret"
          *ngIf="expandable"
          [attr.direction]="caretDirection"
        ></cds-icon>
        <span class="clr-sr-only" *ngIf="getChangedValue">{{ commonStrings.keys.stackViewChanged }}</span>
        <div class="stack-view-key">
          <!-- This structure changed to fix #3567 and the a11y request was to move away from dl's -->
          <!-- I added the key class to update css targets for the original component style -->
          <ng-content select="clr-stack-label"></ng-content>
        </div>
        <div class="stack-block-content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
    <clr-expandable-animation [clrExpandTrigger]="expanded" class="stack-children">
      <div
        [style.height]="expanded ? 'auto' : 0"
        role="region"
        *ngIf="expanded"
        [attr.id]="getStackChildrenId()"
        [attr.aria-labelledby]="labelledById"
      >
        <ng-content select="clr-stack-block"></ng-content>
      </div>
    </clr-expandable-animation>
  `,
  // Custom elements are inline by default
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  // Make sure the host has the proper class for styling purposes
  host: {
    '[class.stack-block]': 'true',
  },
})
export class ClrStackBlock implements OnInit {
  @Input('clrSbExpanded') @HostBinding('class.stack-block-expanded') expanded = false;
  @Input('clrSbExpandable') @HostBinding('class.stack-block-expandable') expandable = false;

  /**
   * Depth of the stack view starting from 1 for first level
   */
  @Input('clrStackViewLevel') ariaLevel: number;
  @Input('clrSbAriaRole') ariaRole: string;

  @Output('clrSbExpandedChange') expandedChange = new EventEmitter<boolean>(false);

  @ContentChild(ClrStackViewLabel) stackBlockTitle: any;

  focused = false;
  uniqueId = uniqueIdFactory();

  private _changedChildren = 0;
  private _fullyInitialized = false;
  private _changed = false;

  /*
   * This would be more efficient with @ContentChildren, with the parent ClrStackBlock
   * querying for children StackBlocks, but this feature is not available when downgrading
   * the component for Angular 1.
   */
  constructor(
    @SkipSelf()
    @Optional()
    private parent: ClrStackBlock,
    public commonStrings: ClrCommonStringsService
  ) {
    if (parent) {
      parent.addChild();
    }
  }

  @Input('clrSbNotifyChange')
  set setChangedValue(value: boolean) {
    this._changed = value;

    if (this.parent && this._fullyInitialized) {
      if (value) {
        this.parent._changedChildren++;
      } else {
        this.parent._changedChildren--;
      }
    }
  }

  @HostBinding('class.stack-block-changed')
  get getChangedValue(): boolean {
    return this._changed || (this._changedChildren > 0 && !this.expanded);
  }

  @HostBinding('class.on-focus')
  get onStackLabelFocus(): boolean {
    return this.expandable && !this.expanded && this.focused;
  }

  get labelledById() {
    return this.stackBlockTitle.id;
  }

  get headingLevel() {
    if (this.ariaRole && this.ariaRole === 'heading') {
      if (this.ariaLevel) {
        return this.ariaLevel + '';
      }

      return this.parent ? '4' : '3';
    }
    return null;
  }

  get sbAriaRole() {
    if (this.ariaRole === 'undefined') {
      return null;
    }
    this.ariaRole = this.ariaRole ? this.ariaRole : 'heading';
    return this.ariaRole;
  }

  get caretDirection(): string {
    return this.expanded ? 'down' : 'right';
  }

  get role(): string {
    return this.expandable ? 'button' : null;
  }

  get tabIndex(): string {
    return this.expandable ? '0' : null;
  }

  get ariaExpanded(): string {
    if (!this.expandable) {
      return null;
    } else {
      return this.expanded ? 'true' : 'false';
    }
  }

  ngOnInit(): void {
    // in order to access the parent ClrStackBlock's properties,
    // the child ClrStackBlock has to be fully initialized at first.
    this._fullyInitialized = true;
  }

  addChild(): void {
    this.expandable = true;
  }

  toggleExpand(event?: Event): void {
    if (eventIsInputEvent(event)) {
      return;
    }

    if (this.expandable) {
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    }
  }

  getStackChildrenId() {
    return this.expanded ? `clr-stack-children-${this.uniqueId}` : null;
  }

  protected preventDefaultIfNotInputEvent(event: Event) {
    if (eventIsInputEvent(event)) {
      return;
    }

    event.preventDefault();
  }
}

function eventIsInputEvent(event?: Event) {
  const targetElement = event?.target as HTMLElement;

  return targetElement?.tagName === 'INPUT';
}
