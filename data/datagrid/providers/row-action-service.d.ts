export declare class RowActionService {
    private actionableCount;
    /**
     * false means no rows with action
     */
    get hasActionableRow(): boolean;
    register(): void;
    unregister(): void;
}
