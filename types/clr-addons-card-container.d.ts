import * as i0 from '@angular/core';
import { Type, EmbeddedViewRef, ViewContainerRef, Renderer2, OnInit, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, DoCheck, IterableDiffers, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import * as i8 from '@angular/cdk/drag-drop';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { ZoomLevelService } from '@clr/addons/a11y';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';
import * as i4 from '@clr/addons/translate';
import * as i5 from '@clr/angular/forms/checkbox';
import * as i6 from '@clr/angular/popover/dropdown';
import * as i7 from '@angular/common';

/**
 * Interface for all needed properties
 * to render card inside Appfx card container
 */
interface AppfxCard {
    /**
     *  unique id of the Card
     */
    id: string;
    /**
     * Card component class to render.
     */
    componentClass: Type<any>;
    /**
     *  (@optional)
     *  Title of the Card to display in settings drop-down menu to show/hide
     *  If not pass then show/hide option will not be available for card
     *  (@see) appfx-container-settings
     */
    title: string;
    /**
     * (@optional)
     * Width of the card in multiple of units calculated as below -
     *
     * unitWidth * unitWidthInPixels(258px) + lengthOfGutters * unitGutterSizeInPixels(18px)
     *
     * lengthOfGutters -in between gutters are number of units - 1
     *
     * 1 unit -> 258px
     * 2 unit -> 258*2 + 18 -> 534px
     * 3 unit -> 258*3 + 18*2 -> 810px ....
     * -1 unit -> remove width of the card, can be helpful in 4x zoom
     *
     * If not provided default is 1 unit
     *
     * Note: gets applied on the .card class, keep card structure as per Clarity design
     */
    unitWidth?: number;
    /**
     *  (@optional)
     *  Height of the card in multiple of units
     *  card height is unitHeight * unitHeightInPixels(58px) + in between gutters * unitGutterSizeInPixels(18px)
     *  in between gutters are number of units - 1
     *  1 unit -> 58px
     *  5 unit -> 58*5 + 18*4 -> 362px
     *  7 unit -> 58*7 + 18*6 -> 514px ....
     *  -1 unit -> remove height of the card body, can be helpful in 4x zoom
     *
     *  If not provided default is 5 units
     *
     *  Note: gets applied on the .card-block class, keep card structure as per Clarity design
     *        if .card-footer is added, .card-footer for the appfx-card will get 50px height,
     *           in this case .card-block height will get adjusted accordingly
     *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
     *        if .card-header is added, .card-header for the appfx-card will get 50px height,
     *           in this case .card-block height will get adjusted accordingly
     *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
     *        if .card-footer and .card-header is added
     *           in this case .card-block height will get adjusted accordingly
     *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -50px -> 262px
     */
    unitHeight?: number;
    /**
     * (@optional)
     * If false then user will not able to hide the card from container settings drop down menu
     * which shows list of cards to show/hide
     *  (@see) appfx-container-settings
     */
    canHide?: boolean;
    /**
     * (@optional)
     * sends as input properties to dynamically created componentClass instance
     */
    context?: AppfxCardContext;
    /**
     * (@optional)
     * Card size in 2x zoom (zoom2x)  and in 4x zoom (zoom4x)
     */
    cardZoomSizes?: AppfxCardZoomSizes;
}
/**
 * Card context which is pass as input properties
 * to the AppfxCard componentClass
 */
interface AppfxCardContext {
    [key: string]: object;
}
/**
 * Internal properties of the card needed to
 * maintain order, display and rendering
 */
interface AppfxCardInternal extends AppfxCard {
    /**
     *  To toggle the card visibility from the Container Settings dropdown
     */
    hidden: boolean;
    /**
     *  Indicates Order of the card inside card container view
     */
    order: number;
    /**
     *  To keep get order of card from ViewContainerRef
     */
    view: EmbeddedViewRef<void>;
}
/**
 * Store to save CardContainer state information
 * e.g. card attributes order, hidden etc
 */
interface AppfxContainerPersistenceStore {
    retrieve: () => Observable<AppfxCardSettings[]>;
    save: (cardSettings: AppfxCardSettings[]) => void;
}
/**
 * Card Settings properties
 */
type AppfxCardSettings = Pick<AppfxCardInternal, 'id' | 'order' | 'hidden'>;
/**
 * Defines card size in 2x zoom (zoom2x)
 * and in 4x zoom (zoom4x).
 */
interface AppfxCardZoomSizes {
    zoom2x?: {
        unitWidth?: number;
        unitHeight?: number;
    };
    zoom4x?: {
        unitWidth?: number;
        unitHeight?: number;
    };
}

/**
 * Handles storing and retrieving of preferences/settings of the cards in container
 * like order, hidden properties of card.
 */
declare class PersistenceService {
    private containerStore;
    private appfxCardSettings;
    initialize(containerStore: AppfxContainerPersistenceStore): void;
    retrieve(): Observable<AppfxCardSettings[]>;
    save(cards: AppfxCardInternal[]): void;
    /**
     * Generate Card Settings.
     */
    private generateCardSettings;
    /**
     * If cardSettings are preset in the persistence store then update them with provided info and use them
     * else add it to store if new card settings.
     */
    private mergeCardSettings;
    static ɵfac: i0.ɵɵFactoryDeclaration<PersistenceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PersistenceService>;
}

/**
 * Keep track of the cards in the container with their properties like order, hidden etc.
 * Takes care of updating store with the card preferences.
 */
declare class ContainerService {
    private persistenceService;
    private cardContainer;
    private containerCards;
    constructor(persistenceService: PersistenceService);
    /**
     * Initialize container service by adding list of cards and persistence service instance.
     */
    initialize(cardContainer: ViewContainerRef, cards: AppfxCardInternal[]): void;
    /**
     * Fetches card order, hidden properties from the persistence service and apply it to card.
     * Filters hidden card, sorts cards according to order and remove duplicate order cards.
     */
    getCardsWithOrder(): Observable<AppfxCardInternal[]>;
    /**
     * Fetches card order, hidden properties from the persistence service and apply it to card.
     * if card is hidden before filters it accordingly so that container will not insert it.
     */
    getCardWithOrder(card: AppfxCardInternal): Observable<AppfxCardInternal>;
    /**
     * Toggles card hidden property and save updated settings in store.
     */
    toggleCardVisibility(cardId: string): AppfxCardInternal | undefined;
    /**
     * Moves the card from Drag Index to Drop Index
     * by detaching card from view at drag Index and inserting it into Drop Index.
     *
     * Updates the order of the remaining cards once done.
     */
    moveCard(fromIndex: number, toIndex: number): void;
    /**
     * Removes card form the list of container cards.
     */
    removeCard(cardId: string): void;
    /**
     * Update Card properties once inserted into container.
     * View and order gets updated once card is available into container.
     */
    updateCard(card: AppfxCardInternal): void;
    /**
     * Returns all cards inside container including hidden cards.
     */
    getContainerCards(): AppfxCardInternal[];
    /**
     * Returns number of visible cards in the container.
     */
    getVisibleCardsCount(): number;
    /**
     * Update the order on the cards after shuffling occurs new order is as per the index of cards in the view.
     */
    updateCardsOrder(): void;
    /**
     * Returns container ViewRef
     */
    getCardContainer(): ViewContainerRef;
    /**
     * Provides card by id if available
     */
    getCardById(cardId: string): AppfxCardInternal | undefined;
    /**
     * provides order of the card in the container
     */
    getCardOrder(cardId: string): number;
    /**
     * Adds card to the container list of cards of the container service.
     * Container cards contains all the available cards within container visible as well as hidden.
     */
    addCard(card: AppfxCardInternal): void;
    /**
     * Updates each of the card settings properties like order, hidden.
     */
    private applySettingsToCards;
    /**
     * Updates card settings properties like order, hidden.
     * If none available in the persistence store cardDefaults are used.
     */
    private applyCardSettings;
    /**
     * Remove hidden cards
     */
    private filterHiddenCards;
    /**
     * Sorts cards in ascending order
     */
    private sortCardsByOrder;
    /**
     * Update order to remove duplicates.
     * [0,1,1,2,3,3] -> [0,1,2,3,4,5]
     */
    private normalizeCardOrder;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContainerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContainerService>;
}

/**
 * Provides functionality to drag and drop cards with keyboard interaction
 */
declare class A11yService {
    private containerService;
    private a11yMode;
    private a11yDragOrder;
    private a11yDropOrder;
    constructor(containerService: ContainerService);
    /**
     * Selects the card on press of Enter Key
     * If it is first enter on the card container - updates the drag order
     * Else moves the card from drag order to drop order
     */
    selectCard(cardId: string): void;
    /**
     * Moves the drop position on Arrow Keys
     * Updates the drop placeholder according to the arrow key direction
     */
    moveDropPosition(arrowKey: string): void;
    /**
     * Get out of the Accessibility mode
     */
    getOutOfA11yMode(): void;
    /**
     * checks if cardOrder is equal to a11yDragOrder
     */
    isSelected(cardId: string): boolean;
    /**
     * checks if cardOrder is equal to a11yDropOrder
     */
    isDraggableOver(cardId: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<A11yService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<A11yService>;
}

/**
 * Provides functionality to drag and drop cards with clr drag drop directives.
 */
declare class DragDropService {
    private containerService;
    private dragOrder;
    constructor(containerService: ContainerService);
    /**
     * Saves the order of drag order to plate at the drop order later.
     */
    onDragStart(cardId: string): void;
    /**
     * On drop move the cards from drag order to drop order.
     */
    onDragDrop(cardId: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DragDropService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DragDropService>;
}

/**
 * Provides functionality related to layout of cards like updating card sizes
 * adding scrolling inside card block depending on conditions
 */
declare class LayoutService {
    private renderer;
    constructor(renderer: Renderer2);
    /**
     * Updates the size of the cards according to the info provided
     */
    updateCardSize(element: HTMLElement, unitWidth?: number, unitHeight?: number): void;
    /**
     * card width is unitWidth * unitWidthInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
     * in between gutters are number of units - 1
     * 1 unit -> 258px
     * 2 unit -> 258*2 + 18 -> 534px
     * 3 unit -> 258*3 + 18*2 -> 810px ....
     * @param unitWidth
     */
    private calculateCardWidth;
    /**
     * card height is unitHeight * unitHeightInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
     * in between gutters are number of units - 1
     * 1 unit -> 58px
     * 5 unit -> 58*5 + 18*4 -> 362px
     * 7 unit -> 58*7 + 18*6 -> 514px ....
     * @param unitHeight
     */
    private calculateCardHeight;
    static ɵfac: i0.ɵɵFactoryDeclaration<LayoutService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LayoutService>;
}

/**
 * Appfx Container Card
 * Handles user interactions like drag and drop and a11y support for same through keyboard events
 *
 * Used internally in Appfx Card Container @see(AppfxCardContainer)
 */
declare class AppfxCardComponent implements OnInit, AfterViewInit, OnDestroy {
    private el;
    private groupService;
    private layoutService;
    private dragDropService;
    private a11yService;
    private changeDetector;
    private zoomLevelService;
    /**
     * The descriptor of the step being rendered.
     */
    card: AppfxCardInternal;
    /**
     * Specifics which dropGroup card belongs to as card drop should happen within specific container
     * used to distinguish drag and drop cards from multiple containers
     */
    dropGroup: string;
    readonly dropList: CdkDropList;
    dragDropEnabled: boolean;
    private cdkDragElementRefs;
    private cardViewContainer;
    private currentUnitWidth;
    private currentUnitHeight;
    private subscriptions;
    constructor(el: ElementRef, groupService: DragAndDropGroupService, layoutService: LayoutService, dragDropService: DragDropService, a11yService: A11yService, changeDetector: ChangeDetectorRef, zoomLevelService: ZoomLevelService);
    get isSelected(): boolean;
    get isDraggableOver(): boolean;
    get cdkDropGroup(): CdkDropList[];
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onDragStart(): void;
    onDrop(): void;
    selectCard(event: Event): void;
    moveDropPositionBackwards(event: Event): void;
    moveDropPositionForwards(event: Event): void;
    onDropHandleKeyUp(event: Event): void;
    private loadComponent;
    private eventCheck;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxCardComponent, [null, null, null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppfxCardComponent, "appfx-card", never, { "card": { "alias": "card"; "required": false; }; "dropGroup": { "alias": "dropGroup"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * Appfx Card Container
 *
 * Provides container for cards with below functionalities
 * - Dynamic card insertion and removal
 * - Show/Hide cards through settings menu
 * - Drag an Drop Cards to change order
 * - Keyboard a11y events handling
 * - Card order and hidden property persistence
 *
 *  @Usages
 *  <appfx-card-container
 *     [containerId]="example-container"
 *     [cards]="container cards"
 *     [persistenceStore]="AppfxContainerPersistenceStore"> // optional if none provided local storage is used
 *  </<appfx-card-container>
 */
declare class AppfxCardContainerComponent implements OnInit, DoCheck {
    private containerService;
    private persistenceService;
    private iterableDiffers;
    containerId: string;
    cards: AppfxCardInternal[];
    persistenceStore?: AppfxContainerPersistenceStore;
    showCardContainerSettings: boolean;
    dragDropEnabled: boolean;
    containerCards: AppfxCardInternal[];
    private cardContainer;
    private readonly differ;
    constructor(containerService: ContainerService, persistenceService: PersistenceService, iterableDiffers: IterableDiffers);
    ngOnInit(): void;
    ngDoCheck(): void;
    onToggleCardVisibility(cardId: string): void;
    private initialize;
    private addDynamicCard;
    private insertCardToContainer;
    private removeCardFromContainer;
    private updateContainerCards;
    private trackByFn;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxCardContainerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppfxCardContainerComponent, "appfx-card-container", never, { "containerId": { "alias": "containerId"; "required": false; }; "cards": { "alias": "cards"; "required": false; }; "persistenceStore": { "alias": "persistenceStore"; "required": false; }; "showCardContainerSettings": { "alias": "showCardContainerSettings"; "required": false; }; "dragDropEnabled": { "alias": "dragDropEnabled"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * Component to display container settings menu to show/hide cards.
 * Shows card list alphabetically according to title with checkboxes.
 */
declare class AppfxCardContainerSettingsComponent {
    cards: AppfxCardInternal[];
    /**
     * Event Emitter when user wants to show/hide card.
     */
    toggleCardVisibility: EventEmitter<string>;
    constructor();
    /**
     * Cards list to display in settings dropdown menu.
     */
    set containerCards(cards: AppfxCardInternal[]);
    /**
     * Show/hide Card
     */
    toggleShowHide(card: AppfxCardInternal): void;
    trackByFn(index: number, item: AppfxCardInternal): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxCardContainerSettingsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AppfxCardContainerSettingsComponent, "appfx-card-container-settings", never, { "containerCards": { "alias": "containerCards"; "required": false; }; }, { "toggleCardVisibility": "toggleCardVisibility"; }, never, never, false, never>;
}

/**
 * AppFx Card Container module
 * declaration and exports of needed components
 */
declare class AppfxCardContainerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxCardContainerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxCardContainerModule, [typeof AppfxCardComponent, typeof AppfxCardContainerComponent, typeof AppfxCardContainerSettingsComponent], [typeof i4.AppfxTranslateModule, typeof i5.ClrCheckboxModule, typeof i6.ClrDropdownModule, typeof i7.CommonModule, typeof i8.DragDropModule], [typeof AppfxCardComponent, typeof AppfxCardContainerComponent, typeof AppfxCardContainerSettingsComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxCardContainerModule>;
}

export { AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerModule, AppfxCardContainerSettingsComponent };
export type { AppfxCard, AppfxCardSettings, AppfxContainerPersistenceStore };
