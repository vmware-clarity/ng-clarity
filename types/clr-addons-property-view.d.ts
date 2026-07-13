import * as i0 from '@angular/core';
import { Type, DoCheck, QueryList, ElementRef, OnInit, OnChanges, OnDestroy, SimpleChanges, ComponentFactoryResolver, ChangeDetectorRef, ViewContainerRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ZoomLevelService } from '@clr/addons/a11y';
import * as i7 from '@clr/angular/popover/dropdown';
import * as i8 from '@angular/common';

declare enum PropertyViewModelType {
    Message = "Message",
    PropertyValue = "PropertyValue",
    PropertyKey = "PropertyKey",
    Property = "Property",
    Section = "Section",
    Category = "Category",
    PropertyValueComponent = "PropertyValueComponent"
}
interface PropertyViewActionModel {
    title: string;
    isEnabled: boolean;
    clickHandler: () => void;
}
interface PropertyViewLinkModel {
    clickHandler: () => void;
}
interface PropertyViewMessageModel {
    type: PropertyViewModelType.Message;
    text: string | null;
    icon: string | null;
    renderAsHtml: boolean;
}
interface PropertyViewPropertyKeyModel {
    type: PropertyViewModelType.PropertyKey;
    text: string | null;
    icon: string | null;
}
interface PropertyViewPropertyValueModel {
    type: PropertyViewModelType.PropertyValue;
    text: string | null;
    icon: string | null;
    link: PropertyViewLinkModel | null;
}
interface PropertyViewPropertyValueComponent<T> {
    model?: T | null;
}
interface PropertyViewPropertyValueComponentModel<T> {
    type: PropertyViewModelType.PropertyValueComponent;
    componentType?: Type<PropertyViewPropertyValueComponent<T>> | null;
    componentModel?: T | null;
}
interface PropertyViewPropertyModel {
    type: PropertyViewModelType.Property;
    key: PropertyViewPropertyKeyModel;
    content: Array<PropertyViewPropertyValueModel | PropertyViewPropertyValueComponentModel<any>>;
}
interface PropertyViewSectionModel {
    type: PropertyViewModelType.Section;
    id: string;
    renderAsHtml: boolean;
    title: string | null;
    titleIcon: string | null;
    actions: Array<PropertyViewActionModel>;
    content: Array<PropertyViewPropertyModel | PropertyViewMessageModel>;
    collapseContent: boolean;
}
interface PropertyViewCategoryModel {
    type: PropertyViewModelType.Category;
    id: string;
    title: string | null;
    content: Array<PropertyViewSectionModel>;
}
interface PropertyViewModel {
    categories: Array<PropertyViewCategoryModel>;
}

declare class PropertyViewMessageBuilder {
    #private;
    private parent;
    constructor(parent: PropertyViewSectionBuilder);
    text(value: string | null): PropertyViewMessageBuilder;
    icon(value: string | null): PropertyViewMessageBuilder;
    renderAsHtml(value: boolean): PropertyViewMessageBuilder;
    build(): PropertyViewMessageModel;
    clone(parentClone: PropertyViewSectionBuilder): PropertyViewMessageBuilder;
    exit(): PropertyViewSectionBuilder;
}

declare class PropertyViewPropertyKeyBuilder {
    #private;
    private parent;
    constructor(parent: PropertyViewPropertyBuilder);
    text(value: string | null): PropertyViewPropertyKeyBuilder;
    icon(value: string | null): PropertyViewPropertyKeyBuilder;
    build(): PropertyViewPropertyKeyModel;
    clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyKeyBuilder;
    exit(): PropertyViewPropertyBuilder;
}

declare class PropertyViewPropertyValueBuilder {
    #private;
    private parent;
    constructor(parent: PropertyViewPropertyBuilder);
    text(value: string | boolean | number | null): PropertyViewPropertyValueBuilder;
    icon(value: string | null): PropertyViewPropertyValueBuilder;
    link(value: PropertyViewLinkModel | null): PropertyViewPropertyValueBuilder;
    getLink(): PropertyViewLinkModel | null;
    build(): PropertyViewPropertyValueModel;
    clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyValueBuilder;
    exit(): PropertyViewPropertyBuilder;
}

