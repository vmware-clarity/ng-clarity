import * as i0 from '@angular/core';
import { Component, Input, Directive, EventEmitter, HostBinding, ContentChild, Output, SkipSelf, Optional, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/utils';
import { uniqueIdFactory, ClrExpandableAnimationModule } from '@clr/angular/utils';
import * as i2 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, ClrIcon } from '@clr/angular/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStackView {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackView, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrStackView, isStandalone: false, selector: "clr-stack-view", ngImport: i0, template: `
    <ng-content select="clr-stack-header"></ng-content>
    <div class="stack-view"><ng-content></ng-content></div>
  `, isInline: true, styles: [":host{display:block}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackView, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stack-view', template: `
    <ng-content select="clr-stack-header"></ng-content>
    <div class="stack-view"><ng-content></ng-content></div>
  `, standalone: false, styles: [":host{display:block}\n"] }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStackHeader {
    constructor(stackView) {
        this.stackView = stackView;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackHeader, deps: [{ token: ClrStackView }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrStackHeader, isStandalone: false, selector: "clr-stack-header", inputs: { ariaLevel: ["clrStackHeaderLevel", "ariaLevel"] }, ngImport: i0, template: `
    <div class="stack-header">
      <div
        [attr.role]="ariaLevel ? 'heading' : null"
        [attr.aria-level]="ariaLevel ? ariaLevel : null"
        class="stack-title"
      >
        <ng-content></ng-content>
      </div>

      <span class="stack-actions">
        <ng-content select=".stack-action"></ng-content>
      </span>
    </div>
  `, isInline: true, styles: [":host{display:block}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackHeader, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stack-header', template: `
    <div class="stack-header">
      <div
        [attr.role]="ariaLevel ? 'heading' : null"
        [attr.aria-level]="ariaLevel ? ariaLevel : null"
        class="stack-title"
      >
        <ng-content></ng-content>
      </div>

      <span class="stack-actions">
        <ng-content select=".stack-action"></ng-content>
      </span>
    </div>
  `, standalone: false, styles: [":host{display:block}\n"] }]
        }], ctorParameters: () => [{ type: ClrStackView }], propDecorators: { ariaLevel: [{
                type: Input,
                args: ['clrStackHeaderLevel']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStackViewCustomTags {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewCustomTags, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrStackViewCustomTags, isStandalone: false, selector: "clr-stack-content", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewCustomTags, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-stack-content',
                    standalone: false,
                }]
        }] });
class ClrStackViewLabel {
    constructor() {
        this._generatedId = null;
        this._id = null;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        if (typeof val === 'string' && val !== '') {
            this._id = val;
        }
        else {
            this._id = this._generatedId + '';
        }
    }
    ngOnInit() {
        this._generatedId = 'clr-stack-label-' + uniqueIdFactory();
        if (!this.id) {
            this._id = this._generatedId + '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewLabel, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrStackViewLabel, isStandalone: false, selector: "clr-stack-label", inputs: { id: "id" }, host: { properties: { "attr.id": "id" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewLabel, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-stack-label',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[attr.id]': 'id',
                    },
                    standalone: false,
                }]
        }], propDecorators: { id: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStackBlock {
    /*
     * This would be more efficient with @ContentChildren, with the parent ClrStackBlock
     * querying for children StackBlocks, but this feature is not available when downgrading
     * the component for Angular 1.
     */
    constructor(parent, commonStrings) {
        this.parent = parent;
        this.commonStrings = commonStrings;
        this.expanded = false;
        this.expandable = false;
        this.expandedChange = new EventEmitter(false);
        this.focused = false;
        this.uniqueId = uniqueIdFactory();
        this._changedChildren = 0;
        this._fullyInitialized = false;
        this._changed = false;
        if (parent) {
            parent.addChild();
        }
    }
    set setChangedValue(value) {
        this._changed = value;
        if (this.parent && this._fullyInitialized) {
            if (value) {
                this.parent._changedChildren++;
            }
            else {
                this.parent._changedChildren--;
            }
        }
    }
    get getChangedValue() {
        return this._changed || (this._changedChildren > 0 && !this.expanded);
    }
    get onStackLabelFocus() {
        return this.expandable && !this.expanded && this.focused;
    }
    get labelledById() {
        return this.stackBlockTitle.id;
    }
    get caretDirection() {
        return this.expanded ? 'down' : 'right';
    }
    get role() {
        return this.expandable ? 'button' : null;
    }
    get tabIndex() {
        return this.expandable ? '0' : null;
    }
    get ariaExpanded() {
        if (!this.expandable) {
            return null;
        }
        else {
            return this.expanded ? 'true' : 'false';
        }
    }
    ngOnInit() {
        // in order to access the parent ClrStackBlock's properties,
        // the child ClrStackBlock has to be fully initialized at first.
        this._fullyInitialized = true;
    }
    addChild() {
        this.expandable = true;
    }
    toggleExpand(event) {
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
    preventDefaultIfNotInputEvent(event) {
        if (eventIsInputEvent(event)) {
            return;
        }
        event.preventDefault();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackBlock, deps: [{ token: ClrStackBlock, optional: true, skipSelf: true }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrStackBlock, isStandalone: false, selector: "clr-stack-block", inputs: { expanded: ["clrSbExpanded", "expanded"], expandable: ["clrSbExpandable", "expandable"], ariaLevel: ["clrStackViewLevel", "ariaLevel"], setChangedValue: ["clrSbNotifyChange", "setChangedValue"] }, outputs: { expandedChange: "clrSbExpandedChange" }, host: { properties: { "class.stack-block": "true", "attr.role": "ariaLevel ? 'heading' : null", "attr.aria-level": "ariaLevel ? ariaLevel : null", "class.stack-block-expanded": "this.expanded", "class.stack-block-expandable": "this.expandable", "class.stack-block-changed": "this.getChangedValue", "class.on-focus": "this.onStackLabelFocus" } }, queries: [{ propertyName: "stackBlockTitle", first: true, predicate: ClrStackViewLabel, descendants: true }], ngImport: i0, template: `
    <!-- The 'preventDefault' for the space keydown event prevents the page
    from scrolling when a stack block is toggled via the space key. -->
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
      <cds-icon shape="angle" class="stack-block-caret" [direction]="caretDirection"></cds-icon>
      @if (getChangedValue) {
        <span class="clr-sr-only">{{ commonStrings.keys.stackViewChanged }}</span>
      }
      <div class="stack-view-key">
        <!-- This structure changed to fix #3567 and the a11y request was to move away from dl's -->
        <!-- I added the key class to update css targets for the original component style -->
        <ng-content select="clr-stack-label"></ng-content>
      </div>
      <div class="stack-block-content">
        <ng-content></ng-content>
      </div>
    </div>

    <clr-expandable-animation [clrExpandTrigger]="expanded" class="stack-children">
      @if (expanded) {
        <div
          [style.height]="expanded ? 'auto' : 0"
          role="region"
          [attr.id]="getStackChildrenId()"
          [attr.aria-labelledby]="labelledById"
        >
          <ng-content select="clr-stack-block"></ng-content>
        </div>
      }
    </clr-expandable-animation>
  `, isInline: true, styles: [":host{display:block}\n"], dependencies: [{ kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i1.ClrExpandableAnimation, selector: "clr-expandable-animation", inputs: ["clrExpandTrigger"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackBlock, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stack-block', template: `
    <!-- The 'preventDefault' for the space keydown event prevents the page
    from scrolling when a stack block is toggled via the space key. -->
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
      <cds-icon shape="angle" class="stack-block-caret" [direction]="caretDirection"></cds-icon>
      @if (getChangedValue) {
        <span class="clr-sr-only">{{ commonStrings.keys.stackViewChanged }}</span>
      }
      <div class="stack-view-key">
        <!-- This structure changed to fix #3567 and the a11y request was to move away from dl's -->
        <!-- I added the key class to update css targets for the original component style -->
        <ng-content select="clr-stack-label"></ng-content>
      </div>
      <div class="stack-block-content">
        <ng-content></ng-content>
      </div>
    </div>

    <clr-expandable-animation [clrExpandTrigger]="expanded" class="stack-children">
      @if (expanded) {
        <div
          [style.height]="expanded ? 'auto' : 0"
          role="region"
          [attr.id]="getStackChildrenId()"
          [attr.aria-labelledby]="labelledById"
        >
          <ng-content select="clr-stack-block"></ng-content>
        </div>
      }
    </clr-expandable-animation>
  `, host: {
                        '[class.stack-block]': 'true',
                        '[attr.role]': "ariaLevel ? 'heading' : null",
                        '[attr.aria-level]': 'ariaLevel ? ariaLevel : null',
                    }, standalone: false, styles: [":host{display:block}\n"] }]
        }], ctorParameters: () => [{ type: ClrStackBlock, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i1.ClrCommonStringsService }], propDecorators: { expanded: [{
                type: Input,
                args: ['clrSbExpanded']
            }, {
                type: HostBinding,
                args: ['class.stack-block-expanded']
            }], expandable: [{
                type: Input,
                args: ['clrSbExpandable']
            }, {
                type: HostBinding,
                args: ['class.stack-block-expandable']
            }], ariaLevel: [{
                type: Input,
                args: ['clrStackViewLevel']
            }], expandedChange: [{
                type: Output,
                args: ['clrSbExpandedChange']
            }], stackBlockTitle: [{
                type: ContentChild,
                args: [ClrStackViewLabel]
            }], setChangedValue: [{
                type: Input,
                args: ['clrSbNotifyChange']
            }], getChangedValue: [{
                type: HostBinding,
                args: ['class.stack-block-changed']
            }], onStackLabelFocus: [{
                type: HostBinding,
                args: ['class.on-focus']
            }] } });
function eventIsInputEvent(event) {
    const targetElement = event?.target;
    return targetElement?.tagName
        ? ['INPUT', 'TEXTAREA', 'BUTTON', 'A', 'SELECT', 'OPTION'].includes(targetElement.tagName)
        : false;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStackContentInput {
    constructor() {
        this.uniqueId = uniqueIdFactory();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackContentInput, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrStackContentInput, isStandalone: false, selector: "[clrStackInput]", host: { properties: { "class.clr-input": "true", "attr.aria-labelledby": "uniqueId" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackContentInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStackInput]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[attr.aria-labelledby]': 'uniqueId',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_STACK_VIEW_DIRECTIVES = [
    ClrStackView,
    ClrStackHeader,
    ClrStackBlock,
    ClrStackContentInput,
    ClrStackViewLabel,
    ClrStackViewCustomTags,
];
class ClrStackViewModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewModule, declarations: [ClrStackView,
            ClrStackHeader,
            ClrStackBlock,
            ClrStackContentInput,
            ClrStackViewLabel,
            ClrStackViewCustomTags], imports: [CommonModule, FormsModule, ClrIcon, ClrExpandableAnimationModule], exports: [ClrStackView,
            ClrStackHeader,
            ClrStackBlock,
            ClrStackContentInput,
            ClrStackViewLabel,
            ClrStackViewCustomTags] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewModule, imports: [CommonModule, FormsModule, ClrIcon, ClrExpandableAnimationModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrStackViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIcon, ClrExpandableAnimationModule],
                    declarations: [CLR_STACK_VIEW_DIRECTIVES],
                    exports: [CLR_STACK_VIEW_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_STACK_VIEW_DIRECTIVES, ClrStackBlock, ClrStackContentInput, ClrStackHeader, ClrStackView, ClrStackViewCustomTags, ClrStackViewLabel, ClrStackViewModule };
//# sourceMappingURL=clr-angular-data-stack-view.mjs.map
