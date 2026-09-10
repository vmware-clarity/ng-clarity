import * as i7 from '@angular/cdk/drag-drop';
import { CdkDropList, CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import * as i6$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, ElementRef, ViewContainerRef, ViewChild, Input, Optional, Component, EventEmitter, Output, NgModule } from '@angular/core';
import * as i8 from '@clr/addons/translate';
import { AppfxTranslateService, defaultMissingTranslationHandler, appfxMissingTranslationToken, appfxTranslationsToken, AppfxTranslateModule } from '@clr/addons/translate';
import * as i3 from '@clr/angular/forms/checkbox';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import * as i4 from '@clr/angular/popover/dropdown';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { trigger, transition, style, animate } from '@angular/animations';
import * as i5 from '@clr/addons/a11y';
import { a11ykeys } from '@clr/addons/a11y';
import * as i1 from '@clr/addons/drag-and-drop';
import * as i6 from '@clr/angular/icon';
import { ClarityIcons, dragHandleIcon, cogIcon } from '@clr/angular/icon';
import { Subscription, of } from 'rxjs';
import { tap, map, filter, take } from 'rxjs/operators';
import * as i1$1 from '@clr/angular/forms/common';
import * as i5$1 from '@clr/angular/popover/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const translations = {
    en: {
        /**
         * Settings toggle button label for screen readers.
         */
        settingsCog: 'Settings',
        /**
         * Drag handle button label for screen readers.
         */
        cardDragHandle: 'Card drag handle',
        /**
         * Drag handle button describe for screen readers.
         */
        cardDragHandleDescription: 'Press Enter and use left or right key to move the card to a new position.',
    },
    fr: {
        settingsCog: 'Paramètres',
        cardDragHandle: 'Poignée de glissement de carte',
        cardDragHandleDescription: 'Appuyez sur Entrée et utilisez la flèche vers la gauche ou la droite pour déplacer la carte vers une nouvelle position.',
    },
    es: {
        settingsCog: 'Configuración',
        cardDragHandle: 'Control de arrastre de tarjeta ',
        cardDragHandleDescription: 'Pulse la tecla Intro y use la tecla de flecha izquierda o derecha para mover la tarjeta a una nueva posición.',
    },
    ja: {
        settingsCog: '設定',
        cardDragHandle: 'カード ドラッグ ハンドル',
        cardDragHandleDescription: 'Enter キーを押し、←または→キーを押してカードを新しい位置に移動します。',
    },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// unit Card Width and Height