declare class PropertyViewPropertyValueComponentBuilder<T> {
    private parent;
    private componentType;
    private componentModel;
    constructor(parent: PropertyViewPropertyBuilder);
    build(): PropertyViewPropertyValueComponentModel<T>;
    component<U extends T>(componentType: Type<PropertyViewPropertyValueComponent<U>>): PropertyViewPropertyValueComponentBuilder<U>;
    model<U extends T>(componentModel: U): PropertyViewPropertyValueComponentBuilder<U>;
    clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyValueComponentBuilder<T>;
    exit(): PropertyViewPropertyBuilder;
}

declare class PropertyViewPropertyBuilder {
    #private;
    private parent;
    constructor(parent: PropertyViewSectionBuilder);
    keyBuilder(): PropertyViewPropertyKeyBuilder;
    getValueBuilders(): Array<PropertyViewPropertyValueBuilder | PropertyViewPropertyValueComponentBuilder<any>>;
    valueBuilder(): PropertyViewPropertyValueBuilder;
    valueComponentBuilder<T = any>(): PropertyViewPropertyValueComponentBuilder<T>;
    build(): PropertyViewPropertyModel;
    clone(parentClone: PropertyViewSectionBuilder): PropertyViewPropertyBuilder;
    exit(): PropertyViewSectionBuilder;
}

type PropertyValueTextItemType = string | number | boolean;
declare class PropertyViewSectionBuilder {
    #private;
    private parent;
    private id;
    private contentBuilders;
    constructor(parent: PropertyViewCategoryBuilder, id: string);
    getId(): string;
    renderAsHtml(value: boolean): PropertyViewSectionBuilder;
    collapseContent(value: boolean): PropertyViewSectionBuilder;
    title(value: string | null): PropertyViewSectionBuilder;
    titleIcon(value: string | null): PropertyViewSectionBuilder;
    action(value?: PropertyViewActionModel | null): PropertyViewSectionBuilder;
    getActions(): Array<PropertyViewActionModel>;
    propertyBuilder(): PropertyViewPropertyBuilder;
    property(key: string, values?: Array<PropertyValueTextItemType> | PropertyValueTextItemType | null): PropertyViewSectionBuilder;
    messageBuilder(): PropertyViewMessageBuilder;
    message(text: string, icon?: string | null): PropertyViewSectionBuilder;
    info(text: string): PropertyViewSectionBuilder;
    warning(text: string): PropertyViewSectionBuilder;
    error(text: string): PropertyViewSectionBuilder;
    getContentBuilders(): Array<PropertyViewPropertyBuilder | PropertyViewMessageBuilder>;
    build(): PropertyViewSectionModel;
    clone(parentClone: PropertyViewCategoryBuilder): PropertyViewSectionBuilder;
    exit(): PropertyViewCategoryBuilder;
}

declare class PropertyViewCategoryBuilder {
    #private;
    private parent;
    private id;
    private contentBuilders;
    constructor(parent: PropertyViewBuilder, id: string);
    getId(): string;
    title(value: string | null): PropertyViewCategoryBuilder;
    getAllSections(): Array<PropertyViewSectionBuilder>;
    getSection(id: string): PropertyViewSectionBuilder | null;
    section(id: string): PropertyViewSectionBuilder;
    cloneAndAddBuilder(builder: PropertyViewSectionBuilder): PropertyViewCategoryBuilder;
    cloneAndAddBuilders(builders: Array<PropertyViewSectionBuilder>): PropertyViewCategoryBuilder;
    build(): PropertyViewCategoryModel;
    clone(parentClone: PropertyViewBuilder): PropertyViewCategoryBuilder;
    exit(): PropertyViewBuilder;
}

declare class PropertyViewBuilder {
    #private;
    constructor();
    getAllCategories(): Array<PropertyViewCategoryBuilder>;
    getCategory(id: string): PropertyViewCategoryBuilder | null;
    getSection(categoryId: string, sectionId: string): PropertyViewSectionBuilder | null;
    category(id: string, insertionIndex?: number): PropertyViewCategoryBuilder;
    generateAllCategory(categoryTitle: string): PropertyViewCategoryBuilder;
    build(): PropertyViewModel;
    clone(): PropertyViewBuilder;
    exit(): null;
}

interface PropertyViewConfig {
    propertyKeyWidthInRem?: number | undefined;
}

