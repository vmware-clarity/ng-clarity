import * as i0 from "@angular/core";
export declare class RowActionService {
    private actionableCount;
    /**
     * false means no rows with action
     */
    get hasActionableRow(): boolean;
    register(): void;
    unregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RowActionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RowActionService>;
}