const cardSize = {
    unitWidthInPixels: 258,
    unitHeightInPixels: 58,
    unitGutterSizeInPixels: 18,
    headerHeightInPixels: 50,
    footerHeightInPixels: 50,
};
// card defaults
const cardDefaults = {
    unitWidth: 1,
    unitHeight: 5,
    order: Infinity,
    hidden: false,
    canHide: true,
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Handles storing and retrieving of preferences/settings of the cards in container
 * like order, hidden properties of card.
 */
class PersistenceService {
    constructor() {
        this.appfxCardSettings = [];
    }
    initialize(containerStore) {
        this.containerStore = containerStore;
    }
    retrieve() {
        return this.containerStore.retrieve().pipe(tap((cardSettings) => {
            this.appfxCardSettings = cardSettings;
        }));
    }
    save(cards) {
        const cardSettings = this.generateCardSettings(cards);
        this.appfxCardSettings = this.mergeCardSettings(cardSettings);
        this.containerStore.save(this.appfxCardSettings);
    }
    /**
     * Generate Card Settings.
     */
    generateCardSettings(cards) {
        return cards.map((card) => ({
            id: card.id,
            order: card.order,
            hidden: card.hidden,
        }));
    }
    /**
     * If cardSettings are preset in the persistence store then update them with provided info and use them
     * else add it to store if new card settings.
     */
    mergeCardSettings(cardSettings) {
        const updatedCardSettings = this.appfxCardSettings.map((cardSetting) => {
            const updatedCardSetting = cardSettings.find((setting) => setting.id === cardSetting.id);
            return updatedCardSetting ?? cardSetting;
        });
        // get newly added cards
        const newCardSettings = cardSettings.filter((cardSetting) => {
            const alreadyUpdated = updatedCardSettings.find((updatedCardSetting) => updatedCardSetting.id === cardSetting.id);
            return !alreadyUpdated;
        });
        // all cardsInfo's - existing with updated cardInfo's and newly added cardInfo's
        return [...updatedCardSettings, ...newCardSettings];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PersistenceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PersistenceService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PersistenceService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Keep track of the cards in the container with their properties like order, hidden etc.
 * Takes care of updating store with the card preferences.
 */
class ContainerService {
    constructor(persistenceService) {
        this.persistenceService = persistenceService;
        this.containerCards = [];
    }
    /**
     * Initialize container service by adding list of cards and persistence service instance.
     */
    initialize(cardContainer, cards) {
        this.cardContainer = cardContainer;
        // add unique cards
        cards.forEach((card) => this.addCard(card));
    }
    /**
     * Fetches card order, hidden properties from the persistence service and apply it to card.
     * Filters hidden card, sorts cards according to order and remove duplicate order cards.
     */
    getCardsWithOrder() {
        return this.persistenceService.retrieve().pipe(
        // set card oder and hidden user preferences from store
        map((cardSettings) => this.applySettingsToCards(cardSettings)), 
        // do not insert hidden cards
        map((cardsWithSettings) => this.filterHiddenCards(cardsWithSettings)), 
        // sort cards in order to insert into container
        map((visibleCards) => this.sortCardsByOrder(visibleCards)), 
        // remove duplicate order
        map((sortedCards) => this.normalizeCardOrder(sortedCards)));
    }
    /**
     * Fetches card order, hidden properties from the persistence service and apply it to card.
     * if card is hidden before filters it accordingly so that container will not insert it.
     */
    getCardWithOrder(card) {
        return this.persistenceService
            .retrieve()
            .pipe(map((cardSettings) => this.applyCardSettings(card, cardSettings)));
    }
    /**
     * Toggles card hidden property and save updated settings in store.
     */
    toggleCardVisibility(cardId) {
        this.containerCards = this.containerCards.map((containerCard) => {
            if (containerCard.id === cardId) {
                containerCard.hidden = !containerCard.hidden;
            }
            return containerCard;
        });
        return this.getCardById(cardId);
    }
    /**
     * Moves the card from Drag Index to Drop Index
     * by detaching card from view at drag Index and inserting it into Drop Index.
     *
     * Updates the order of the remaining cards once done.
     */
    moveCard(fromIndex, toIndex) {
        // drag and drop on the same card position
        if (fromIndex === toIndex) {
            return;
        }
        // right to left
        toIndex = fromIndex < toIndex ? toIndex : toIndex + 1;
        const cardView = this.cardContainer.get(fromIndex);
        if (cardView) {
            this.cardContainer.detach(fromIndex);
            this.cardContainer.insert(cardView, toIndex);
            this.updateCardsOrder();
        }
    }
    /**
     * Removes card form the list of container cards.
     */
    removeCard(cardId) {
        this.containerCards = this.containerCards.filter((card) => card.id !== cardId);
    }
    /**
     * Update Card properties once inserted into container.
     * View and order gets updated once card is available into container.
     */
    updateCard(card) {
        this.containerCards = this.containerCards.map((containerCard) => {
            return containerCard.id === card.id ? { ...containerCard, ...card } : containerCard;
        });
    }
    /**
     * Returns all cards inside container including hidden cards.
     */
    getContainerCards() {
        return [...this.containerCards];
    }
    /**
     * Returns number of visible cards in the container.
     */
    getVisibleCardsCount() {
        return this.filterHiddenCards(this.containerCards).length;
    }
    /**
     * Update the order on the cards after shuffling occurs new order is as per the index of cards in the view.
     */
    updateCardsOrder() {
        this.containerCards = this.containerCards.map((card) => {
            if (!card.hidden && card.view) {
                const order = this.cardContainer.indexOf(card.view);
                if (card.order !== order) {
                    card.order = order;
                }
            }
            return card;
        });
        this.persistenceService.save(this.containerCards);
    }
    /**
     * Returns container ViewRef
     */
    getCardContainer() {
        return this.cardContainer;
    }
    /**
     * Provides card by id if available
     */
    getCardById(cardId) {
        return this.containerCards.find((containerCard) => containerCard.id === cardId);
    }
    /**
     * provides order of the card in the container
     */
    getCardOrder(cardId) {
        return this.getCardById(cardId)?.order ?? cardDefaults.order;
    }
    /**
     * Adds card to the container list of cards of the container service.
     * Container cards contains all the available cards within container visible as well as hidden.
     */
    addCard(card) {
        if (this.getCardById(card.id)) {
            throw new Error(`Card with id '${card.id}' already exist`);
        }
        this.containerCards = [...this.containerCards, card];
    }
    /**
     * Updates each of the card settings properties like order, hidden.
     */
    applySettingsToCards(cardSettings) {
        return this.containerCards.map((card) => this.applyCardSettings(card, cardSettings));
    }
    /**
     * Updates card settings properties like order, hidden.
     * If none available in the persistence store cardDefaults are used.
     */
    applyCardSettings(card, cardSettings) {
        const cardSetting = cardSettings.find((setting) => setting.id === card.id);
        card.order = cardSetting?.order ?? cardDefaults.order;
        card.hidden = cardSetting?.hidden ?? cardDefaults.hidden;
        return card;
    }
    /**
     * Remove hidden cards
     */
    filterHiddenCards(cards) {
        return cards.filter((card) => !card.hidden);
    }
    /**
     * Sorts cards in ascending order
     */
    sortCardsByOrder(cards) {
        return cards.sort((a, b) => {
            return a.order !== undefined && b.order !== undefined ? a.order - b.order : 0;
        });
    }
    /**
     * Update order to remove duplicates.
     * [0,1,1,2,3,3] -> [0,1,2,3,4,5]
     */
    normalizeCardOrder(cards) {
        return cards.map((card, idx) => {
            card.order = idx;
            return card;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerService, deps: [{ token: PersistenceService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ContainerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: PersistenceService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Provides functionality to drag and drop cards with keyboard interaction
 */
class A11yService {
    constructor(containerService) {
        this.containerService = containerService;
        this.a11yDragOrder = cardDefaults.order;
        this.a11yDropOrder = cardDefaults.order;
    }
    /**
     * Selects the card on press of Enter Key
     * If it is first enter on the card container - updates the drag order
     * Else moves the card from drag order to drop order
     */
    selectCard(cardId) {
        const cardOrder = this.containerService.getCardOrder(cardId);
        if (cardOrder === cardDefaults.order) {
            return;
        }
        if (this.a11yMode) {
            // if already in the drag card is already selected move it to the new drop position
            this.containerService.moveCard(this.a11yDragOrder, this.a11yDropOrder);
            // reset
            this.getOutOfA11yMode();
        }
        else {
            this.a11yDragOrder = cardOrder;
            this.a11yDropOrder = cardOrder;
            this.a11yMode = true;
        }
    }
    /**
     * Moves the drop position on Arrow Keys
     * Updates the drop placeholder according to the arrow key direction
     */
    moveDropPosition(arrowKey) {
        if (!this.a11yMode) {
            return;
        }
        // move position of drop card
        // if leftArrowKey then to previous card
        if (arrowKey === a11ykeys.arrowLeft) {
            this.a11yDropOrder -= 1;
        }
        // if rightArrowKey then to next card
        if (arrowKey === a11ykeys.arrowRight) {
            this.a11yDropOrder += 1;
        }
        // if drop card goes before first card, move to last card
        this.a11yDropOrder = this.a11yDropOrder < 0 ? this.containerService.getVisibleCardsCount() - 1 : this.a11yDropOrder;
        // if drop card goes after last card, move to first card
        this.a11yDropOrder = this.a11yDropOrder > this.containerService.getVisibleCardsCount() - 1 ? 0 : this.a11yDropOrder;
    }
    /**
     * Get out of the Accessibility mode
     */
    getOutOfA11yMode() {
        this.a11yMode = false;
        this.a11yDropOrder = cardDefaults.order;
        this.a11yDragOrder = cardDefaults.order;
    }
    /**
     * checks if cardOrder is equal to a11yDragOrder
     */
    isSelected(cardId) {
        const cardOrder = this.containerService.getCardOrder(cardId);
        return cardOrder !== cardDefaults.order && this.a11yDragOrder === cardOrder;
    }
    /**
     * checks if cardOrder is equal to a11yDropOrder
     */
    isDraggableOver(cardId) {
        const cardOrder = this.containerService.getCardOrder(cardId);
        return cardOrder !== cardDefaults.order && this.a11yDropOrder === cardOrder;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: A11yService, deps: [{ token: ContainerService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: A11yService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: A11yService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: ContainerService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Provides functionality to drag and drop cards with clr drag drop directives.
 */
class DragDropService {
    constructor(containerService) {
        this.containerService = containerService;
    }
    /**
     * Saves the order of drag order to plate at the drop order later.
     */
    onDragStart(cardId) {
        const dragOrder = this.containerService.getCardOrder(cardId);
        if (dragOrder === cardDefaults.order) {
            return;
        }
        this.dragOrder = dragOrder;
    }
    /**
     * On drop move the cards from drag order to drop order.
     */
    onDragDrop(cardId) {
        const dropOrder = this.containerService.getCardOrder(cardId);
        if (dropOrder === cardDefaults.order) {
            return;
        }
        this.containerService.moveCard(this.dragOrder, dropOrder);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragDropService, deps: [{ token: ContainerService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragDropService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragDropService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: ContainerService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Provides functionality related to layout of cards like updating card sizes
 * adding scrolling inside card block depending on conditions
 */
class LayoutService {
    constructor(renderer) {
        this.renderer = renderer;
    }
    /**
     * Updates the size of the cards according to the info provided
     */
    updateCardSize(element, unitWidth = 1, unitHeight = 5) {
        const cardElement = element?.querySelector('.card');
        if (!cardElement) {
            return;
        }
        if (unitWidth > -1) {
            const cardWidth = this.calculateCardWidth(unitWidth);
            this.renderer.setStyle(cardElement, 'width', `${cardWidth}px`);
        }
        else {
            this.renderer.removeStyle(cardElement, 'width');
        }
        let cardBlockHeight = this.calculateCardHeight(unitHeight);
        // if .card-header is defined reduce header height(50px) from .card-block height
        // 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
        const cardHeader = cardElement.querySelector('.card-header');
        if (cardHeader) {
            cardBlockHeight -= cardSize.headerHeightInPixels;
            this.renderer.setStyle(cardHeader, 'height', `${cardSize.headerHeightInPixels}px`);
        }
        // if .card-footer is defined reduce footer height(50px) from .card-block height
        // 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
        const cardFooter = cardElement.querySelector('.card-footer');
        if (cardFooter) {
            cardBlockHeight -= cardSize.footerHeightInPixels;
            this.renderer.setStyle(cardFooter, 'height', `${cardSize.footerHeightInPixels}px`);
        }
        const cardBlock = cardElement.querySelector('.card-block');
        if (cardBlock) {
            if (unitHeight > -1) {
                this.renderer.setStyle(cardBlock, 'height', `${cardBlockHeight}px`);
            }
            else {
                this.renderer.removeStyle(cardBlock, 'height');
            }
            if (cardHeader) {
                this.renderer.setStyle(cardBlock, 'overflow-y', 'auto');
            }
        }
    }
    /**
     * card width is unitWidth * unitWidthInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
     * in between gutters are number of units - 1
     * 1 unit -> 258px
     * 2 unit -> 258*2 + 18 -> 534px
     * 3 unit -> 258*3 + 18*2 -> 810px ....
     * @param unitWidth
     */
    calculateCardWidth(unitWidth) {
        return unitWidth * cardSize.unitWidthInPixels + (unitWidth - 1) * cardSize.unitGutterSizeInPixels;
    }
    /**
     * card height is unitHeight * unitHeightInPixels(258px) + in between gutters * unitGutterSizeInPixels(18px)
     * in between gutters are number of units - 1
     * 1 unit -> 58px
     * 5 unit -> 58*5 + 18*4 -> 362px
     * 7 unit -> 58*7 + 18*6 -> 514px ....
     * @param unitHeight
     */
    calculateCardHeight(unitHeight) {
        return unitHeight * cardSize.unitHeightInPixels + (unitHeight - 1) * cardSize.unitGutterSizeInPixels;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LayoutService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Appfx Container Card
 * Handles user interactions like drag and drop and a11y support for same through keyboard events
 *
 * Used internally in Appfx Card Container @see(AppfxCardContainer)
 */
class AppfxCardComponent {
    constructor(el, groupService, layoutService, dragDropService, a11yService, changeDetector, zoomLevelService) {
        this.el = el;
        this.groupService = groupService;
        this.layoutService = layoutService;
        this.dragDropService = dragDropService;
        this.a11yService = a11yService;
        this.changeDetector = changeDetector;
        this.zoomLevelService = zoomLevelService;
        this.dragDropEnabled = true;
        this.subscriptions = new Subscription();
        ClarityIcons.addIcons(dragHandleIcon);
    }
    get isSelected() {
        return this.a11yService.isSelected(this.card.id);
    }
    get isDraggableOver() {
        return this.a11yService.isDraggableOver(this.card.id);
    }
    get cdkDropGroup() {
        return this.groupService.getGroupItems(this.dropGroup);
    }
    ngOnInit() {
        if (!this.card.id) {
            throw new Error('Missing Input property for card - id');
        }
        this.loadComponent();
        if (this.zoomLevelService) {
            this.currentUnitWidth = this.card.unitWidth;
            this.currentUnitHeight = this.card.unitHeight;
            this.subscriptions.add(this.zoomLevelService.onChange
                .pipe(map((data) => {
                if (!!this.card.cardZoomSizes && !!this.card.cardZoomSizes[data]) {
                    return this.card.cardZoomSizes[data];
                }
                return {
                    unitHeight: this.card.unitHeight,
                    unitWidth: this.card.unitWidth,
                };
            }), filter(size => {
                return size.unitWidth !== this.currentUnitWidth || size.unitHeight !== this.currentUnitHeight;
            }))
                .subscribe(size => {
                this.currentUnitWidth = size.unitWidth;
                this.currentUnitHeight = size.unitHeight;
                this.layoutService.updateCardSize(this.el.nativeElement, this.currentUnitWidth, this.currentUnitHeight);
                this.changeDetector.detectChanges();
            }));
        }
    }
    ngAfterViewInit() {
        this.layoutService.updateCardSize(this.el.nativeElement, this.card.unitWidth, this.card.unitHeight);
        this.groupService.addGroupItem(this.dropGroup, this.dropList);
        this.changeDetector.detectChanges();
    }
    ngOnDestroy() {
        this.groupService.removeGroupItem(this.dropGroup, this.dropList);
        this.subscriptions.unsubscribe();
    }
    onDragStart() {
        this.dragDropService.onDragStart(this.card.id);
    }
    onDrop() {
        this.dragDropService.onDragDrop(this.card.id);
    }
    selectCard(event) {
        this.eventCheck(event);
        this.a11yService.selectCard(this.card.id);
    }
    moveDropPositionBackwards(event) {
        this.eventCheck(event);
        this.a11yService.moveDropPosition(a11ykeys.arrowLeft);
    }
    moveDropPositionForwards(event) {
        this.eventCheck(event);
        this.a11yService.moveDropPosition(a11ykeys.arrowRight);
    }
    onDropHandleKeyUp(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.cdkDragElementRefs?.nativeElement.focus();
        this.a11yService.selectCard(this.card.id);
    }
    loadComponent() {
        if (!this.card.componentClass) {
            return;
        }
        this.cardViewContainer.clear();
        const cr = this.cardViewContainer.createComponent(this.card.componentClass);
        if (this.card.context) {
            Object.entries(this.card.context).forEach(([key, value]) => {
                cr.instance[key] = value;
            });
        }
    }
    eventCheck(event) {
        if (event.target !== event.currentTarget) {
            return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardComponent, deps: [{ token: i0.ElementRef }, { token: i1.DragAndDropGroupService }, { token: LayoutService }, { token: DragDropService }, { token: A11yService }, { token: i0.ChangeDetectorRef }, { token: i5.ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: AppfxCardComponent, isStandalone: false, selector: "appfx-card", inputs: { card: "card", dropGroup: "dropGroup" }, providers: [
            AppfxTranslateService,
            {
                provide: appfxMissingTranslationToken,
                useValue: defaultMissingTranslationHandler,
            },
            {
                provide: appfxTranslationsToken,
                useValue: translations,
            },
        ], viewQueries: [{ propertyName: "dropList", first: true, predicate: CdkDropList, descendants: true, static: true }, { propertyName: "cdkDragElementRefs", first: true, predicate: CdkDrag, descendants: true, read: ElementRef }, { propertyName: "cardViewContainer", first: true, predicate: ["cardViewContainer"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-card droppable\"\n  cdkDropList\n  cdkDropListOrientation=\"horizontal\"\n  cdkDropListAutoScrollStep=\"6\"\n  [cdkDropListConnectedTo]=\"cdkDropGroup\"\n  [class.draggable-over]=\"isDraggableOver\"\n  (cdkDropListDropped)=\"onDrop()\"\n  [@cardAnimation]\n>\n  <div\n    tabindex=\"0\"\n    class=\"draggable\"\n    [class.selected-card]=\"isSelected\"\n    cdkDrag\n    cdkDragPreviewContainer=\"parent\"\n    (cdkDragStarted)=\"onDragStart()\"\n    (keyup.enter)=\"selectCard($event)\"\n    (keyup.arrowleft)=\"moveDropPositionBackwards($event)\"\n    (keyup.arrowright)=\"moveDropPositionForwards($event)\"\n  >\n    <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n    <button\n      class=\"drag-handler-button btn btn-icon\"\n      [attr.aria-label]=\"'cardDragHandle' | translate\"\n      aria-describedby=\"card-drag-handler-instructions\"\n      (keyup.enter)=\"onDropHandleKeyUp($event)\"\n      (keyup.space)=\"onDropHandleKeyUp($event)\"\n    >\n      <span class=\"clr-sr-only\" id=\"card-drag-handler-instructions\">\n        {{ 'cardDragHandleDescription' | translate }}\n      </span>\n      <cds-icon\n        class=\"drag-handle-icon\"\n        shape=\"drag-handle\"\n        size=\"32\"\n        cdkDragHandle\n        [cdkDragHandleDisabled]=\"!dragDropEnabled\"\n        [hidden]=\"!dragDropEnabled\"\n      >\n      </cds-icon>\n    </button>\n    <ng-template #cardViewContainer> </ng-template>\n  </div>\n</div>\n", styles: ["@charset \"UTF-8\";.draggable{margin:0 7px;position:relative}.draggable .drag-handler-button{position:absolute;right:0;border:none;margin:unset;z-index:1}.draggable .drag-handler-button .drag-handle-icon{position:absolute;right:0;color:var(--cds-global-color-construction-400);cursor:grab}.draggable .drag-handler-button .drag-handle-icon:hover{color:var(--cds-global-color-lavender-400)}.draggable ::ng-deep .card{margin-top:0}.draggable ::ng-deep .card-header{border-bottom:none}::ng-deep .draggable.cdk-drag-preview .card{box-shadow:2px 2px 10px 0 var(--cds-global-color-cool-gray-500)}::ng-deep .draggable.cdk-drag-preview .draggable{margin:0}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon{pointer-events:none;cursor:grabbing}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon :focus{color:var(--cds-global-color-lavender-400)}.droppable{margin:7px 0;border:2px solid transparent}.droppable.cdk-drop-list-receiving{border-right:2px dashed var(--cds-global-color-lavender-100)}.droppable.cdk-drop-list-dragging{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.cdk-drop-list-dragging:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.droppable.cdk-drop-list-dragging .draggable:not(.cdk-drag-placeholder,.cdk-drag-preview){transform:unset!important}.droppable.draggable-over{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.draggable-over:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.custom-placeholder{height:0;width:0}.selected-card{opacity:.4;transition:.2s linear all}.selected-card.draggable:focus{outline:none}.selected-card.draggable:focus .card{box-shadow:none}\n"], dependencies: [{ kind: "component", type: i6.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i7.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep", "cdkDropListElementContainer", "cdkDropListHasAnchor"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i7.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer", "cdkDragScale"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: i7.CdkDragHandle, selector: "[cdkDragHandle]", inputs: ["cdkDragHandleDisabled"] }, { kind: "directive", type: i7.CdkDragPlaceholder, selector: "ng-template[cdkDragPlaceholder]", inputs: ["data"] }, { kind: "pipe", type: i8.TranslatePipe, name: "translate" }], animations: [
            trigger('cardAnimation', [
                transition(':enter', [
                    style({ opacity: 0, transform: 'translateX(-100%)' }),
                    animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' })),
                ]),
                transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(0%)' }))]),
            ]),
        ], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-card', standalone: false, providers: [
                        AppfxTranslateService,
                        {
                            provide: appfxMissingTranslationToken,
                            useValue: defaultMissingTranslationHandler,
                        },
                        {
                            provide: appfxTranslationsToken,
                            useValue: translations,
                        },
                    ], animations: [
                        trigger('cardAnimation', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'translateX(-100%)' }),
                                animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' })),
                            ]),
                            transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(0%)' }))]),
                        ]),
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-card droppable\"\n  cdkDropList\n  cdkDropListOrientation=\"horizontal\"\n  cdkDropListAutoScrollStep=\"6\"\n  [cdkDropListConnectedTo]=\"cdkDropGroup\"\n  [class.draggable-over]=\"isDraggableOver\"\n  (cdkDropListDropped)=\"onDrop()\"\n  [@cardAnimation]\n>\n  <div\n    tabindex=\"0\"\n    class=\"draggable\"\n    [class.selected-card]=\"isSelected\"\n    cdkDrag\n    cdkDragPreviewContainer=\"parent\"\n    (cdkDragStarted)=\"onDragStart()\"\n    (keyup.enter)=\"selectCard($event)\"\n    (keyup.arrowleft)=\"moveDropPositionBackwards($event)\"\n    (keyup.arrowright)=\"moveDropPositionForwards($event)\"\n  >\n    <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n    <button\n      class=\"drag-handler-button btn btn-icon\"\n      [attr.aria-label]=\"'cardDragHandle' | translate\"\n      aria-describedby=\"card-drag-handler-instructions\"\n      (keyup.enter)=\"onDropHandleKeyUp($event)\"\n      (keyup.space)=\"onDropHandleKeyUp($event)\"\n    >\n      <span class=\"clr-sr-only\" id=\"card-drag-handler-instructions\">\n        {{ 'cardDragHandleDescription' | translate }}\n      </span>\n      <cds-icon\n        class=\"drag-handle-icon\"\n        shape=\"drag-handle\"\n        size=\"32\"\n        cdkDragHandle\n        [cdkDragHandleDisabled]=\"!dragDropEnabled\"\n        [hidden]=\"!dragDropEnabled\"\n      >\n      </cds-icon>\n    </button>\n    <ng-template #cardViewContainer> </ng-template>\n  </div>\n</div>\n", styles: ["@charset \"UTF-8\";.draggable{margin:0 7px;position:relative}.draggable .drag-handler-button{position:absolute;right:0;border:none;margin:unset;z-index:1}.draggable .drag-handler-button .drag-handle-icon{position:absolute;right:0;color:var(--cds-global-color-construction-400);cursor:grab}.draggable .drag-handler-button .drag-handle-icon:hover{color:var(--cds-global-color-lavender-400)}.draggable ::ng-deep .card{margin-top:0}.draggable ::ng-deep .card-header{border-bottom:none}::ng-deep .draggable.cdk-drag-preview .card{box-shadow:2px 2px 10px 0 var(--cds-global-color-cool-gray-500)}::ng-deep .draggable.cdk-drag-preview .draggable{margin:0}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon{pointer-events:none;cursor:grabbing}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon :focus{color:var(--cds-global-color-lavender-400)}.droppable{margin:7px 0;border:2px solid transparent}.droppable.cdk-drop-list-receiving{border-right:2px dashed var(--cds-global-color-lavender-100)}.droppable.cdk-drop-list-dragging{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.cdk-drop-list-dragging:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.droppable.cdk-drop-list-dragging .draggable:not(.cdk-drag-placeholder,.cdk-drag-preview){transform:unset!important}.droppable.draggable-over{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.draggable-over:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.custom-placeholder{height:0;width:0}.selected-card{opacity:.4;transition:.2s linear all}.selected-card.draggable:focus{outline:none}.selected-card.draggable:focus .card{box-shadow:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.DragAndDropGroupService }, { type: LayoutService }, { type: DragDropService }, { type: A11yService }, { type: i0.ChangeDetectorRef }, { type: i5.ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { card: [{
                type: Input
            }], dropGroup: [{
                type: Input
            }], dropList: [{
                type: ViewChild,
                args: [CdkDropList, { static: true }]
            }], cdkDragElementRefs: [{
                type: ViewChild,
                args: [CdkDrag, { read: ElementRef }]
            }], cardViewContainer: [{
                type: ViewChild,
                args: ['cardViewContainer', { read: ViewContainerRef, static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Handles storing and retrieving of preferences of the container
 * like order, hidden properties of card
 */
class AppfxCardContainerStore {
    constructor() {
        this.localStorage = this.getLocalStorage(window);
    }
    getLocalStore(key) {
        const retrieve = () => {
            return this.getData(key);
        };
        const save = (cards) => {
            this.setData(key, cards);
        };
        return {
            retrieve,
            save,
        };
    }
    getLocalStorage(window) {
        try {
            if (window.localStorage) {
                return window.localStorage;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (ignored) {
            // ignored
        }
        return undefined;
    }
    /**
     * Retrieving data from the local storage.
     * @param key the key to the local storage data
     * @returns the object being saved in the local storage,
     *         Note that the stored data is converted through angular.fromJson()
     */
    getData(key) {
        if (this.localStorage) {
            let data = this.localStorage.getItem(key);
            if (data) {
                data = JSON.parse(data);
                return of(data);
            }
        }
        return of([]);
    }
    /**
     * Setting data into the local storage.
     * @param key the key to the local storage data
     * @param data to be stored
     */
    setData(key, cards) {
        const data = JSON.stringify(cards);
        if (this.localStorage) {
            try {
                this.localStorage.setItem(key, data);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (ignored) {
                // ignored
            }
        }
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// sort function to display cards by sorted titles
const sortCardsByTitleFn = (a, b) => {
    if (a.title && b.title) {
        return a.title.localeCompare(b.title);
    }
    return 0;
};
/**
 * Component to display container settings menu to show/hide cards.
 * Shows card list alphabetically according to title with checkboxes.
 */
class AppfxCardContainerSettingsComponent {
    constructor() {
        /**
         * Event Emitter when user wants to show/hide card.
         */
        this.toggleCardVisibility = new EventEmitter();
        ClarityIcons.addIcons(cogIcon);
    }
    /**
     * Cards list to display in settings dropdown menu.
     */
    set containerCards(cards) {
        this.cards = cards.sort(sortCardsByTitleFn);
    }
    /**
     * Show/hide Card
     */
    toggleShowHide(card) {
        if (card.canHide !== false) {
            this.toggleCardVisibility.emit(card.id);
        }
    }
    trackByFn(index, item) {
        return item.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerSettingsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: AppfxCardContainerSettingsComponent, isStandalone: false, selector: "appfx-card-container-settings", inputs: { containerCards: "containerCards" }, outputs: { toggleCardVisibility: "toggleCardVisibility" }, providers: [
            AppfxTranslateService,
            {
                provide: appfxMissingTranslationToken,
                useValue: defaultMissingTranslationHandler,
            },
            {
                provide: appfxTranslationsToken,
                useValue: translations,
            },
        ], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown [clrCloseMenuOnItemClick]=\"false\">\n  <button class=\"settings-btn\" clrDropdownTrigger>\n    <cds-icon shape=\"cog\" size=\"24\" data-test-id=\"toggleContainerSettingsDropDown\"> </cds-icon>\n    <span class=\"clr-sr-only\">\n      {{ 'settingsCog' | translate }}\n    </span>\n  </button>\n  <clr-dropdown-menu class=\"container-settings\" clrPosition=\"bottom-right\" *clrIfOpen>\n    <div *ngFor=\"let card of cards; trackBy: trackByFn\" clrDropdownItem>\n      <clr-checkbox-wrapper\n        [class.disabled-item]=\"card.canHide === false\"\n        (keydown.space)=\"toggleShowHide(card)\"\n        (keydown.enter)=\"toggleShowHide(card)\"\n      >\n        <input\n          type=\"checkbox\"\n          clrCheckbox\n          name=\"cards\"\n          (change)=\"toggleShowHide(card)\"\n          [checked]=\"!card.hidden\"\n          [disabled]=\"card.canHide === false\"\n          tabindex=\"-1\"\n        />\n        <label [title]=\"card.title\" cds-text=\"truncate\">{{ card.title }}</label>\n      </clr-checkbox-wrapper>\n    </div>\n  </clr-dropdown-menu>\n</clr-dropdown>\n", styles: [".settings-btn{padding:0}.container-settings{margin-top:7px;max-height:350px;overflow-y:auto}.container-settings .disabled-item input[type=checkbox]+label:before{background-color:#ccc}.container-settings .disabled-item label{color:#ccc;cursor:not-allowed}.container-settings .container-settings-list{max-height:350px;overflow-y:auto}.container-settings .dropdown-item .clr-checkbox-wrapper{padding:0 var(--cds-global-space-3)}.container-settings .dropdown-item .clr-checkbox-wrapper label.clr-control-label{padding-left:18px;padding-right:18px;max-width:250px;flex:1 1 100%}clr-dropdown .settings-btn{margin-top:10px;padding-right:0}:host ::ng-deep .dropdown-menu .dropdown-item{flex:1 0;padding:0}\n"], dependencies: [{ kind: "directive", type: i1$1.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i6.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i3.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "component", type: i4.ClrDropdown, selector: "clr-dropdown", inputs: ["clrCloseMenuOnItemClick"] }, { kind: "component", type: i4.ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: ["clrPosition"] }, { kind: "directive", type: i4.ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]" }, { kind: "directive", type: i4.ClrDropdownItem, selector: "[clrDropdownItem]", inputs: ["clrDisabled", "id"] }, { kind: "directive", type: i5$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "directive", type: i6$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "pipe", type: i8.TranslatePipe, name: "translate" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerSettingsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-card-container-settings', standalone: false, providers: [
                        AppfxTranslateService,
                        {
                            provide: appfxMissingTranslationToken,
                            useValue: defaultMissingTranslationHandler,
                        },
                        {
                            provide: appfxTranslationsToken,
                            useValue: translations,
                        },
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown [clrCloseMenuOnItemClick]=\"false\">\n  <button class=\"settings-btn\" clrDropdownTrigger>\n    <cds-icon shape=\"cog\" size=\"24\" data-test-id=\"toggleContainerSettingsDropDown\"> </cds-icon>\n    <span class=\"clr-sr-only\">\n      {{ 'settingsCog' | translate }}\n    </span>\n  </button>\n  <clr-dropdown-menu class=\"container-settings\" clrPosition=\"bottom-right\" *clrIfOpen>\n    <div *ngFor=\"let card of cards; trackBy: trackByFn\" clrDropdownItem>\n      <clr-checkbox-wrapper\n        [class.disabled-item]=\"card.canHide === false\"\n        (keydown.space)=\"toggleShowHide(card)\"\n        (keydown.enter)=\"toggleShowHide(card)\"\n      >\n        <input\n          type=\"checkbox\"\n          clrCheckbox\n          name=\"cards\"\n          (change)=\"toggleShowHide(card)\"\n          [checked]=\"!card.hidden\"\n          [disabled]=\"card.canHide === false\"\n          tabindex=\"-1\"\n        />\n        <label [title]=\"card.title\" cds-text=\"truncate\">{{ card.title }}</label>\n      </clr-checkbox-wrapper>\n    </div>\n  </clr-dropdown-menu>\n</clr-dropdown>\n", styles: [".settings-btn{padding:0}.container-settings{margin-top:7px;max-height:350px;overflow-y:auto}.container-settings .disabled-item input[type=checkbox]+label:before{background-color:#ccc}.container-settings .disabled-item label{color:#ccc;cursor:not-allowed}.container-settings .container-settings-list{max-height:350px;overflow-y:auto}.container-settings .dropdown-item .clr-checkbox-wrapper{padding:0 var(--cds-global-space-3)}.container-settings .dropdown-item .clr-checkbox-wrapper label.clr-control-label{padding-left:18px;padding-right:18px;max-width:250px;flex:1 1 100%}clr-dropdown .settings-btn{margin-top:10px;padding-right:0}:host ::ng-deep .dropdown-menu .dropdown-item{flex:1 0;padding:0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { toggleCardVisibility: [{
                type: Output
            }], containerCards: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class AppfxCardContainerComponent {
    constructor(containerService, persistenceService, iterableDiffers) {
        this.containerService = containerService;
        this.persistenceService = persistenceService;
        this.iterableDiffers = iterableDiffers;
        this.cards = [];
        this.showCardContainerSettings = true;
        this.dragDropEnabled = true;
        this.containerCards = [];
        // iterable differ to track added/removed cards
        this.differ = iterableDiffers.find(this.cards).create(this.trackByFn);
    }
    ngOnInit() {
        if (!this.containerId) {
            throw new Error('Missing Input property - containerId');
        }
        this.initialize();
    }
    ngDoCheck() {
        const changes = this.differ.diff(this.cards);
        if (changes) {
            // insert card into container
            changes.forEachAddedItem((record) => this.addDynamicCard(record.item));
            // remove card from container
            changes.forEachRemovedItem((record) => this.removeCardFromContainer(record.item));
        }
    }
    onToggleCardVisibility(cardId) {
        const card = this.containerService.toggleCardVisibility(cardId);
        // if card is no more inside container
        if (!card) {
            return;
        }
        // remove card from container view but not from available list of cards
        if (card.hidden) {
            this.removeCardFromContainer(card, true);
            this.containerService.updateCardsOrder();
            this.updateContainerCards();
            return;
        }
        // get card order, hidden property from store then update hidden to false and insert card into container
        this.containerService
            .getCardWithOrder(card)
            .pipe(take(1), map((cardWithOrder) => ({
            ...cardWithOrder,
            hidden: false,
        })), tap((cardWithOrder) => {
            this.insertCardToContainer(cardWithOrder);
            this.containerService.updateCardsOrder();
            this.updateContainerCards();
        }))
            .subscribe();
    }
    initialize() {
        // initialize persistence store service with provided or local store
        this.persistenceService.initialize(this.persistenceStore || new AppfxCardContainerStore().getLocalStore(this.containerId));
        // initialize container service
        this.containerService.initialize(this.cardContainer, this.cards);
        // get cards with order from store and accordingly insert into container
        this.containerService
            .getCardsWithOrder()
            .pipe(take(1), tap((cards) => {
            cards.forEach((card) => this.insertCardToContainer(card));
            this.containerService.updateCardsOrder();
            this.updateContainerCards();
        }))
            .subscribe();
    }
    addDynamicCard(card) {
        if (this.containerService.getCardById(card.id)) {
            return;
        }
        this.containerService.addCard(card); // add card to the list of container cards
        this.updateContainerCards(); // update container list cards
        // get order, hidden property from store and accordingly insert card into container
        this.containerService
            .getCardWithOrder(card)
            .pipe(take(1), filter((cardWithOrder) => !cardWithOrder.hidden), tap((cardWithOrder) => {
            this.insertCardToContainer(cardWithOrder);
            this.containerService.updateCardsOrder();
        }))
            .subscribe();
    }
    insertCardToContainer(card) {
        const containerCard = this.containerService.getCardById(card.id);
        if (containerCard) {
            // check if card is currently in ViewContainer angular returns -1 if card is not inside container
            const index = this.cardContainer.indexOf(containerCard.view);
            if (index !== -1) {
                console.warn('Container Card already visualized, id = ' + card.id);
                return;
            }
        }
        const numCards = this.cardContainer.length;
        // if order of card is out of current container cards insert card in end
        card.order = card.order < 0 || card.order > numCards ? numCards : card.order;
        const cr = this.cardContainer.createComponent(AppfxCardComponent, { index: card.order });
        cr.instance.card = card; // set input properties
        cr.instance.dropGroup = this.containerId; // card drag and drop should happen inside this container only
        cr.instance.dragDropEnabled = this.dragDropEnabled;
        // set view to retrieve order of card from view to use later
        card.view = this.cardContainer.get(card.order);
        this.containerService.updateCard(card);
    }
    removeCardFromContainer(card, hideOnly = false) {
        const containerCard = this.containerService.getCardById(card.id);
        if (!containerCard) {
            return;
        }
        // check if card is currently in ViewContainer angular returns -1 if card is not inside container
        const index = this.cardContainer.indexOf(containerCard.view);
        if (index !== -1) {
            this.cardContainer.remove(index);
        }
        // remove from list of available cards if its not hidden or card view is not available
        if (!hideOnly || !containerCard.view) {
            this.containerService.removeCard(containerCard.id);
            this.updateContainerCards();
        }
    }
    updateContainerCards() {
        this.containerCards = [...this.containerService.getContainerCards()];
    }
    trackByFn(index, item) {
        return item.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerComponent, deps: [{ token: ContainerService }, { token: PersistenceService }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: AppfxCardContainerComponent, isStandalone: false, selector: "appfx-card-container", inputs: { containerId: "containerId", cards: "cards", persistenceStore: "persistenceStore", showCardContainerSettings: "showCardContainerSettings", dragDropEnabled: "dragDropEnabled" }, providers: [A11yService, ContainerService, DragDropService, LayoutService, PersistenceService], viewQueries: [{ propertyName: "cardContainer", first: true, predicate: ["cardContainer"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"content-container clr-flex-row\">\n  <div class=\"card-container clr-flex-grow-1\">\n    <ng-template #cardContainer> </ng-template>\n  </div>\n  <appfx-card-container-settings\n    *ngIf=\"showCardContainerSettings\"\n    [containerCards]=\"containerCards\"\n    (toggleCardVisibility)=\"onToggleCardVisibility($event)\"\n  ></appfx-card-container-settings>\n</div>\n", styles: [".card-container{display:flex;flex-wrap:wrap;margin:auto -5px}\n"], dependencies: [{ kind: "directive", type: i6$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AppfxCardContainerSettingsComponent, selector: "appfx-card-container-settings", inputs: ["containerCards"], outputs: ["toggleCardVisibility"] }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-card-container', standalone: false, providers: [A11yService, ContainerService, DragDropService, LayoutService, PersistenceService], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"content-container clr-flex-row\">\n  <div class=\"card-container clr-flex-grow-1\">\n    <ng-template #cardContainer> </ng-template>\n  </div>\n  <appfx-card-container-settings\n    *ngIf=\"showCardContainerSettings\"\n    [containerCards]=\"containerCards\"\n    (toggleCardVisibility)=\"onToggleCardVisibility($event)\"\n  ></appfx-card-container-settings>\n</div>\n", styles: [".card-container{display:flex;flex-wrap:wrap;margin:auto -5px}\n"] }]
        }], ctorParameters: () => [{ type: ContainerService }, { type: PersistenceService }, { type: i0.IterableDiffers }], propDecorators: { containerId: [{
                type: Input
            }], cards: [{
                type: Input
            }], persistenceStore: [{
                type: Input
            }], showCardContainerSettings: [{
                type: Input
            }], dragDropEnabled: [{
                type: Input
            }], cardContainer: [{
                type: ViewChild,
                args: ['cardContainer', { read: ViewContainerRef, static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * AppFx Card Container module
 * declaration and exports of needed components
 */
class AppfxCardContainerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerModule, declarations: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent], imports: [AppfxTranslateModule, ClrCheckboxModule, ClrDropdownModule, CommonModule, DragDropModule], exports: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerModule, imports: [AppfxTranslateModule, ClrCheckboxModule, ClrDropdownModule, CommonModule, DragDropModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxCardContainerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [AppfxTranslateModule, ClrCheckboxModule, ClrDropdownModule, CommonModule, DragDropModule],
                    declarations: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent],
                    exports: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerModule, AppfxCardContainerSettingsComponent };
//# sourceMappingURL=clr-addons-card-container.mjs.map
