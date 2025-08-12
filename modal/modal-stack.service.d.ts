import * as i0 from "@angular/core";
export interface Closable {
    close(): void;
}
export declare class ModalStackService {
    private readonly platformId;
    private readonly modalStack;
    private readonly keyUpEventListener;
    constructor(platformId: unknown);
    trackModalOpen(openedModal: Closable): void;
    trackModalClose(closedModal: Closable): void;
    private onKeyUp;
    static ɵfac: i0.ɵɵFactoryDeclaration<ModalStackService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ModalStackService>;
}