declare class PropertyViewConfigProvider {
    private config;
    private configSubject;
    getConfig(): PropertyViewConfig | undefined;
    config$(): Observable<PropertyViewConfig | undefined>;
    setConfig(value: PropertyViewConfig | undefined): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewConfigProvider, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PropertyViewConfigProvider>;
}

declare class PropertyViewSectionsExpandedStateManager {
    private readonly categoriesSectionsExpandedStateData;
    constructor();
    getSectionExpandedState(categoryId: string, sectionId: string): boolean;
    setSectionExpandedUserState(categoryId: string, sectionId: string, expandedUserState: boolean): void;
    update(categories: Array<PropertyViewCategoryModel>): void;
    private removeOldCategories;
    private createNewCategories;
    private updateCategorySections;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewSectionsExpandedStateManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PropertyViewSectionsExpandedStateManager>;
}

declare class PropertyViewComponent implements DoCheck {
    private expandedStateManager;
    private propertyViewConfigProvider;
    private static idCounter;
    readonly basedId: string;
    selectedCategoryId: string | undefined;
    focusedCategoryId: string | undefined;
    data: PropertyViewModel | null | undefined;
    categoryTabButtonsList: QueryList<ElementRef>;
    constructor(expandedStateManager: PropertyViewSectionsExpandedStateManager, propertyViewConfigProvider: PropertyViewConfigProvider);
    set config(value: PropertyViewConfig | undefined);
    ngDoCheck(): void;
    selectCategory(category: PropertyViewCategoryModel): void;
    isCategorySelected(category: PropertyViewCategoryModel): boolean;
    isCategoryFocused(category: PropertyViewCategoryModel): boolean;
    getCategoryTabId(category: PropertyViewCategoryModel): string;
    getCategoryPanelId(category: PropertyViewCategoryModel): string;
    getCategoryComponentId(category: PropertyViewCategoryModel): string;
    getCategoryTrackingId(index: number, data: PropertyViewCategoryModel): string;
    onTabListKeydown(event: KeyboardEvent): void;
    private validateAndUpdateSelectedCategory;
    private validateAndUpdateFocusedCategory;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewComponent, "appfx-property-view", never, { "data": { "alias": "data"; "required": false; }; "config": { "alias": "config"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * User-visible strings used in the 'appfx-property-view' library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * components in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module where you use PropertyViewModule
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: PropertyViewStrings, useClass: LocalizedPropertyViewStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
declare class PropertyViewStrings {
    /**
     * Toggle button aria-label.
     */
    readonly toggle: string;
    /**
     * Actions drop-down label.
     */
    readonly actions: string;
    /**
     * Aria label describing number of section items in a property view
     */
    readonly categoryListItemsAreaLabel: string;
    /**
     * Aria label describing number section items in a property view when one item
     */
    readonly categoryListItemAreaLabel: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewStrings, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PropertyViewStrings>;
}

declare class PropertyViewCategoryComponent {
    private expandedStateManager;
    private propertyViewStrings;
    readonly PropertyViewModelType: typeof PropertyViewModelType;
    data: PropertyViewCategoryModel;
    componentId: string;
    constructor(expandedStateManager: PropertyViewSectionsExpandedStateManager, propertyViewStrings: PropertyViewStrings);
    getSectionExpandedState(sectionId: string): boolean;
    onSectionExpandedStateChange(sectionId: string, expandedUserState: boolean): void;
    getSectionTrackingId(index: number, data: PropertyViewSectionModel): string;
    getSectionComponentId(section: PropertyViewSectionModel): string;
    getSectionComponentAriaLabelId(section: PropertyViewSectionModel): string;
    getCategoryListItemsAreaLabel(): string | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewCategoryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewCategoryComponent, "appfx-property-view-category", never, { "data": { "alias": "data"; "required": false; }; "componentId": { "alias": "componentId"; "required": false; }; }, {}, never, never, false, never>;
}

declare class PropertyViewMessageComponent {
    data: PropertyViewMessageModel;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewMessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewMessageComponent, "[appfx-property-view-message]", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}

declare class PropertyViewPropertyComponent implements OnInit, OnChanges, OnDestroy {
    propertyViewConfigProvider: PropertyViewConfigProvider;
    private zoomLevelService?;
    readonly PropertyViewModelType: typeof PropertyViewModelType;
    data: PropertyViewPropertyModel;
    propertyValueModelContent: PropertyViewPropertyValueModel[];
    propertyValueComponentModelContent: PropertyViewPropertyValueComponentModel<unknown>[];
    is4xZoomed: boolean;
    private zoomLevelSubscription;
    constructor(propertyViewConfigProvider: PropertyViewConfigProvider, zoomLevelService?: ZoomLevelService);
    ngOnChanges(changes: SimpleChanges): void;
    handleLinkClick(link: PropertyViewLinkModel): void;
    getValueTrackingId(index: number): number;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewPropertyComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewPropertyComponent, "[appfx-property-view-property]", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * Component used to dynamically render
 * a given component passed as a property of the PropertyViewPropertyComponentValueModel
 */
declare class PropertyViewPropertyValueContainerComponent<T> implements OnInit, OnChanges, OnDestroy {
    #private;
    private componentFactoryResolver;
    private cdRef;
    private viewContainer;
    componentType?: Type<PropertyViewPropertyValueComponent<T>> | null;
    componentModel?: T | null;
    constructor(componentFactoryResolver: ComponentFactoryResolver, cdRef: ChangeDetectorRef, viewContainer: ViewContainerRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private createComponent;
    private clear;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewPropertyValueContainerComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewPropertyValueContainerComponent<any>, "appfx-property-view-property-value-component", never, { "componentType": { "alias": "componentType"; "required": false; }; "componentModel": { "alias": "componentModel"; "required": false; }; }, {}, never, never, false, never>;
}

declare class PropertyViewSectionComponent {
    propertyViewStrings: PropertyViewStrings;
    readonly PropertyViewModelType: typeof PropertyViewModelType;
    data: PropertyViewSectionModel;
    expanded: boolean;
    componentId: string;
    expandedChange: EventEmitter<boolean>;
    constructor(propertyViewStrings: PropertyViewStrings);
    toggleExpandedState(): void;
    handleActionClick(action: PropertyViewActionModel): void;
    getContentTrackingId(index: number): number;
    getSectionTitleToggleButtonAriaLabel(): string;
    /**
     * Returns unique formatted label if title is not null,
     * otherwise sets static label without any placeholder
     */
    private getFormattedLabel;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewSectionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PropertyViewSectionComponent, "[appfx-property-view-section]", never, { "data": { "alias": "data"; "required": false; }; "expanded": { "alias": "expanded"; "required": false; }; "componentId": { "alias": "componentId"; "required": false; }; }, { "expandedChange": "expandedChange"; }, never, never, false, never>;
}

declare class AppfxPropertyViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxPropertyViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxPropertyViewModule, [typeof PropertyViewCategoryComponent, typeof PropertyViewComponent, typeof PropertyViewMessageComponent, typeof PropertyViewPropertyComponent, typeof PropertyViewPropertyValueContainerComponent, typeof PropertyViewSectionComponent], [typeof i7.ClrDropdownModule, typeof i8.CommonModule], [typeof PropertyViewComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxPropertyViewModule>;
}

declare class PropertyViewService {
    createPropertyViewBuilder(): PropertyViewBuilder;
    static ɵfac: i0.ɵɵFactoryDeclaration<PropertyViewService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PropertyViewService>;
}

export { AppfxPropertyViewModule, PropertyViewBuilder, PropertyViewCategoryBuilder, PropertyViewComponent, PropertyViewMessageBuilder, PropertyViewModelType, AppfxPropertyViewModule as PropertyViewModule, PropertyViewPropertyBuilder, PropertyViewPropertyKeyBuilder, PropertyViewPropertyValueBuilder, PropertyViewPropertyValueComponentBuilder, PropertyViewSectionBuilder, PropertyViewService, PropertyViewStrings };
export type { PropertyViewActionModel, PropertyViewCategoryModel, PropertyViewConfig, PropertyViewLinkModel, PropertyViewMessageModel, PropertyViewModel, PropertyViewPropertyKeyModel, PropertyViewPropertyModel, PropertyViewPropertyValueComponent, PropertyViewPropertyValueComponentModel, PropertyViewPropertyValueModel, PropertyViewSectionModel };
