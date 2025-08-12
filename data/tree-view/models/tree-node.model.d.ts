import { BehaviorSubject } from 'rxjs';
import { ClrSelectedState } from './selected-state.enum';
export declare abstract class TreeNodeModel<T> {
    nodeId: string;
    expanded: boolean;
    model: T | null;
    textContent: string;
    loading$: BehaviorSubject<boolean>;
    selected: BehaviorSubject<ClrSelectedState>;
    private _loading;
    private _disabled;
    abstract parent: TreeNodeModel<T> | null;
    abstract children: TreeNodeModel<T>[];
    get loading(): boolean;
    set loading(isLoading: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    destroy(): void;
    setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean): void;
    toggleSelection(propagate: boolean): void;
    _updateSelectionFromChildren(): void;
    private computeSelectionStateFromChildren;
}
