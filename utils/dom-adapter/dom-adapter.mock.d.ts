import { DomAdapter } from './dom-adapter';
export declare class MockDomAdapter extends DomAdapter {
    _userDefinedWidth: number;
    _scrollBarWidth: number;
    _scrollWidth: number;
    _computedHeight: number;
    userDefinedWidth(_element: any): number;
    scrollBarWidth(_element: any): number;
    scrollWidth(_element: any): number;
    computedHeight(_element: any): number;
}
export declare const MOCK_DOM_ADAPTER_PROVIDER: {
    provide: typeof DomAdapter;
    useClass: typeof MockDomAdapter;
};
