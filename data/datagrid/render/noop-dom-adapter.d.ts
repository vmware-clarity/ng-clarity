import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import * as i0 from "@angular/core";
export declare class NoopDomAdapter implements DomAdapter {
    userDefinedWidth(_element: any): number;
    scrollBarWidth(_element: any): number;
    scrollWidth(_element: any): number;
    computedHeight(_element: any): number;
    clientRect(_element: any): DOMRect;
    minWidth(_element: any): number;
    focus(_element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NoopDomAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NoopDomAdapter>;
}
