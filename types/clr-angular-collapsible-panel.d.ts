import * as i0 from '@angular/core';
import { OnInit, ChangeDetectorRef, EventEmitter, SimpleChanges } from '@angular/core';
import { IfExpandService } from '@clr/angular/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _angular_animations from '@angular/animations';

declare class CollapsiblePanelModel {
    id: string;
    groupId: number | string;
    index: number;
    disabled: boolean;
    open: boolean;
    templateId: string;
    constructor(id: string, groupId: number | string);
}
declare class CollapsiblePanelGroupModel {
    protected panelGroupCount: number;
    protected _panels: {
        [id: string]: CollapsiblePanelModel;
    };
    get panels(): CollapsiblePanelModel[];
    updatePanelOrder(ids: string[]): void;
    addPanel(id: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled: boolean): void;
    private removeOldPanels;
}

declare class CollapsiblePanelService {
    protected panelGroup: CollapsiblePanelGroupModel;
    protected readonly _panelsChanges: BehaviorSubject<CollapsiblePanelModel[]>;
    getPanelChanges(panelId: string): Observable<CollapsiblePanelModel>;
    addPanel(panelId: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    protected emitUpdatedPanels(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollapsiblePanelService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CollapsiblePanelService>;
}

declare abstract class CollapsiblePanel implements OnInit {
    protected panelService: CollapsiblePanelService;
    protected ifExpandService: IfExpandService;
    protected cdr: ChangeDetectorRef;
    panelOpen: boolean;
    panelOpenChange: EventEmitter<boolean>;
    panel: Observable<CollapsiblePanelModel>;
    protected _panelIndex: number;
    private _id;
    constructor(panelService: CollapsiblePanelService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(value: string);
    abstract get disabled(): boolean;
    ngOnInit(): void;
    togglePanel(): void;
    collapsePanelOnAnimationDone(panel: CollapsiblePanelModel): void;
    protected handlePanelInputChanges(changes: SimpleChanges): void;
    private emitPanelChange;
    abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
    abstract getContentId(id: string): string;
    abstract getHeaderId(id: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollapsiblePanel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CollapsiblePanel, never, never, {}, {}, never, never, true, never>;
}

declare const skipInitialRenderTrigger: _angular_animations.AnimationTriggerMetadata;
declare const panelExpandTransition: _angular_animations.AnimationTransitionMetadata;
declare const panelCollapseTransition: _angular_animations.AnimationTransitionMetadata;
declare const collapsiblePanelExpandAnimation: _angular_animations.AnimationTriggerMetadata[];
declare const collapsiblePanelAnimation: _angular_animations.AnimationTriggerMetadata[];

export { CollapsiblePanel, CollapsiblePanelGroupModel, CollapsiblePanelModel, CollapsiblePanelService, collapsiblePanelAnimation, collapsiblePanelExpandAnimation, panelCollapseTransition, panelExpandTransition, skipInitialRenderTrigger };
