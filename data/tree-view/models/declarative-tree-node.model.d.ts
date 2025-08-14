import { TreeNodeModel } from './tree-node.model';
export declare class DeclarativeTreeNodeModel<T> extends TreeNodeModel<T> {
    parent: DeclarativeTreeNodeModel<T> | null;
    children: DeclarativeTreeNodeModel<T>[];
    constructor(parent: DeclarativeTreeNodeModel<T> | null);
    destroy(): void;
    _addChild(child: DeclarativeTreeNodeModel<T>): void;
    _removeChild(child: DeclarativeTreeNodeModel<T>): void;
}
