import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';
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
}
