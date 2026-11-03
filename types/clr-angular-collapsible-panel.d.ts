import * as i0 from '@angular/core';
import { OnInit, ChangeDetectorRef, EventEmitter, AnimationCallbackEvent, SimpleChanges } from '@angular/core';
import { IfExpandService, ClrAnimationTriggerMetadata, ClrAnimationTransitionMetadata } from '@clr/angular/utils';
import { BehaviorSubject, Observable } from 'rxjs';

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
    /**
     * Set to `true` to collapse the content of a closing panel: the template keeps the content while `contentCollapsing`
     * is set, and the projected content is removed once the content is collapsed.
     */
    protected animatesCollapse: boolean;
    /** Set while the content of a closing panel collapses. */
    protected contentCollapsing: boolean;
    private _id;
    private panelRendered;
    /**
     * Set when Angular animates the content, which it does not when animations are disabled or on the server, and when
     * the application uses Noop animations.
     */
    private collapsibleContent;
    private readonly noopPanelAnimations;
    private readonly panelDestroyRef;
    constructor(panelService: CollapsiblePanelService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(value: string);
    abstract get disabled(): boolean;
    ngOnInit(): void;
    togglePanel(): void;
    collapsePanelOnAnimationDone(panel: CollapsiblePanelModel): void;
    /** `animate.enter` handler of the content. */
    protected expandContent(event: AnimationCallbackEvent): void;
    protected handlePanelInputChanges(changes: SimpleChanges): void;
    private emitPanelChange;
    /**
     * Not an `animate.leave` handler: Angular cancels the leave animation of an element when the same element of another
     * instance of the template enters, as the content of the next step does when a step closes.
     */
    private collapseContent;
    private removeClosedContent;
    abstract getPanelStateClasses(panel: CollapsiblePanelModel): string;
    abstract getContentId(id: string): string;
    abstract getHeaderId(id: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CollapsiblePanel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CollapsiblePanel, never, never, {}, {}, never, never, true, never>;
}

/**
 * @deprecated Clarity panels no longer use Angular animations: bind `expandContent` of `CollapsiblePanel` to the
 * `animate.enter` of the panel content instead.
 */
declare const skipInitialRenderTrigger: ClrAnimationTriggerMetadata;
/** @deprecated see {@link skipInitialRenderTrigger} */
declare const panelExpandTransition: ClrAnimationTransitionMetadata;
/** @deprecated see {@link skipInitialRenderTrigger} */
declare const panelCollapseTransition: ClrAnimationTransitionMetadata;
/** @deprecated see {@link skipInitialRenderTrigger} */
declare const collapsiblePanelExpandAnimation: ClrAnimationTriggerMetadata[];
/** @deprecated see {@link skipInitialRenderTrigger} */
declare const collapsiblePanelAnimation: ClrAnimationTriggerMetadata[];

export { CollapsiblePanel, CollapsiblePanelGroupModel, CollapsiblePanelModel, CollapsiblePanelService, collapsiblePanelAnimation, collapsiblePanelExpandAnimation, panelCollapseTransition, panelExpandTransition, skipInitialRenderTrigger };
