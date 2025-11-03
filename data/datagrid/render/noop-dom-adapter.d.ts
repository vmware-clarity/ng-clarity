import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
export declare class NoopDomAdapter implements DomAdapter {
    userDefinedWidth(_element: any): number;
    scrollBarWidth(_element: any): number;
    scrollWidth(_element: any): number;
    computedHeight(_element: any): number;
    clientRect(_element: any): DOMRect;
    minWidth(_element: any): number;
    focus(_element: any): void;
}
