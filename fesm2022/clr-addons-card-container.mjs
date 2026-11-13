import * as i7 from "@angular/cdk/drag-drop";
import { CdkDrag, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import * as i6 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injectable, Input, NgModule, Optional, Output, ViewChild, ViewContainerRef } from "@angular/core";
import * as i8 from "@clr/addons/translate";
import { AppfxTranslateModule, AppfxTranslateService, appfxMissingTranslationToken, appfxTranslationsToken, defaultMissingTranslationHandler } from "@clr/addons/translate";
import * as i3 from "@clr/angular/forms/checkbox";
import { ClrCheckboxModule } from "@clr/angular/forms/checkbox";
import * as i4 from "@clr/angular/popover/dropdown";
import { ClrDropdownModule } from "@clr/angular/popover/dropdown";
import * as i5$1 from "@clr/addons/a11y";
import { a11ykeys } from "@clr/addons/a11y";
import * as i1$1 from "@clr/addons/drag-and-drop";
import * as i6$1 from "@clr/angular/icon";
import { ClarityIcons, cogIcon, dragHandleIcon } from "@clr/angular/icon";
import { noopAnimations } from "@clr/angular/utils";
import { Subscription, of } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import * as i1 from "@clr/angular/forms/common";
import * as i5 from "@clr/angular/popover/common";
const translations = {
	en: {
		settingsCog: "Settings",
		cardDragHandle: "Card drag handle",
		cardDragHandleDescription: "Press Enter and use left or right key to move the card to a new position."
	},
	fr: {
		settingsCog: "Paramètres",
		cardDragHandle: "Poignée de glissement de carte",
		cardDragHandleDescription: "Appuyez sur Entrée et utilisez la flèche vers la gauche ou la droite pour déplacer la carte vers une nouvelle position."
	},
	es: {
		settingsCog: "Configuración",
		cardDragHandle: "Control de arrastre de tarjeta ",
		cardDragHandleDescription: "Pulse la tecla Intro y use la tecla de flecha izquierda o derecha para mover la tarjeta a una nueva posición."
	},
	ja: {
		settingsCog: "設定",
		cardDragHandle: "カード ドラッグ ハンドル",
		cardDragHandleDescription: "Enter キーを押し、←または→キーを押してカードを新しい位置に移動します。"
	}
};
const cardSize = {
	unitWidthInPixels: 258,
	unitHeightInPixels: 58,
	unitGutterSizeInPixels: 18,
	headerHeightInPixels: 50,
	footerHeightInPixels: 50
};
const cardDefaults = {
	unitWidth: 1,
	unitHeight: 5,
	order: Infinity,
	hidden: false,
	canHide: true
};
var PersistenceService = class PersistenceService {
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
	generateCardSettings(cards) {
		return cards.map((card) => ({
			id: card.id,
			order: card.order,
			hidden: card.hidden
		}));
	}
	mergeCardSettings(cardSettings) {
		const updatedCardSettings = this.appfxCardSettings.map((cardSetting) => {
			return cardSettings.find((setting) => setting.id === cardSetting.id) ?? cardSetting;
		});
		const newCardSettings = cardSettings.filter((cardSetting) => {
			return !updatedCardSettings.find((updatedCardSetting) => updatedCardSetting.id === cardSetting.id);
		});
		return [...updatedCardSettings, ...newCardSettings];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: PersistenceService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: PersistenceService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: PersistenceService,
	decorators: [{ type: Injectable }]
});
var ContainerService = class ContainerService {
	constructor(persistenceService) {
		this.persistenceService = persistenceService;
		this.containerCards = [];
	}
	initialize(cardContainer, cards) {
		this.cardContainer = cardContainer;
		cards.forEach((card) => this.addCard(card));
	}
	getCardsWithOrder() {
		return this.persistenceService.retrieve().pipe(map((cardSettings) => this.applySettingsToCards(cardSettings)), map((cardsWithSettings) => this.filterHiddenCards(cardsWithSettings)), map((visibleCards) => this.sortCardsByOrder(visibleCards)), map((sortedCards) => this.normalizeCardOrder(sortedCards)));
	}
	getCardWithOrder(card) {
		return this.persistenceService.retrieve().pipe(map((cardSettings) => this.applyCardSettings(card, cardSettings)));
	}
	toggleCardVisibility(cardId) {
		this.containerCards = this.containerCards.map((containerCard) => {
			if (containerCard.id === cardId) containerCard.hidden = !containerCard.hidden;
			return containerCard;
		});
		return this.getCardById(cardId);
	}
	moveCard(fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		toIndex = fromIndex < toIndex ? toIndex : toIndex + 1;
		const cardView = this.cardContainer.get(fromIndex);
		if (cardView) {
			this.cardContainer.detach(fromIndex);
			this.cardContainer.insert(cardView, toIndex);
			this.updateCardsOrder();
		}
	}
	removeCard(cardId) {
		this.containerCards = this.containerCards.filter((card) => card.id !== cardId);
	}
	updateCard(card) {
		this.containerCards = this.containerCards.map((containerCard) => {
			return containerCard.id === card.id ? {
				...containerCard,
				...card
			} : containerCard;
		});
	}
	getContainerCards() {
		return [...this.containerCards];
	}
	getVisibleCardsCount() {
		return this.filterHiddenCards(this.containerCards).length;
	}
	updateCardsOrder() {
		this.containerCards = this.containerCards.map((card) => {
			if (!card.hidden && card.view) {
				const order = this.cardContainer.indexOf(card.view);
				if (card.order !== order) card.order = order;
			}
			return card;
		});
		this.persistenceService.save(this.containerCards);
	}
	getCardContainer() {
		return this.cardContainer;
	}
	getCardById(cardId) {
		return this.containerCards.find((containerCard) => containerCard.id === cardId);
	}
	getCardOrder(cardId) {
		return this.getCardById(cardId)?.order ?? cardDefaults.order;
	}
	addCard(card) {
		if (this.getCardById(card.id)) throw new Error(`Card with id '${card.id}' already exist`);
		this.containerCards = [...this.containerCards, card];
	}
	applySettingsToCards(cardSettings) {
		return this.containerCards.map((card) => this.applyCardSettings(card, cardSettings));
	}
	applyCardSettings(card, cardSettings) {
		const cardSetting = cardSettings.find((setting) => setting.id === card.id);
		const cardWithSettings = card;
		cardWithSettings.order = cardSetting?.order ?? cardDefaults.order;
		cardWithSettings.hidden = cardSetting?.hidden ?? cardDefaults.hidden;
		return cardWithSettings;
	}
	filterHiddenCards(cards) {
		return cards.filter((card) => !card.hidden);
	}
	sortCardsByOrder(cards) {
		return cards.sort((a, b) => {
			return a.order !== void 0 && b.order !== void 0 ? a.order - b.order : 0;
		});
	}
	normalizeCardOrder(cards) {
		return cards.map((card, idx) => {
			card.order = idx;
			return card;
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ContainerService,
			deps: [{ token: PersistenceService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ContainerService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ContainerService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: PersistenceService }]
});
var A11yService = class A11yService {
	constructor(containerService) {
		this.containerService = containerService;
		this.a11yDragOrder = cardDefaults.order;
		this.a11yDropOrder = cardDefaults.order;
	}
	selectCard(cardId) {
		const cardOrder = this.containerService.getCardOrder(cardId);
		if (cardOrder === cardDefaults.order) return;
		if (this.a11yMode) {
			this.containerService.moveCard(this.a11yDragOrder, this.a11yDropOrder);
			this.getOutOfA11yMode();
		} else {
			this.a11yDragOrder = cardOrder;
			this.a11yDropOrder = cardOrder;
			this.a11yMode = true;
		}
	}
	moveDropPosition(arrowKey) {
		if (!this.a11yMode) return;
		if (arrowKey === a11ykeys.arrowLeft) this.a11yDropOrder -= 1;
		if (arrowKey === a11ykeys.arrowRight) this.a11yDropOrder += 1;
		this.a11yDropOrder = this.a11yDropOrder < 0 ? this.containerService.getVisibleCardsCount() - 1 : this.a11yDropOrder;
		this.a11yDropOrder = this.a11yDropOrder > this.containerService.getVisibleCardsCount() - 1 ? 0 : this.a11yDropOrder;
	}
	getOutOfA11yMode() {
		this.a11yMode = false;
		this.a11yDropOrder = cardDefaults.order;
		this.a11yDragOrder = cardDefaults.order;
	}
	isSelected(cardId) {
		const cardOrder = this.containerService.getCardOrder(cardId);
		return cardOrder !== cardDefaults.order && this.a11yDragOrder === cardOrder;
	}
	isDraggableOver(cardId) {
		const cardOrder = this.containerService.getCardOrder(cardId);
		return cardOrder !== cardDefaults.order && this.a11yDropOrder === cardOrder;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: A11yService,
			deps: [{ token: ContainerService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: A11yService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: A11yService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: ContainerService }]
});
var DragDropService = class DragDropService {
	constructor(containerService) {
		this.containerService = containerService;
	}
	onDragStart(cardId) {
		const dragOrder = this.containerService.getCardOrder(cardId);
		if (dragOrder === cardDefaults.order) return;
		this.dragOrder = dragOrder;
	}
	onDragDrop(cardId) {
		const dropOrder = this.containerService.getCardOrder(cardId);
		if (dropOrder === cardDefaults.order) return;
		this.containerService.moveCard(this.dragOrder, dropOrder);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DragDropService,
			deps: [{ token: ContainerService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DragDropService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DragDropService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: ContainerService }]
});
var LayoutService = class LayoutService {
	constructor(renderer) {
		this.renderer = renderer;
	}
	updateCardSize(element, unitWidth = 1, unitHeight = 5) {
		const cardElement = element?.querySelector(".card");
		if (!cardElement) return;
		if (unitWidth > -1) {
			const cardWidth = this.calculateCardWidth(unitWidth);
			this.renderer.setStyle(cardElement, "width", `${cardWidth}px`);
		} else this.renderer.removeStyle(cardElement, "width");
		let cardBlockHeight = this.calculateCardHeight(unitHeight);
		const cardHeader = cardElement.querySelector(".card-header");
		if (cardHeader) {
			cardBlockHeight -= cardSize.headerHeightInPixels;
			this.renderer.setStyle(cardHeader, "height", `${cardSize.headerHeightInPixels}px`);
		}
		const cardFooter = cardElement.querySelector(".card-footer");
		if (cardFooter) {
			cardBlockHeight -= cardSize.footerHeightInPixels;
			this.renderer.setStyle(cardFooter, "height", `${cardSize.footerHeightInPixels}px`);
		}
		const cardBlock = cardElement.querySelector(".card-block");
		if (cardBlock) {
			if (unitHeight > -1) this.renderer.setStyle(cardBlock, "height", `${cardBlockHeight}px`);
			else this.renderer.removeStyle(cardBlock, "height");
			if (cardHeader) this.renderer.setStyle(cardBlock, "overflow-y", "auto");
		}
	}
	calculateCardWidth(unitWidth) {
		return unitWidth * cardSize.unitWidthInPixels + (unitWidth - 1) * cardSize.unitGutterSizeInPixels;
	}
	calculateCardHeight(unitHeight) {
		return unitHeight * cardSize.unitHeightInPixels + (unitHeight - 1) * cardSize.unitGutterSizeInPixels;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: LayoutService,
			deps: [{ token: i0.Renderer2 }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: LayoutService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: LayoutService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: i0.Renderer2 }]
});
var AppfxCardComponent = class AppfxCardComponent {
	constructor(el, groupService, layoutService, dragDropService, a11yService, changeDetector, zoomLevelService) {
		this.el = el;
		this.groupService = groupService;
		this.layoutService = layoutService;
		this.dragDropService = dragDropService;
		this.a11yService = a11yService;
		this.changeDetector = changeDetector;
		this.zoomLevelService = zoomLevelService;
		this.dragDropEnabled = true;
		this.enterClass = noopAnimations() ? "" : "clr-fade-slide-right-enter";
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
		if (!this.card.id) throw new Error("Missing Input property for card - id");
		this.loadComponent();
		if (this.zoomLevelService) {
			this.currentUnitWidth = this.card.unitWidth;
			this.currentUnitHeight = this.card.unitHeight;
			this.subscriptions.add(this.zoomLevelService.onChange.pipe(map((data) => {
				if (!!this.card.cardZoomSizes && !!this.card.cardZoomSizes[data]) return this.card.cardZoomSizes[data];
				return {
					unitHeight: this.card.unitHeight,
					unitWidth: this.card.unitWidth
				};
			}), filter((size) => {
				return size.unitWidth !== this.currentUnitWidth || size.unitHeight !== this.currentUnitHeight;
			})).subscribe((size) => {
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
		if (!this.card.componentClass) return;
		this.cardViewContainer.clear();
		const cr = this.cardViewContainer.createComponent(this.card.componentClass);
		if (this.card.context) Object.entries(this.card.context).forEach(([key, value]) => {
			cr.instance[key] = value;
		});
	}
	eventCheck(event) {
		if (event.target !== event.currentTarget) return;
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardComponent,
			deps: [
				{ token: i0.ElementRef },
				{ token: i1$1.DragAndDropGroupService },
				{ token: LayoutService },
				{ token: DragDropService },
				{ token: A11yService },
				{ token: i0.ChangeDetectorRef },
				{
					token: i5$1.ZoomLevelService,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: AppfxCardComponent,
			isStandalone: false,
			selector: "appfx-card",
			inputs: {
				card: "card",
				dropGroup: "dropGroup"
			},
			providers: [
				AppfxTranslateService,
				{
					provide: appfxMissingTranslationToken,
					useValue: defaultMissingTranslationHandler
				},
				{
					provide: appfxTranslationsToken,
					useValue: translations
				}
			],
			viewQueries: [
				{
					propertyName: "dropList",
					first: true,
					predicate: CdkDropList,
					descendants: true,
					static: true
				},
				{
					propertyName: "cdkDragElementRefs",
					first: true,
					predicate: CdkDrag,
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "cardViewContainer",
					first: true,
					predicate: ["cardViewContainer"],
					descendants: true,
					read: ViewContainerRef,
					static: true
				}
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-card droppable\"\n  cdkDropList\n  cdkDropListOrientation=\"horizontal\"\n  cdkDropListAutoScrollStep=\"6\"\n  [cdkDropListConnectedTo]=\"cdkDropGroup\"\n  [class.draggable-over]=\"isDraggableOver\"\n  (cdkDropListDropped)=\"onDrop()\"\n  [animate.enter]=\"enterClass\"\n>\n  <div\n    tabindex=\"0\"\n    class=\"draggable\"\n    [class.selected-card]=\"isSelected\"\n    cdkDrag\n    cdkDragPreviewContainer=\"parent\"\n    (cdkDragStarted)=\"onDragStart()\"\n    (keyup.enter)=\"selectCard($event)\"\n    (keyup.arrowleft)=\"moveDropPositionBackwards($event)\"\n    (keyup.arrowright)=\"moveDropPositionForwards($event)\"\n  >\n    <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n    <button\n      class=\"drag-handler-button btn btn-icon\"\n      [attr.aria-label]=\"'cardDragHandle' | translate\"\n      aria-describedby=\"card-drag-handler-instructions\"\n      (keyup.enter)=\"onDropHandleKeyUp($event)\"\n      (keyup.space)=\"onDropHandleKeyUp($event)\"\n    >\n      <span class=\"clr-sr-only\" id=\"card-drag-handler-instructions\">\n        {{ 'cardDragHandleDescription' | translate }}\n      </span>\n      <cds-icon\n        class=\"drag-handle-icon\"\n        shape=\"drag-handle\"\n        size=\"32\"\n        cdkDragHandle\n        [cdkDragHandleDisabled]=\"!dragDropEnabled\"\n        [hidden]=\"!dragDropEnabled\"\n      >\n      </cds-icon>\n    </button>\n    <ng-template #cardViewContainer> </ng-template>\n  </div>\n</div>\n",
			styles: ["@charset \"UTF-8\";.draggable{margin:0 7px;position:relative}.draggable .drag-handler-button{position:absolute;right:0;border:none;margin:unset;z-index:1}.draggable .drag-handler-button .drag-handle-icon{position:absolute;right:0;color:var(--cds-global-color-construction-400);cursor:grab}.draggable .drag-handler-button .drag-handle-icon:hover{color:var(--cds-global-color-lavender-400)}.draggable ::ng-deep .card{margin-top:0}.draggable ::ng-deep .card-header{border-bottom:none}::ng-deep .draggable.cdk-drag-preview .card{box-shadow:2px 2px 10px 0 var(--cds-global-color-cool-gray-500)}::ng-deep .draggable.cdk-drag-preview .draggable{margin:0}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon{pointer-events:none;cursor:grabbing}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon :focus{color:var(--cds-global-color-lavender-400)}.droppable{--clr-slide-offset: 100%}.droppable.clr-fade-slide-right-enter{animation-timing-function:ease-in}.droppable{margin:7px 0;border:2px solid transparent}.droppable.cdk-drop-list-receiving{border-right:2px dashed var(--cds-global-color-lavender-100)}.droppable.cdk-drop-list-dragging{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.cdk-drop-list-dragging:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.droppable.cdk-drop-list-dragging .draggable:not(.cdk-drag-placeholder,.cdk-drag-preview){transform:unset!important}.droppable.draggable-over{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.draggable-over:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.custom-placeholder{height:0;width:0}.selected-card{opacity:.4;transition:.2s linear all}.selected-card.draggable:focus{outline:none}.selected-card.draggable:focus .card{box-shadow:none}\n"],
			dependencies: [
				{
					kind: "component",
					type: i6$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i7.CdkDropList,
					selector: "[cdkDropList], cdk-drop-list",
					inputs: [
						"cdkDropListConnectedTo",
						"cdkDropListData",
						"cdkDropListOrientation",
						"id",
						"cdkDropListLockAxis",
						"cdkDropListDisabled",
						"cdkDropListSortingDisabled",
						"cdkDropListEnterPredicate",
						"cdkDropListSortPredicate",
						"cdkDropListAutoScrollDisabled",
						"cdkDropListAutoScrollStep",
						"cdkDropListElementContainer",
						"cdkDropListHasAnchor"
					],
					outputs: [
						"cdkDropListDropped",
						"cdkDropListEntered",
						"cdkDropListExited",
						"cdkDropListSorted"
					],
					exportAs: ["cdkDropList"]
				},
				{
					kind: "directive",
					type: i7.CdkDrag,
					selector: "[cdkDrag]",
					inputs: [
						"cdkDragData",
						"cdkDragLockAxis",
						"cdkDragRootElement",
						"cdkDragBoundary",
						"cdkDragStartDelay",
						"cdkDragFreeDragPosition",
						"cdkDragDisabled",
						"cdkDragConstrainPosition",
						"cdkDragPreviewClass",
						"cdkDragPreviewContainer",
						"cdkDragScale"
					],
					outputs: [
						"cdkDragStarted",
						"cdkDragReleased",
						"cdkDragEnded",
						"cdkDragEntered",
						"cdkDragExited",
						"cdkDragDropped",
						"cdkDragMoved"
					],
					exportAs: ["cdkDrag"]
				},
				{
					kind: "directive",
					type: i7.CdkDragHandle,
					selector: "[cdkDragHandle]",
					inputs: ["cdkDragHandleDisabled"]
				},
				{
					kind: "directive",
					type: i7.CdkDragPlaceholder,
					selector: "ng-template[cdkDragPlaceholder]",
					inputs: ["data"]
				},
				{
					kind: "pipe",
					type: i8.TranslatePipe,
					name: "translate"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxCardComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-card",
			standalone: false,
			providers: [
				AppfxTranslateService,
				{
					provide: appfxMissingTranslationToken,
					useValue: defaultMissingTranslationHandler
				},
				{
					provide: appfxTranslationsToken,
					useValue: translations
				}
			],
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  class=\"appfx-card droppable\"\n  cdkDropList\n  cdkDropListOrientation=\"horizontal\"\n  cdkDropListAutoScrollStep=\"6\"\n  [cdkDropListConnectedTo]=\"cdkDropGroup\"\n  [class.draggable-over]=\"isDraggableOver\"\n  (cdkDropListDropped)=\"onDrop()\"\n  [animate.enter]=\"enterClass\"\n>\n  <div\n    tabindex=\"0\"\n    class=\"draggable\"\n    [class.selected-card]=\"isSelected\"\n    cdkDrag\n    cdkDragPreviewContainer=\"parent\"\n    (cdkDragStarted)=\"onDragStart()\"\n    (keyup.enter)=\"selectCard($event)\"\n    (keyup.arrowleft)=\"moveDropPositionBackwards($event)\"\n    (keyup.arrowright)=\"moveDropPositionForwards($event)\"\n  >\n    <div class=\"custom-placeholder\" *cdkDragPlaceholder></div>\n    <button\n      class=\"drag-handler-button btn btn-icon\"\n      [attr.aria-label]=\"'cardDragHandle' | translate\"\n      aria-describedby=\"card-drag-handler-instructions\"\n      (keyup.enter)=\"onDropHandleKeyUp($event)\"\n      (keyup.space)=\"onDropHandleKeyUp($event)\"\n    >\n      <span class=\"clr-sr-only\" id=\"card-drag-handler-instructions\">\n        {{ 'cardDragHandleDescription' | translate }}\n      </span>\n      <cds-icon\n        class=\"drag-handle-icon\"\n        shape=\"drag-handle\"\n        size=\"32\"\n        cdkDragHandle\n        [cdkDragHandleDisabled]=\"!dragDropEnabled\"\n        [hidden]=\"!dragDropEnabled\"\n      >\n      </cds-icon>\n    </button>\n    <ng-template #cardViewContainer> </ng-template>\n  </div>\n</div>\n",
			styles: ["@charset \"UTF-8\";.draggable{margin:0 7px;position:relative}.draggable .drag-handler-button{position:absolute;right:0;border:none;margin:unset;z-index:1}.draggable .drag-handler-button .drag-handle-icon{position:absolute;right:0;color:var(--cds-global-color-construction-400);cursor:grab}.draggable .drag-handler-button .drag-handle-icon:hover{color:var(--cds-global-color-lavender-400)}.draggable ::ng-deep .card{margin-top:0}.draggable ::ng-deep .card-header{border-bottom:none}::ng-deep .draggable.cdk-drag-preview .card{box-shadow:2px 2px 10px 0 var(--cds-global-color-cool-gray-500)}::ng-deep .draggable.cdk-drag-preview .draggable{margin:0}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon{pointer-events:none;cursor:grabbing}::ng-deep .draggable.cdk-drag-preview .drag-handle-icon :focus{color:var(--cds-global-color-lavender-400)}.droppable{--clr-slide-offset: 100%}.droppable.clr-fade-slide-right-enter{animation-timing-function:ease-in}.droppable{margin:7px 0;border:2px solid transparent}.droppable.cdk-drop-list-receiving{border-right:2px dashed var(--cds-global-color-lavender-100)}.droppable.cdk-drop-list-dragging{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.cdk-drop-list-dragging:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.droppable.cdk-drop-list-dragging .draggable:not(.cdk-drag-placeholder,.cdk-drag-preview){transform:unset!important}.droppable.draggable-over{border-right:2px solid var(--cds-global-color-lavender-300);position:relative}.droppable.draggable-over:before{content:\"\\25cf\";color:var(--cds-global-color-lavender-300);position:absolute;right:-5px;top:-10px}.custom-placeholder{height:0;width:0}.selected-card{opacity:.4;transition:.2s linear all}.selected-card.draggable:focus{outline:none}.selected-card.draggable:focus .card{box-shadow:none}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i1$1.DragAndDropGroupService },
		{ type: LayoutService },
		{ type: DragDropService },
		{ type: A11yService },
		{ type: i0.ChangeDetectorRef },
		{
			type: i5$1.ZoomLevelService,
			decorators: [{ type: Optional }]
		}
	],
	propDecorators: {
		card: [{ type: Input }],
		dropGroup: [{ type: Input }],
		dropList: [{
			type: ViewChild,
			args: [CdkDropList, { static: true }]
		}],
		cdkDragElementRefs: [{
			type: ViewChild,
			args: [CdkDrag, { read: ElementRef }]
		}],
		cardViewContainer: [{
			type: ViewChild,
			args: ["cardViewContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}]
	}
});
var AppfxCardContainerStore = class {
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
			save
		};
	}
	getLocalStorage(window) {
		try {
			if (window.localStorage) return window.localStorage;
		} catch (ignored) {}
	}
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
	setData(key, cards) {
		const data = JSON.stringify(cards);
		if (this.localStorage) try {
			this.localStorage.setItem(key, data);
		} catch (ignored) {}
	}
};
const sortCardsByTitleFn = (a, b) => {
	if (a.title && b.title) return a.title.localeCompare(b.title);
	return 0;
};
var AppfxCardContainerSettingsComponent = class AppfxCardContainerSettingsComponent {
	constructor() {
		this.toggleCardVisibility = new EventEmitter();
		ClarityIcons.addIcons(cogIcon);
	}
	set containerCards(cards) {
		this.cards = cards.sort(sortCardsByTitleFn);
	}
	toggleShowHide(card) {
		if (card.canHide !== false) this.toggleCardVisibility.emit(card.id);
	}
	trackByFn(index, item) {
		return item.id;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardContainerSettingsComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: AppfxCardContainerSettingsComponent,
			isStandalone: false,
			selector: "appfx-card-container-settings",
			inputs: { containerCards: "containerCards" },
			outputs: { toggleCardVisibility: "toggleCardVisibility" },
			providers: [
				AppfxTranslateService,
				{
					provide: appfxMissingTranslationToken,
					useValue: defaultMissingTranslationHandler
				},
				{
					provide: appfxTranslationsToken,
					useValue: translations
				}
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown [clrCloseMenuOnItemClick]=\"false\">\n  <button class=\"settings-btn\" clrDropdownTrigger>\n    <cds-icon shape=\"cog\" size=\"24\" data-test-id=\"toggleContainerSettingsDropDown\"> </cds-icon>\n    <span class=\"clr-sr-only\">\n      {{ 'settingsCog' | translate }}\n    </span>\n  </button>\n  <clr-dropdown-menu class=\"container-settings\" clrPosition=\"bottom-right\" *clrIfOpen>\n    <div *ngFor=\"let card of cards; trackBy: trackByFn\" clrDropdownItem>\n      <clr-checkbox-wrapper\n        [class.disabled-item]=\"card.canHide === false\"\n        (keydown.space)=\"toggleShowHide(card)\"\n        (keydown.enter)=\"toggleShowHide(card)\"\n      >\n        <input\n          type=\"checkbox\"\n          clrCheckbox\n          name=\"cards\"\n          (change)=\"toggleShowHide(card)\"\n          [checked]=\"!card.hidden\"\n          [disabled]=\"card.canHide === false\"\n          tabindex=\"-1\"\n        />\n        <label [title]=\"card.title\" cds-text=\"truncate\">{{ card.title }}</label>\n      </clr-checkbox-wrapper>\n    </div>\n  </clr-dropdown-menu>\n</clr-dropdown>\n",
			styles: [".settings-btn{padding:0}.container-settings{margin-top:7px;max-height:350px;overflow-y:auto}.container-settings .disabled-item input[type=checkbox]+label:before{background-color:#ccc}.container-settings .disabled-item label{color:#ccc;cursor:not-allowed}.container-settings .container-settings-list{max-height:350px;overflow-y:auto}.container-settings .dropdown-item .clr-checkbox-wrapper{padding:0 var(--cds-global-space-3)}.container-settings .dropdown-item .clr-checkbox-wrapper label.clr-control-label{padding-left:18px;padding-right:18px;max-width:250px;flex:1 1 100%}clr-dropdown .settings-btn{margin-top:10px;padding-right:0}:host ::ng-deep .dropdown-menu .dropdown-item{flex:1 0;padding:0}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i1.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i6$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i3.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i3.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				},
				{
					kind: "component",
					type: i4.ClrDropdown,
					selector: "clr-dropdown",
					inputs: ["clrCloseMenuOnItemClick"]
				},
				{
					kind: "component",
					type: i4.ClrDropdownMenu,
					selector: "clr-dropdown-menu",
					inputs: ["clrPosition"]
				},
				{
					kind: "directive",
					type: i4.ClrDropdownTrigger,
					selector: "[clrDropdownTrigger],[clrDropdownToggle]"
				},
				{
					kind: "directive",
					type: i4.ClrDropdownItem,
					selector: "[clrDropdownItem]",
					inputs: [
						"role",
						"clrDisabled",
						"id"
					]
				},
				{
					kind: "directive",
					type: i5.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "directive",
					type: i6.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "pipe",
					type: i8.TranslatePipe,
					name: "translate"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxCardContainerSettingsComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-card-container-settings",
			standalone: false,
			providers: [
				AppfxTranslateService,
				{
					provide: appfxMissingTranslationToken,
					useValue: defaultMissingTranslationHandler
				},
				{
					provide: appfxTranslationsToken,
					useValue: translations
				}
			],
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown [clrCloseMenuOnItemClick]=\"false\">\n  <button class=\"settings-btn\" clrDropdownTrigger>\n    <cds-icon shape=\"cog\" size=\"24\" data-test-id=\"toggleContainerSettingsDropDown\"> </cds-icon>\n    <span class=\"clr-sr-only\">\n      {{ 'settingsCog' | translate }}\n    </span>\n  </button>\n  <clr-dropdown-menu class=\"container-settings\" clrPosition=\"bottom-right\" *clrIfOpen>\n    <div *ngFor=\"let card of cards; trackBy: trackByFn\" clrDropdownItem>\n      <clr-checkbox-wrapper\n        [class.disabled-item]=\"card.canHide === false\"\n        (keydown.space)=\"toggleShowHide(card)\"\n        (keydown.enter)=\"toggleShowHide(card)\"\n      >\n        <input\n          type=\"checkbox\"\n          clrCheckbox\n          name=\"cards\"\n          (change)=\"toggleShowHide(card)\"\n          [checked]=\"!card.hidden\"\n          [disabled]=\"card.canHide === false\"\n          tabindex=\"-1\"\n        />\n        <label [title]=\"card.title\" cds-text=\"truncate\">{{ card.title }}</label>\n      </clr-checkbox-wrapper>\n    </div>\n  </clr-dropdown-menu>\n</clr-dropdown>\n",
			styles: [".settings-btn{padding:0}.container-settings{margin-top:7px;max-height:350px;overflow-y:auto}.container-settings .disabled-item input[type=checkbox]+label:before{background-color:#ccc}.container-settings .disabled-item label{color:#ccc;cursor:not-allowed}.container-settings .container-settings-list{max-height:350px;overflow-y:auto}.container-settings .dropdown-item .clr-checkbox-wrapper{padding:0 var(--cds-global-space-3)}.container-settings .dropdown-item .clr-checkbox-wrapper label.clr-control-label{padding-left:18px;padding-right:18px;max-width:250px;flex:1 1 100%}clr-dropdown .settings-btn{margin-top:10px;padding-right:0}:host ::ng-deep .dropdown-menu .dropdown-item{flex:1 0;padding:0}\n"]
		}]
	}],
	ctorParameters: () => [],
	propDecorators: {
		toggleCardVisibility: [{ type: Output }],
		containerCards: [{ type: Input }]
	}
});
var AppfxCardContainerComponent = class AppfxCardContainerComponent {
	constructor(containerService, persistenceService, iterableDiffers) {
		this.containerService = containerService;
		this.persistenceService = persistenceService;
		this.iterableDiffers = iterableDiffers;
		this.cards = [];
		this.showCardContainerSettings = true;
		this.dragDropEnabled = true;
		this.containerCards = [];
		this.differ = iterableDiffers.find(this.cards).create(this.trackByFn);
	}
	ngOnInit() {
		if (!this.containerId) throw new Error("Missing Input property - containerId");
		this.initialize();
	}
	ngDoCheck() {
		const changes = this.differ.diff(this.cards);
		if (changes) {
			changes.forEachAddedItem((record) => this.addDynamicCard(record.item));
			changes.forEachRemovedItem((record) => this.removeCardFromContainer(record.item));
		}
	}
	onToggleCardVisibility(cardId) {
		const card = this.containerService.toggleCardVisibility(cardId);
		if (!card) return;
		if (card.hidden) {
			this.removeCardFromContainer(card, true);
			this.containerService.updateCardsOrder();
			this.updateContainerCards();
			return;
		}
		this.containerService.getCardWithOrder(card).pipe(take(1), map((cardWithOrder) => ({
			...cardWithOrder,
			hidden: false
		})), tap((cardWithOrder) => {
			this.insertCardToContainer(cardWithOrder);
			this.containerService.updateCardsOrder();
			this.updateContainerCards();
		})).subscribe();
	}
	initialize() {
		this.persistenceService.initialize(this.persistenceStore || new AppfxCardContainerStore().getLocalStore(this.containerId));
		this.containerService.initialize(this.cardContainer, this.cards);
		this.containerService.getCardsWithOrder().pipe(take(1), tap((cards) => {
			cards.forEach((card) => this.insertCardToContainer(card));
			this.containerService.updateCardsOrder();
			this.updateContainerCards();
		})).subscribe();
	}
	addDynamicCard(card) {
		if (this.containerService.getCardById(card.id)) return;
		this.containerService.addCard(card);
		this.updateContainerCards();
		this.containerService.getCardWithOrder(card).pipe(take(1), filter((cardWithOrder) => !cardWithOrder.hidden), tap((cardWithOrder) => {
			this.insertCardToContainer(cardWithOrder);
			this.containerService.updateCardsOrder();
		})).subscribe();
	}
	insertCardToContainer(card) {
		const containerCard = this.containerService.getCardById(card.id);
		if (containerCard) {
			if (this.cardContainer.indexOf(containerCard.view) !== -1) {
				console.warn("Container Card already visualized, id = " + card.id);
				return;
			}
		}
		const numCards = this.cardContainer.length;
		card.order = card.order < 0 || card.order > numCards ? numCards : card.order;
		const cr = this.cardContainer.createComponent(AppfxCardComponent, { index: card.order });
		cr.instance.card = card;
		cr.instance.dropGroup = this.containerId;
		cr.instance.dragDropEnabled = this.dragDropEnabled;
		card.view = this.cardContainer.get(card.order);
		this.containerService.updateCard(card);
	}
	removeCardFromContainer(card, hideOnly = false) {
		const containerCard = this.containerService.getCardById(card.id);
		if (!containerCard) return;
		const index = this.cardContainer.indexOf(containerCard.view);
		if (index !== -1) this.cardContainer.remove(index);
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardContainerComponent,
			deps: [
				{ token: ContainerService },
				{ token: PersistenceService },
				{ token: i0.IterableDiffers }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: AppfxCardContainerComponent,
			isStandalone: false,
			selector: "appfx-card-container",
			inputs: {
				containerId: "containerId",
				cards: "cards",
				persistenceStore: "persistenceStore",
				showCardContainerSettings: "showCardContainerSettings",
				dragDropEnabled: "dragDropEnabled"
			},
			providers: [
				A11yService,
				ContainerService,
				DragDropService,
				LayoutService,
				PersistenceService
			],
			viewQueries: [{
				propertyName: "cardContainer",
				first: true,
				predicate: ["cardContainer"],
				descendants: true,
				read: ViewContainerRef,
				static: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"content-container clr-flex-row\">\n  <div class=\"card-container clr-flex-grow-1\">\n    <ng-template #cardContainer> </ng-template>\n  </div>\n  <appfx-card-container-settings\n    *ngIf=\"showCardContainerSettings\"\n    [containerCards]=\"containerCards\"\n    (toggleCardVisibility)=\"onToggleCardVisibility($event)\"\n  ></appfx-card-container-settings>\n</div>\n",
			styles: [".card-container{display:flex;flex-wrap:wrap;margin:auto -5px}\n"],
			dependencies: [{
				kind: "directive",
				type: i6.NgIf,
				selector: "[ngIf]",
				inputs: [
					"ngIf",
					"ngIfThen",
					"ngIfElse"
				]
			}, {
				kind: "component",
				type: AppfxCardContainerSettingsComponent,
				selector: "appfx-card-container-settings",
				inputs: ["containerCards"],
				outputs: ["toggleCardVisibility"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxCardContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-card-container",
			standalone: false,
			providers: [
				A11yService,
				ContainerService,
				DragDropService,
				LayoutService,
				PersistenceService
			],
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"content-container clr-flex-row\">\n  <div class=\"card-container clr-flex-grow-1\">\n    <ng-template #cardContainer> </ng-template>\n  </div>\n  <appfx-card-container-settings\n    *ngIf=\"showCardContainerSettings\"\n    [containerCards]=\"containerCards\"\n    (toggleCardVisibility)=\"onToggleCardVisibility($event)\"\n  ></appfx-card-container-settings>\n</div>\n",
			styles: [".card-container{display:flex;flex-wrap:wrap;margin:auto -5px}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: ContainerService },
		{ type: PersistenceService },
		{ type: i0.IterableDiffers }
	],
	propDecorators: {
		containerId: [{ type: Input }],
		cards: [{ type: Input }],
		persistenceStore: [{ type: Input }],
		showCardContainerSettings: [{ type: Input }],
		dragDropEnabled: [{ type: Input }],
		cardContainer: [{
			type: ViewChild,
			args: ["cardContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}]
	}
});
var AppfxCardContainerModule = class AppfxCardContainerModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardContainerModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardContainerModule,
			declarations: [
				AppfxCardComponent,
				AppfxCardContainerComponent,
				AppfxCardContainerSettingsComponent
			],
			imports: [
				AppfxTranslateModule,
				ClrCheckboxModule,
				ClrDropdownModule,
				CommonModule,
				DragDropModule
			],
			exports: [
				AppfxCardComponent,
				AppfxCardContainerComponent,
				AppfxCardContainerSettingsComponent
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxCardContainerModule,
			imports: [
				AppfxTranslateModule,
				ClrCheckboxModule,
				ClrDropdownModule,
				CommonModule,
				DragDropModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxCardContainerModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				AppfxTranslateModule,
				ClrCheckboxModule,
				ClrDropdownModule,
				CommonModule,
				DragDropModule
			],
			declarations: [
				AppfxCardComponent,
				AppfxCardContainerComponent,
				AppfxCardContainerSettingsComponent
			],
			exports: [
				AppfxCardComponent,
				AppfxCardContainerComponent,
				AppfxCardContainerSettingsComponent
			]
		}]
	}]
});
export { AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerModule, AppfxCardContainerSettingsComponent };

//# sourceMappingURL=clr-addons-card-container.mjs.map