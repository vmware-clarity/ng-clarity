import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
import * as i0 from "@angular/core";
export declare class ClrLoadingButton implements LoadingListener {
    el: ElementRef<HTMLButtonElement>;
    private renderer;
    disabled: boolean;
    clrLoadingChange: EventEmitter<ClrLoadingState>;
    buttonState: typeof ClrLoadingState;
    state: ClrLoadingState;
    constructor(el: ElementRef<HTMLButtonElement>, renderer: Renderer2);
    loadingStateChange(state: ClrLoadingState): void;
    private setExplicitButtonWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoadingButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrLoadingButton, "button[clrLoading]", never, { "disabled": "disabled"; }, { "clrLoadingChange": "clrLoadingChange"; }, never, ["*"], false, never>;
}
