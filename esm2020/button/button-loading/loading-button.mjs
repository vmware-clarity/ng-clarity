/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
// minimum width to fit loading spinner
const MIN_BUTTON_WIDTH = 42;
export class ClrLoadingButton {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.clrLoadingChange = new EventEmitter(false);
        this.buttonState = ClrLoadingState;
        this.state = ClrLoadingState.DEFAULT;
    }
    loadingStateChange(state) {
        if (state === this.state) {
            return;
        }
        this.state = state;
        switch (state) {
            case ClrLoadingState.DEFAULT:
                this.renderer.removeStyle(this.el.nativeElement, 'width');
                this.renderer.removeStyle(this.el.nativeElement, 'transform'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
                if (!this.disabled) {
                    this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
                }
                break;
            case ClrLoadingState.LOADING:
                this.setExplicitButtonWidth();
                this.renderer.setStyle(this.el.nativeElement, 'transform', 'translatez(0)'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
                this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
                break;
            case ClrLoadingState.SUCCESS:
                this.setExplicitButtonWidth();
                break;
            case ClrLoadingState.ERROR:
                this.loadingStateChange(ClrLoadingState.DEFAULT);
                break;
            default:
                break;
        }
        this.clrLoadingChange.emit(state);
    }
    setExplicitButtonWidth() {
        if (this.el.nativeElement && this.el.nativeElement.getBoundingClientRect) {
            const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
            const width = Math.max(MIN_BUTTON_WIDTH, boundingClientRect.width);
            this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
        }
    }
}
ClrLoadingButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButton, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
ClrLoadingButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrLoadingButton, selector: "button[clrLoading]", inputs: { disabled: "disabled" }, outputs: { clrLoadingChange: "clrLoadingChange" }, host: { properties: { "attr.disabled": "disabled? '' : null" } }, providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }], ngImport: i0, template: `
    <span @parent [ngSwitch]="state">
      <ng-container *ngSwitchCase="buttonState.LOADING">
        <span @spinner class="spinner spinner-inline"></span>
      </ng-container>
      <ng-container *ngSwitchCase="buttonState.SUCCESS">
        <span
          @validated
          (@validated.done)="this.loadingStateChange(this.buttonState.DEFAULT)"
          class="spinner spinner-inline spinner-check"
        ></span>
      </ng-container>
      <span *ngSwitchCase="buttonState.DEFAULT" @defaultButton class="clr-loading-btn-content">
        <ng-content></ng-content>
      </span>
    </span>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }], animations: [
        trigger('parent', [
            // Skip :enter animation on first render.
            // The button text/content should only be faded when transitioning to or from a non-default state.
            transition(':enter', []),
        ]),
        trigger('defaultButton', [
            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
            // TODO: see if we can get leave animation to work before spinner's enter animation
            transition(':leave', [style({ opacity: 0 })]),
        ]),
        trigger('spinner', [
            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
        ]),
        trigger('validated', [
            transition(':enter', [
                animate('600ms', keyframes([
                    style({ transform: 'scale(0,0)', offset: 0 }),
                    style({ opacity: 1, offset: 0.2 }),
                    style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
                    style({ transform: 'scale(.9,.9)', offset: 0.6 }),
                    style({ transform: 'scale(1,1)', offset: 1 }),
                ])),
            ]),
            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrLoadingButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'button[clrLoading]',
                    template: `
    <span @parent [ngSwitch]="state">
      <ng-container *ngSwitchCase="buttonState.LOADING">
        <span @spinner class="spinner spinner-inline"></span>
      </ng-container>
      <ng-container *ngSwitchCase="buttonState.SUCCESS">
        <span
          @validated
          (@validated.done)="this.loadingStateChange(this.buttonState.DEFAULT)"
          class="spinner spinner-inline spinner-check"
        ></span>
      </ng-container>
      <span *ngSwitchCase="buttonState.DEFAULT" @defaultButton class="clr-loading-btn-content">
        <ng-content></ng-content>
      </span>
    </span>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }],
                    animations: [
                        trigger('parent', [
                            // Skip :enter animation on first render.
                            // The button text/content should only be faded when transitioning to or from a non-default state.
                            transition(':enter', []),
                        ]),
                        trigger('defaultButton', [
                            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                            // TODO: see if we can get leave animation to work before spinner's enter animation
                            transition(':leave', [style({ opacity: 0 })]),
                        ]),
                        trigger('spinner', [
                            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
                        ]),
                        trigger('validated', [
                            transition(':enter', [
                                animate('600ms', keyframes([
                                    style({ transform: 'scale(0,0)', offset: 0 }),
                                    style({ opacity: 1, offset: 0.2 }),
                                    style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
                                    style({ transform: 'scale(.9,.9)', offset: 0.6 }),
                                    style({ transform: 'scale(1,1)', offset: 1 }),
                                ])),
                            ]),
                            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
                        ]),
                    ],
                    host: { '[attr.disabled]': "disabled? '' : null" },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { disabled: [{
                type: Input,
                args: ['disabled']
            }], clrLoadingChange: [{
                type: Output,
                args: ['clrLoadingChange']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9idXR0b24vYnV0dG9uLWxvYWRpbmcvbG9hZGluZy1idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7O0FBRXZFLHVDQUF1QztBQUN2QyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQXVENUIsTUFBTSxPQUFPLGdCQUFnQjtJQVEzQixZQUFtQixFQUFpQyxFQUFVLFFBQW1CO1FBQTlELE9BQUUsR0FBRixFQUFFLENBQStCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUxyRCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksQ0FBa0IsS0FBSyxDQUFDLENBQUM7UUFFeEYsZ0JBQVcsR0FBRyxlQUFlLENBQUM7UUFDOUIsVUFBSyxHQUFvQixlQUFlLENBQUMsT0FBTyxDQUFDO0lBRW1DLENBQUM7SUFFckYsa0JBQWtCLENBQUMsS0FBc0I7UUFDdkMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN4QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssZUFBZSxDQUFDLE9BQU87Z0JBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElB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Q0FDTCxPQUFPLEVBQ1AsU0FBUyxDQUFDO29DQUNSLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO29DQUM3QyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztvQ0FDbEMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztvQ0FDbkQsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7b0NBQ2pELEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lDQUM5QyxDQUFDLENBQ0g7NkJBQ0YsQ0FBQzs0QkFDRixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDaEcsQ0FBQztxQkFDSDtvQkFDRCxJQUFJLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRTtpQkFDbkQ7eUhBRW9CLFFBQVE7c0JBQTFCLEtBQUs7dUJBQUMsVUFBVTtnQkFFVyxnQkFBZ0I7c0JBQTNDLE1BQU07dUJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBhbmltYXRlLCBrZXlmcmFtZXMsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckxvYWRpbmdTdGF0ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2xvYWRpbmcvbG9hZGluZyc7XG5pbXBvcnQgeyBMb2FkaW5nTGlzdGVuZXIgfSBmcm9tICcuLi8uLi91dGlscy9sb2FkaW5nL2xvYWRpbmctbGlzdGVuZXInO1xuXG4vLyBtaW5pbXVtIHdpZHRoIHRvIGZpdCBsb2FkaW5nIHNwaW5uZXJcbmNvbnN0IE1JTl9CVVRUT05fV0lEVEggPSA0MjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYnV0dG9uW2NsckxvYWRpbmddJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiBAcGFyZW50IFtuZ1N3aXRjaF09XCJzdGF0ZVwiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiYnV0dG9uU3RhdGUuTE9BRElOR1wiPlxuICAgICAgICA8c3BhbiBAc3Bpbm5lciBjbGFzcz1cInNwaW5uZXIgc3Bpbm5lci1pbmxpbmVcIj48L3NwYW4+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoQ2FzZT1cImJ1dHRvblN0YXRlLlNVQ0NFU1NcIj5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBAdmFsaWRhdGVkXG4gICAgICAgICAgKEB2YWxpZGF0ZWQuZG9uZSk9XCJ0aGlzLmxvYWRpbmdTdGF0ZUNoYW5nZSh0aGlzLmJ1dHRvblN0YXRlLkRFRkFVTFQpXCJcbiAgICAgICAgICBjbGFzcz1cInNwaW5uZXIgc3Bpbm5lci1pbmxpbmUgc3Bpbm5lci1jaGVja1wiXG4gICAgICAgID48L3NwYW4+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxzcGFuICpuZ1N3aXRjaENhc2U9XCJidXR0b25TdGF0ZS5ERUZBVUxUXCIgQGRlZmF1bHRCdXR0b24gY2xhc3M9XCJjbHItbG9hZGluZy1idG4tY29udGVudFwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L3NwYW4+XG4gICAgPC9zcGFuPlxuICBgLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IExvYWRpbmdMaXN0ZW5lciwgdXNlRXhpc3Rpbmc6IENsckxvYWRpbmdCdXR0b24gfV0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdwYXJlbnQnLCBbXG4gICAgICAvLyBTa2lwIDplbnRlciBhbmltYXRpb24gb24gZmlyc3QgcmVuZGVyLlxuICAgICAgLy8gVGhlIGJ1dHRvbiB0ZXh0L2NvbnRlbnQgc2hvdWxkIG9ubHkgYmUgZmFkZWQgd2hlbiB0cmFuc2l0aW9uaW5nIHRvIG9yIGZyb20gYSBub24tZGVmYXVsdCBzdGF0ZS5cbiAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtdKSxcbiAgICBdKSxcbiAgICB0cmlnZ2VyKCdkZWZhdWx0QnV0dG9uJywgW1xuICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgW3N0eWxlKHsgb3BhY2l0eTogMCB9KSwgYW5pbWF0ZSgnMjAwbXMgMTAwbXMgZWFzZS1pbicsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSldKSxcbiAgICAgIC8vIFRPRE86IHNlZSBpZiB3ZSBjYW4gZ2V0IGxlYXZlIGFuaW1hdGlvbiB0byB3b3JrIGJlZm9yZSBzcGlubmVyJ3MgZW50ZXIgYW5pbWF0aW9uXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbc3R5bGUoeyBvcGFjaXR5OiAwIH0pXSksXG4gICAgXSksXG4gICAgdHJpZ2dlcignc3Bpbm5lcicsIFtcbiAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtzdHlsZSh7IG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoJzIwMG1zIDEwMG1zIGVhc2UtaW4nLCBzdHlsZSh7IG9wYWNpdHk6IDEgfSkpXSksXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbc3R5bGUoeyBvcGFjaXR5OiAxIH0pLCBhbmltYXRlKCcxMDBtcyBlYXNlLW91dCcsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSldKSxcbiAgICBdKSxcbiAgICB0cmlnZ2VyKCd2YWxpZGF0ZWQnLCBbXG4gICAgICB0cmFuc2l0aW9uKCc6ZW50ZXInLCBbXG4gICAgICAgIGFuaW1hdGUoXG4gICAgICAgICAgJzYwMG1zJyxcbiAgICAgICAgICBrZXlmcmFtZXMoW1xuICAgICAgICAgICAgc3R5bGUoeyB0cmFuc2Zvcm06ICdzY2FsZSgwLDApJywgb2Zmc2V0OiAwIH0pLFxuICAgICAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAxLCBvZmZzZXQ6IDAuMiB9KSxcbiAgICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAnc2NhbGUoMS4yLDEuMiknLCBvZmZzZXQ6IDAuNCB9KSxcbiAgICAgICAgICAgIHN0eWxlKHsgdHJhbnNmb3JtOiAnc2NhbGUoLjksLjkpJywgb2Zmc2V0OiAwLjYgfSksXG4gICAgICAgICAgICBzdHlsZSh7IHRyYW5zZm9ybTogJ3NjYWxlKDEsMSknLCBvZmZzZXQ6IDEgfSksXG4gICAgICAgICAgXSlcbiAgICAgICAgKSxcbiAgICAgIF0pLFxuICAgICAgdHJhbnNpdGlvbignOmxlYXZlJywgW3N0eWxlKHsgb3BhY2l0eTogMSB9KSwgYW5pbWF0ZSgnMTAwbXMgZWFzZS1vdXQnLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXSksXG4gICAgXSksXG4gIF0sXG4gIGhvc3Q6IHsgJ1thdHRyLmRpc2FibGVkXSc6IFwiZGlzYWJsZWQ/ICcnIDogbnVsbFwiIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckxvYWRpbmdCdXR0b24gaW1wbGVtZW50cyBMb2FkaW5nTGlzdGVuZXIge1xuICBASW5wdXQoJ2Rpc2FibGVkJykgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgQE91dHB1dCgnY2xyTG9hZGluZ0NoYW5nZScpIGNsckxvYWRpbmdDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENsckxvYWRpbmdTdGF0ZT4oZmFsc2UpO1xuXG4gIGJ1dHRvblN0YXRlID0gQ2xyTG9hZGluZ1N0YXRlO1xuICBzdGF0ZTogQ2xyTG9hZGluZ1N0YXRlID0gQ2xyTG9hZGluZ1N0YXRlLkRFRkFVTFQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmPEhUTUxCdXR0b25FbGVtZW50PiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIGxvYWRpbmdTdGF0ZUNoYW5nZShzdGF0ZTogQ2xyTG9hZGluZ1N0YXRlKTogdm9pZCB7XG4gICAgaWYgKHN0YXRlID09PSB0aGlzLnN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcblxuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgIGNhc2UgQ2xyTG9hZGluZ1N0YXRlLkRFRkFVTFQ6XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nKTsgLy8gZm9yIGNocm9taXVtIHJlbmRlciBidWcgc2VlIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS92bXdhcmUvY2xhcml0eS9pc3N1ZXMvMjcwMFxuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDbHJMb2FkaW5nU3RhdGUuTE9BRElORzpcbiAgICAgICAgdGhpcy5zZXRFeHBsaWNpdEJ1dHRvbldpZHRoKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZXooMCknKTsgLy8gZm9yIGNocm9taXVtIHJlbmRlciBidWcgc2VlIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS92bXdhcmUvY2xhcml0eS9pc3N1ZXMvMjcwMFxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsICcnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsckxvYWRpbmdTdGF0ZS5TVUNDRVNTOlxuICAgICAgICB0aGlzLnNldEV4cGxpY2l0QnV0dG9uV2lkdGgoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsckxvYWRpbmdTdGF0ZS5FUlJPUjpcbiAgICAgICAgdGhpcy5sb2FkaW5nU3RhdGVDaGFuZ2UoQ2xyTG9hZGluZ1N0YXRlLkRFRkFVTFQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLmNsckxvYWRpbmdDaGFuZ2UuZW1pdChzdGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIHNldEV4cGxpY2l0QnV0dG9uV2lkdGgoKSB7XG4gICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudCAmJiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICBjb25zdCBib3VuZGluZ0NsaWVudFJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWF4KE1JTl9CVVRUT05fV0lEVEgsIGJvdW5kaW5nQ2xpZW50UmVjdC53aWR0aCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgYCR7d2lkdGh9cHhgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==