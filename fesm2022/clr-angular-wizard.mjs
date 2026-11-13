import * as i4 from "@angular/common";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, EventEmitter, Inject, Injectable, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewChildren, inject } from "@angular/core";
import * as i3 from "@clr/angular/utils";
import { uniqueIdFactory } from "@clr/angular/utils";
import { filter } from "rxjs/operators";
import { Subject, debounceTime, startWith, tap } from "rxjs";
import * as i5 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from "@clr/angular/icon";
import * as i8 from "@clr/angular/modal";
import { ClrModalModule } from "@clr/angular/modal";
import { ClrAlertModule } from "@clr/angular/emphasis/alert";
var ClrWizardFooterAlign;
(function(ClrWizardFooterAlign) {
	ClrWizardFooterAlign["START"] = "start";
	ClrWizardFooterAlign["END"] = "end";
})(ClrWizardFooterAlign || (ClrWizardFooterAlign = {}));
const CLR_WIZARD_FOOTER_ALIGN_VALUES = new Set(Object.values(ClrWizardFooterAlign));
function footerAlignAttribute(value) {
	if (CLR_WIZARD_FOOTER_ALIGN_VALUES.has(value)) return value;
	throw new Error(`Invalid ClrWizardFooterAlign: "${value}". Expected one of: ${[...CLR_WIZARD_FOOTER_ALIGN_VALUES].join(", ")}`);
}
var ClrWizardStepnavLayout;
(function(ClrWizardStepnavLayout) {
	ClrWizardStepnavLayout["VERTICAL"] = "vertical";
	ClrWizardStepnavLayout["HORIZONTAL"] = "horizontal";
})(ClrWizardStepnavLayout || (ClrWizardStepnavLayout = {}));
const CLR_WIZARD_STEPNAV_LAYOUT_VALUES = new Set(Object.values(ClrWizardStepnavLayout));
function stepnavLayoutAttribute(value) {
	if (CLR_WIZARD_STEPNAV_LAYOUT_VALUES.has(value)) return value;
	throw new Error(`Invalid ClrWizardStepnavLayout: "${value}". Expected one of: ${[...CLR_WIZARD_STEPNAV_LAYOUT_VALUES].join(", ")}`);
}
var ButtonHubService = class ButtonHubService {
	constructor() {
		this.buttonsReady = false;
		this._previousBtnClicked = new Subject();
		this._nextBtnClicked = new Subject();
		this._dangerBtnClicked = new Subject();
		this._cancelBtnClicked = new Subject();
		this._finishBtnClicked = new Subject();
		this._customBtnClicked = new Subject();
	}
	get previousBtnClicked() {
		return this._previousBtnClicked.asObservable();
	}
	get nextBtnClicked() {
		return this._nextBtnClicked.asObservable();
	}
	get dangerBtnClicked() {
		return this._dangerBtnClicked.asObservable();
	}
	get cancelBtnClicked() {
		return this._cancelBtnClicked.asObservable();
	}
	get finishBtnClicked() {
		return this._finishBtnClicked.asObservable();
	}
	get customBtnClicked() {
		return this._customBtnClicked.asObservable();
	}
	buttonClicked(buttonType) {
		if ("previous" === buttonType) this._previousBtnClicked.next();
		else if ("next" === buttonType) this._nextBtnClicked.next();
		else if ("finish" === buttonType) this._finishBtnClicked.next();
		else if ("danger" === buttonType) this._dangerBtnClicked.next();
		else if ("cancel" === buttonType) this._cancelBtnClicked.next();
		else this._customBtnClicked.next(buttonType);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ButtonHubService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ButtonHubService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ButtonHubService,
	decorators: [{ type: Injectable }]
});
var PageCollectionService = class PageCollectionService {
	constructor() {
		this._pagesReset = new Subject();
	}
	get pagesAsArray() {
		return this.pages ? this.pages.toArray() : [];
	}
	get pagesCount() {
		return this.pages ? this.pages.length : 0;
	}
	get penultimatePage() {
		const pageCount = this.pagesCount;
		if (pageCount < 2) return null;
		return this.pagesAsArray[pageCount - 2];
	}
	get lastPage() {
		const pageCount = this.pagesCount;
		if (pageCount < 1) return null;
		return this.pagesAsArray[pageCount - 1];
	}
	get firstPage() {
		if (!this.pagesCount) return null;
		return this.pagesAsArray[0];
	}
	get pagesReset() {
		return this._pagesReset.asObservable();
	}
	getPageById(id) {
		const foundPages = this.pages.filter((page) => id === page.id);
		return this.checkResults(foundPages, id);
	}
	getPageByIndex(index) {
		const pageCount = this.pagesCount;
		const pagesLastIndex = pageCount > 1 ? pageCount - 1 : 0;
		if (index < 0) throw new Error("Cannot retrieve page with index of " + index);
		if (index > pagesLastIndex) throw new Error("Page index is greater than length of pages array.");
		return this.pagesAsArray[index];
	}
	getPageIndex(page) {
		const index = this.pagesAsArray.indexOf(page);
		if (index < 0) throw new Error("Requested page cannot be found in collection of pages.");
		return index;
	}
	pageRange(start, end) {
		let pages = [];
		if (start < 0 || end < 0) return [];
		if (start === null || typeof start === "undefined" || isNaN(start)) return [];
		if (end === null || typeof end === "undefined" || isNaN(end)) return [];
		if (end > this.pagesCount) end = this.pagesCount;
		pages = this.pagesAsArray;
		if (end - start === 0) return [this.getPageByIndex(start)];
		end = end + 1;
		return pages.slice(start, end);
	}
	getPageRangeFromPages(page, otherPage) {
		const pageIndex = this.getPageIndex(page);
		const otherPageIndex = this.getPageIndex(otherPage);
		let startIndex;
		let endIndex;
		if (pageIndex <= otherPageIndex) {
			startIndex = pageIndex;
			endIndex = otherPageIndex;
		} else {
			startIndex = otherPageIndex;
			endIndex = pageIndex;
		}
		return this.pageRange(startIndex, endIndex);
	}
	getPreviousPage(page) {
		const previousPageIndex = this.getPageIndex(page) - 1;
		if (previousPageIndex < 0) return null;
		return this.getPageByIndex(previousPageIndex);
	}
	previousPageIsCompleted(page) {
		if (!page) return false;
		const previousPage = this.getPreviousPage(page);
		if (null === previousPage) return true;
		return previousPage.completed;
	}
	getNextPage(page) {
		const nextPageIndex = this.getPageIndex(page) + 1;
		if (nextPageIndex >= this.pagesAsArray.length) return null;
		return this.getPageByIndex(nextPageIndex);
	}
	getStepItemIdForPage(page) {
		const pageIdParts = page.id.split("-").reverse();
		pageIdParts[1] = "step";
		return pageIdParts.reverse().join("-");
	}
	commitPage(page) {
		const pageHasOverrides = page.stopNext || page.preventDefault;
		page.completed = true;
		if (!pageHasOverrides) page.onCommit.emit(page.id);
	}
	reset() {
		this.pagesAsArray.forEach((page) => {
			page.completed = false;
		});
		this._pagesReset.next(true);
	}
	updateCompletedStates() {
		const firstIncompleteIndex = this.findFirstIncompletePageIndex();
		if (firstIncompleteIndex === this.pagesAsArray.length - 1) return;
		this.pagesAsArray.forEach((page, index) => {
			if (index > firstIncompleteIndex) page.completed = false;
		});
	}
	findFirstIncompletePageIndex() {
		let returnIndex = null;
		this.pagesAsArray.forEach((page, index) => {
			if (null === returnIndex && false === page.completed) returnIndex = index;
		});
		if (null === returnIndex) returnIndex = this.pagesCount - 1;
		return returnIndex;
	}
	findFirstIncompletePage() {
		const myIncompleteIndex = this.findFirstIncompletePageIndex();
		return this.pagesAsArray[myIncompleteIndex];
	}
	checkResults(results, requestedPageId) {
		const foundPagesCount = results.length || 0;
		if (foundPagesCount > 1) throw new Error("More than one page has the requested id " + requestedPageId + ".");
		else if (foundPagesCount < 1) throw new Error("No page can be found with the id " + requestedPageId + ".");
		else return results[0];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: PageCollectionService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: PageCollectionService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: PageCollectionService,
	decorators: [{ type: Injectable }]
});
var WizardNavigationService = class WizardNavigationService {
	constructor(pageCollection, buttonService) {
		this.pageCollection = pageCollection;
		this.buttonService = buttonService;
		this.navServiceLoaded = false;
		this.forceForwardNavigation = false;
		this.wizardHasAltCancel = false;
		this.wizardHasAltNext = false;
		this.wizardStopNavigation = false;
		this.wizardDisableStepnav = false;
		this.stepnavLayout = ClrWizardStepnavLayout.VERTICAL;
		this._currentChanged = new Subject();
		this._movedToNextPage = new Subject();
		this._wizardFinished = new Subject();
		this._movedToPreviousPage = new Subject();
		this._cancelWizard = new Subject();
		this.previousButtonSubscription = buttonService.previousBtnClicked.subscribe(() => {
			const currentPage = this.currentPage;
			if (this.currentPageIsFirst || currentPage.previousStepDisabled) return;
			currentPage.previousButtonClicked.emit(currentPage);
			if (!currentPage.preventDefault) this.previous();
		});
		this.nextButtonSubscription = buttonService.nextBtnClicked.subscribe(() => {
			this.checkAndCommitCurrentPage("next");
		});
		this.dangerButtonSubscription = buttonService.dangerBtnClicked.subscribe(() => {
			this.checkAndCommitCurrentPage("danger");
		});
		this.finishButtonSubscription = buttonService.finishBtnClicked.subscribe(() => {
			this.checkAndCommitCurrentPage("finish");
		});
		this.customButtonSubscription = buttonService.customBtnClicked.subscribe((type) => {
			if (!this.wizardStopNavigation) this.currentPage.customButtonClicked.emit(type);
		});
		this.cancelButtonSubscription = buttonService.cancelBtnClicked.subscribe(() => {
			if (this.wizardStopNavigation) return;
			if (this.currentPage.preventDefault) this.currentPage.pageOnCancel.emit(this.currentPage);
			else this.cancel();
		});
		this.pagesResetSubscription = pageCollection.pagesReset.subscribe(() => {
			this.setFirstPageCurrent();
		});
	}
	get currentPageChange() {
		return this._currentChanged.asObservable();
	}
	get currentPageTitle() {
		if (!this.currentPage) return null;
		return this.currentPage.title;
	}
	get currentPageIsFirst() {
		return this.pageCollection.firstPage === this.currentPage;
	}
	get currentPageIsLast() {
		return this.pageCollection.lastPage === this.currentPage;
	}
	get currentPage() {
		if (!this._currentPage) return null;
		return this._currentPage;
	}
	set currentPage(page) {
		if (this._currentPage !== page && !this.wizardStopNavigation) {
			this._currentPage = page;
			page.onLoad.emit(page.id);
			this._currentChanged.next(page);
		}
	}
	get movedToNextPage() {
		return this._movedToNextPage.asObservable();
	}
	get wizardFinished() {
		return this._wizardFinished.asObservable();
	}
	get movedToPreviousPage() {
		return this._movedToPreviousPage.asObservable();
	}
	get notifyWizardCancel() {
		return this._cancelWizard.asObservable();
	}
	ngOnDestroy() {
		this.previousButtonSubscription.unsubscribe();
		this.nextButtonSubscription.unsubscribe();
		this.dangerButtonSubscription.unsubscribe();
		this.finishButtonSubscription.unsubscribe();
		this.customButtonSubscription.unsubscribe();
		this.cancelButtonSubscription.unsubscribe();
		this.pagesResetSubscription.unsubscribe();
	}
	next() {
		if (this.currentPageIsLast) this.checkAndCommitCurrentPage("finish");
		else this.checkAndCommitCurrentPage("next");
	}
	forceNext() {
		const currentPage = this.currentPage;
		const nextPage = this.pageCollection.getNextPage(currentPage);
		if (!nextPage) throw new Error("The wizard has no next page to go to.");
		if (this.wizardStopNavigation) return;
		if (!currentPage.completed) this.pageCollection.commitPage(currentPage);
		this.currentPage = nextPage;
	}
	checkAndCommitCurrentPage(buttonType) {
		const currentPage = this.currentPage;
		if (!currentPage.readyToComplete || this.wizardStopNavigation) return;
		const iAmTheLastPage = this.currentPageIsLast;
		const isNext = buttonType === "next";
		const isDanger = buttonType === "danger";
		const isDangerNext = isDanger && !iAmTheLastPage;
		const isFinish = buttonType === "finish" || isDanger && iAmTheLastPage;
		if (isFinish && !iAmTheLastPage) return;
		currentPage.primaryButtonClicked.emit(buttonType);
		if (isFinish) currentPage.finishButtonClicked.emit(currentPage);
		else if (isDanger) currentPage.dangerButtonClicked.emit();
		else if (isNext) currentPage.nextButtonClicked.emit();
		if (currentPage.stopNext || currentPage.preventDefault) {
			currentPage.onCommit.emit(currentPage.id);
			return;
		}
		if (isFinish) {
			if (!this.wizardHasAltNext) this.pageCollection.commitPage(currentPage);
			this._wizardFinished.next();
		}
		if (this.wizardHasAltNext) {
			this.pageCollection.commitPage(currentPage);
			if (isNext || isDangerNext) this._movedToNextPage.next(true);
			return;
		}
		if (isNext || isDangerNext) this.forceNext();
		if (!this.wizardHasAltNext && !this.wizardStopNavigation) this._movedToNextPage.next(true);
	}
	finish() {
		this.checkAndCommitCurrentPage("finish");
	}
	previous() {
		if (this.currentPageIsFirst || this.wizardStopNavigation) return;
		const previousPage = this.pageCollection.getPreviousPage(this.currentPage);
		if (!previousPage) return;
		this._movedToPreviousPage.next(true);
		if (this.forceForwardNavigation) this.currentPage.completed = false;
		this.currentPage = previousPage;
	}
	cancel() {
		this._cancelWizard.next();
	}
	goTo(pageToGoToOrId, lazyComplete = false) {
		const myPages = this.pageCollection;
		const pageToGoTo = typeof pageToGoToOrId === "string" ? myPages.getPageById(pageToGoToOrId) : pageToGoToOrId;
		const currentPage = this.currentPage;
		if (pageToGoTo === currentPage || this.wizardStopNavigation) return;
		const currentPageIndex = myPages.getPageIndex(currentPage);
		const goingForward = myPages.getPageIndex(pageToGoTo) > currentPageIndex;
		const pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
		if (!(lazyComplete || this.canGoTo(pagesToCheck))) return;
		if (goingForward && lazyComplete) pagesToCheck.forEach((page) => {
			if (page !== pageToGoTo) page.completed = true;
		});
		else if (!goingForward && this.forceForwardNavigation) pagesToCheck.forEach((page) => {
			page.completed = false;
		});
		this.currentPage = pageToGoTo;
	}
	canGoTo(pagesToCheck) {
		let okayToMove = true;
		const myPages = this.pageCollection;
		let previousPagePasses;
		if (!pagesToCheck || pagesToCheck.length < 1) return false;
		pagesToCheck.forEach((page) => {
			if (!okayToMove) return;
			if (page.completed) return;
			const previousPage = myPages.getPageIndex(page) > 0 ? myPages.getPreviousPage(page) : null;
			previousPagePasses = previousPage === null || previousPage.completed === true;
			if (!page.current && !previousPagePasses) okayToMove = false;
		});
		return okayToMove;
	}
	setLastEnabledPageCurrent() {
		const allPages = this.pageCollection.pagesAsArray;
		let lastCompletedPageIndex = null;
		allPages.forEach((page, index) => {
			if (page.completed) lastCompletedPageIndex = index;
		});
		if (lastCompletedPageIndex === null) lastCompletedPageIndex = 0;
		else if (lastCompletedPageIndex + 1 < allPages.length) lastCompletedPageIndex = lastCompletedPageIndex + 1;
		this.currentPage = allPages[lastCompletedPageIndex];
	}
	setFirstPageCurrent() {
		this.currentPage = this.pageCollection.pagesAsArray[0];
	}
	updateNavigation() {
		let toSetCurrent;
		this.pageCollection.updateCompletedStates();
		if (this.pageCollection.pagesAsArray.indexOf(this.currentPage) < 0) {
			toSetCurrent = this.pageCollection.findFirstIncompletePage();
			this.currentPage = toSetCurrent;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WizardNavigationService,
			deps: [{ token: PageCollectionService }, { token: ButtonHubService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WizardNavigationService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WizardNavigationService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: PageCollectionService }, { type: ButtonHubService }]
});
var HeaderActionService = class HeaderActionService {
	constructor(navService) {
		this.navService = navService;
	}
	get wizardHasHeaderActions() {
		const wizardHdrActions = this.wizardHeaderActions;
		if (!wizardHdrActions) return false;
		return wizardHdrActions.toArray().length > 0;
	}
	get currentPageHasHeaderActions() {
		return this.navService.currentPage ? this.navService.currentPage.hasHeaderActions : false;
	}
	get showWizardHeaderActions() {
		return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
	}
	get displayHeaderActionsWrapper() {
		return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: HeaderActionService,
			deps: [{ token: WizardNavigationService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: HeaderActionService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: HeaderActionService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: WizardNavigationService }]
});
const DEFAULT_BUTTON_TYPES = {
	cancel: "cancel",
	previous: "previous",
	next: "next",
	finish: "finish",
	danger: "danger"
};
const CUSTOM_BUTTON_TYPES = {
	cancel: "custom-cancel",
	previous: "custom-previous",
	next: "custom-next",
	finish: "custom-finish",
	danger: "custom-danger"
};
var ClrWizardButton = class ClrWizardButton {
	constructor(navService, buttonService) {
		this.navService = navService;
		this.buttonService = buttonService;
		this.type = "";
		this.disabled = false;
		this.hidden = false;
		this.wasClicked = new EventEmitter(false);
	}
	get isCancel() {
		return this.checkDefaultAndCustomType(this.type, "cancel");
	}
	get isNext() {
		return this.checkDefaultAndCustomType(this.type, "next");
	}
	get isPrevious() {
		return this.checkDefaultAndCustomType(this.type, "previous");
	}
	get isFinish() {
		return this.checkDefaultAndCustomType(this.type, "finish");
	}
	get isDanger() {
		return this.checkDefaultAndCustomType(this.type, "danger");
	}
	get isPrimaryAction() {
		return this.isNext || this.isDanger || this.isFinish;
	}
	get _disabledAttribute() {
		if (this.isDisabled) return "";
		return null;
	}
	get isDisabled() {
		const disabled = true;
		const nav = this.navService;
		const page = this.navService.currentPage;
		if (!this.buttonService.buttonsReady) return false;
		if (this.disabled || nav.wizardStopNavigation || !page) return true;
		if (this.isCancel) return false;
		if (this.isPrevious && (nav.currentPageIsFirst || page.previousStepDisabled)) return disabled;
		if (this.isDanger && !page.readyToComplete) return disabled;
		if (this.isNext && (nav.currentPageIsLast || !page.readyToComplete)) return disabled;
		if (this.isFinish && (!nav.currentPageIsLast || !page.readyToComplete)) return disabled;
		return false;
	}
	get isHidden() {
		const hidden = true;
		const nav = this.navService;
		if (!this.buttonService.buttonsReady) return false;
		if (this.hidden) return true;
		if (this.isCancel) return false;
		if (this.isPrevious && nav.currentPageIsFirst) return hidden;
		if (this.isNext && nav.currentPageIsLast) return hidden;
		if (this.isFinish && !nav.currentPageIsLast) return hidden;
		return false;
	}
	click() {
		if (this.isDisabled) return;
		this.wasClicked.emit(this.type);
		this.buttonService.buttonClicked(this.type);
	}
	checkDefaultAndCustomType(valueToCheck = "", typeToLookUp) {
		if (DEFAULT_BUTTON_TYPES[typeToLookUp] === valueToCheck) return true;
		if (CUSTOM_BUTTON_TYPES[typeToLookUp] === valueToCheck) return true;
		return false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardButton,
			deps: [{ token: WizardNavigationService }, { token: ButtonHubService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardButton,
			isStandalone: false,
			selector: "clr-wizard-button",
			inputs: {
				type: "type",
				disabled: ["clrWizardButtonDisabled", "disabled"],
				hidden: ["clrWizardButtonHidden", "hidden"]
			},
			outputs: { wasClicked: "clrWizardButtonClicked" },
			host: {
				properties: { "attr.aria-hidden": "isHidden" },
				classAttribute: "clr-wizard-btn-wrapper"
			},
			ngImport: i0,
			template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardButton,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-wizard-button",
			template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `,
			host: {
				class: "clr-wizard-btn-wrapper",
				"[attr.aria-hidden]": "isHidden"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: WizardNavigationService }, { type: ButtonHubService }],
	propDecorators: {
		type: [{
			type: Input,
			args: ["type"]
		}],
		disabled: [{
			type: Input,
			args: ["clrWizardButtonDisabled"]
		}],
		hidden: [{
			type: Input,
			args: ["clrWizardButtonHidden"]
		}],
		wasClicked: [{
			type: Output,
			args: ["clrWizardButtonClicked"]
		}]
	}
});
let wizardHeaderActionIndex = 0;
var ClrWizardHeaderAction = class ClrWizardHeaderAction {
	constructor() {
		this.title = "";
		this._id = (wizardHeaderActionIndex++).toString();
		this.disabled = false;
		this.headerActionClicked = new EventEmitter(false);
	}
	get id() {
		return `clr-wizard-header-action-${this._id}`;
	}
	click() {
		if (this.disabled) return;
		this.headerActionClicked.emit(this._id);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardHeaderAction,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardHeaderAction,
			isStandalone: false,
			selector: "clr-wizard-header-action",
			inputs: {
				title: "title",
				_id: ["id", "_id"],
				disabled: ["clrWizardHeaderActionDisabled", "disabled"]
			},
			outputs: { headerActionClicked: "actionClicked" },
			host: { classAttribute: "clr-wizard-header-action-wrapper" },
			ngImport: i0,
			template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardHeaderAction,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-wizard-header-action",
			template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `,
			host: { class: "clr-wizard-header-action-wrapper" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: {
		title: [{
			type: Input,
			args: ["title"]
		}],
		_id: [{
			type: Input,
			args: ["id"]
		}],
		disabled: [{
			type: Input,
			args: ["clrWizardHeaderActionDisabled"]
		}],
		headerActionClicked: [{
			type: Output,
			args: ["actionClicked"]
		}]
	}
});
var ClrWizardPageButtons = class ClrWizardPageButtons {
	constructor(pageButtonsTemplateRef) {
		this.pageButtonsTemplateRef = pageButtonsTemplateRef;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardPageButtons,
			deps: [{ token: i0.TemplateRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardPageButtons,
			isStandalone: false,
			selector: "[clrPageButtons]",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardPageButtons,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrPageButtons]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.TemplateRef }]
});
var ClrWizardPageHeaderActions = class ClrWizardPageHeaderActions {
	constructor(pageHeaderActionsTemplateRef) {
		this.pageHeaderActionsTemplateRef = pageHeaderActionsTemplateRef;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardPageHeaderActions,
			deps: [{ token: i0.TemplateRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardPageHeaderActions,
			isStandalone: false,
			selector: "[clrPageHeaderActions]",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardPageHeaderActions,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrPageHeaderActions]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.TemplateRef }]
});
var ClrWizardPageNavTitle = class ClrWizardPageNavTitle {
	constructor(pageNavTitleTemplateRef) {
		this.pageNavTitleTemplateRef = pageNavTitleTemplateRef;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardPageNavTitle,
			deps: [{ token: i0.TemplateRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardPageNavTitle,
			isStandalone: false,
			selector: "[clrPageNavTitle]",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardPageNavTitle,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrPageNavTitle]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.TemplateRef }]
});
var ClrWizardPageTitle = class ClrWizardPageTitle {
	constructor(pageTitleTemplateRef) {
		this.pageTitleTemplateRef = pageTitleTemplateRef;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardPageTitle,
			deps: [{ token: i0.TemplateRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardPageTitle,
			isStandalone: false,
			selector: "[clrPageTitle]",
			inputs: { headingLevel: ["clrHeadingLevel", "headingLevel"] },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardPageTitle,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrPageTitle]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: i0.TemplateRef }],
	propDecorators: { headingLevel: [{
		type: Input,
		args: ["clrHeadingLevel"]
	}] }
});
let wizardPageIndex = 0;
var ClrWizardPage = class ClrWizardPage {
	constructor(navService, pageCollection, buttonService) {
		this.navService = navService;
		this.pageCollection = pageCollection;
		this.buttonService = buttonService;
		this._id = (wizardPageIndex++).toString();
		this.preventDefault = false;
		this.nextStepDisabledChange = new EventEmitter();
		this.previousStepDisabledChange = new EventEmitter();
		this.stopCancelChange = new EventEmitter();
		this.onCommit = new EventEmitter(false);
		this.onLoad = new EventEmitter();
		this.pageOnCancel = new EventEmitter();
		this.finishButtonClicked = new EventEmitter();
		this.previousButtonClicked = new EventEmitter();
		this.nextButtonClicked = new EventEmitter();
		this.dangerButtonClicked = new EventEmitter();
		this.primaryButtonClicked = new EventEmitter();
		this.customButtonClicked = new EventEmitter();
		this._nextStepDisabled = false;
		this._previousStepDisabled = false;
		this._hasError = false;
		this._stopCancel = false;
		this._stopNext = false;
		this._complete = false;
	}
	get nextStepDisabled() {
		return this._nextStepDisabled;
	}
	set nextStepDisabled(val) {
		const valBool = !!val;
		if (valBool !== this._nextStepDisabled) {
			this._nextStepDisabled = valBool;
			this.nextStepDisabledChange.emit(valBool);
		}
	}
	get previousStepDisabled() {
		return this._previousStepDisabled;
	}
	set previousStepDisabled(val) {
		const valBool = !!val;
		if (valBool !== this._previousStepDisabled) {
			this._previousStepDisabled = valBool;
			this.previousStepDisabledChange.emit(valBool);
		}
	}
	get hasError() {
		return this._hasError;
	}
	set hasError(val) {
		const valBool = !!val;
		if (valBool !== this._hasError) this._hasError = valBool;
	}
	get stopCancel() {
		return this._stopCancel;
	}
	set stopCancel(val) {
		const valBool = !!val;
		if (valBool !== this._stopCancel) {
			this._stopCancel = valBool;
			this.stopCancelChange.emit(valBool);
		}
	}
	get stopNext() {
		return this._stopNext;
	}
	set stopNext(val) {
		const valBool = !!val;
		if (valBool !== this._stopNext) this._stopNext = valBool;
	}
	get id() {
		if (!this._id && this._id !== 0 || this._id < 0) this._id = (wizardPageIndex++).toString();
		return `clr-wizard-page-${this._id}`;
	}
	get readyToComplete() {
		return !this.nextStepDisabled;
	}
	get completed() {
		return this._complete && this.readyToComplete;
	}
	set completed(value) {
		this._complete = value;
	}
	get current() {
		return this.navService.currentPage === this;
	}
	get disabled() {
		return !this.enabled;
	}
	get enabled() {
		return this.current || this.completed || this.previousCompleted;
	}
	get previousCompleted() {
		const previousPage = this.pageCollection.getPreviousPage(this);
		if (!previousPage) return true;
		return previousPage.completed;
	}
	get title() {
		return this.pageTitle?.pageTitleTemplateRef;
	}
	get navTitle() {
		if (this.pageNavTitle) return this.pageNavTitle.pageNavTitleTemplateRef;
		return this.pageTitle?.pageTitleTemplateRef;
	}
	get headerActions() {
		if (!this._headerActions) return;
		return this._headerActions.pageHeaderActionsTemplateRef;
	}
	get hasHeaderActions() {
		return !!this._headerActions;
	}
	get buttons() {
		if (!this._buttons) return;
		return this._buttons.pageButtonsTemplateRef;
	}
	get hasButtons() {
		return !!this._buttons;
	}
	get stepItemId() {
		return this.pageCollection.getStepItemIdForPage(this);
	}
	ngOnInit() {
		const navService = this.navService;
		if (!navService.currentPage && !navService.navServiceLoaded) {
			this.makeCurrent();
			this.navService.navServiceLoaded = true;
		}
	}
	makeCurrent() {
		this.navService.currentPage = this;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardPage,
			deps: [
				{ token: WizardNavigationService },
				{ token: PageCollectionService },
				{ token: ButtonHubService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardPage,
			isStandalone: false,
			selector: "clr-wizard-page",
			inputs: {
				_id: ["id", "_id"],
				preventDefault: ["clrWizardPagePreventDefault", "preventDefault"],
				nextStepDisabled: ["clrWizardPageNextDisabled", "nextStepDisabled"],
				previousStepDisabled: ["clrWizardPagePreviousDisabled", "previousStepDisabled"],
				hasError: ["clrWizardPageHasError", "hasError"],
				stopCancel: ["clrWizardPagePreventDefaultCancel", "stopCancel"],
				stopNext: ["clrWizardPagePreventDefaultNext", "stopNext"]
			},
			outputs: {
				nextStepDisabledChange: "clrWizardPageNextDisabledChange",
				previousStepDisabledChange: "clrWizardPagePreviousDisabledChange",
				stopCancelChange: "clrWizardPagePreventDefaultCancelChange",
				onCommit: "clrWizardPageOnCommit",
				onLoad: "clrWizardPageOnLoad",
				pageOnCancel: "clrWizardPageOnCancel",
				finishButtonClicked: "clrWizardPageFinish",
				previousButtonClicked: "clrWizardPagePrevious",
				nextButtonClicked: "clrWizardPageNext",
				dangerButtonClicked: "clrWizardPageDanger",
				primaryButtonClicked: "clrWizardPagePrimary",
				customButtonClicked: "clrWizardPageCustomButton"
			},
			host: { properties: {
				"id": "id",
				"attr.aria-hidden": "!current",
				"attr.aria-labelledby": "stepItemId",
				"class.active": "current",
				"class.clr-wizard-page": "true"
			} },
			queries: [
				{
					propertyName: "pageTitle",
					first: true,
					predicate: ClrWizardPageTitle,
					static: true
				},
				{
					propertyName: "pageNavTitle",
					first: true,
					predicate: ClrWizardPageNavTitle,
					static: true
				},
				{
					propertyName: "_buttons",
					first: true,
					predicate: ClrWizardPageButtons,
					static: true
				},
				{
					propertyName: "_headerActions",
					first: true,
					predicate: ClrWizardPageHeaderActions,
					descendants: true,
					static: true
				}
			],
			ngImport: i0,
			template: "<ng-content></ng-content>",
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardPage,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-wizard-page",
			template: "<ng-content></ng-content>",
			host: {
				"[id]": "id",
				"[attr.aria-hidden]": "!current",
				"[attr.aria-labelledby]": "stepItemId",
				"[class.active]": "current",
				"[class.clr-wizard-page]": "true"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: WizardNavigationService },
		{ type: PageCollectionService },
		{ type: ButtonHubService }
	],
	propDecorators: {
		_id: [{
			type: Input,
			args: ["id"]
		}],
		preventDefault: [{
			type: Input,
			args: ["clrWizardPagePreventDefault"]
		}],
		nextStepDisabledChange: [{
			type: Output,
			args: ["clrWizardPageNextDisabledChange"]
		}],
		previousStepDisabledChange: [{
			type: Output,
			args: ["clrWizardPagePreviousDisabledChange"]
		}],
		stopCancelChange: [{
			type: Output,
			args: ["clrWizardPagePreventDefaultCancelChange"]
		}],
		onCommit: [{
			type: Output,
			args: ["clrWizardPageOnCommit"]
		}],
		onLoad: [{
			type: Output,
			args: ["clrWizardPageOnLoad"]
		}],
		pageOnCancel: [{
			type: Output,
			args: ["clrWizardPageOnCancel"]
		}],
		finishButtonClicked: [{
			type: Output,
			args: ["clrWizardPageFinish"]
		}],
		previousButtonClicked: [{
			type: Output,
			args: ["clrWizardPagePrevious"]
		}],
		nextButtonClicked: [{
			type: Output,
			args: ["clrWizardPageNext"]
		}],
		dangerButtonClicked: [{
			type: Output,
			args: ["clrWizardPageDanger"]
		}],
		primaryButtonClicked: [{
			type: Output,
			args: ["clrWizardPagePrimary"]
		}],
		customButtonClicked: [{
			type: Output,
			args: ["clrWizardPageCustomButton"]
		}],
		pageTitle: [{
			type: ContentChild,
			args: [ClrWizardPageTitle, {
				static: true,
				descendants: false
			}]
		}],
		pageNavTitle: [{
			type: ContentChild,
			args: [ClrWizardPageNavTitle, {
				static: true,
				descendants: false
			}]
		}],
		_buttons: [{
			type: ContentChild,
			args: [ClrWizardPageButtons, {
				static: true,
				descendants: false
			}]
		}],
		_headerActions: [{
			type: ContentChild,
			args: [ClrWizardPageHeaderActions, { static: true }]
		}],
		nextStepDisabled: [{
			type: Input,
			args: ["clrWizardPageNextDisabled"]
		}],
		previousStepDisabled: [{
			type: Input,
			args: ["clrWizardPagePreviousDisabled"]
		}],
		hasError: [{
			type: Input,
			args: ["clrWizardPageHasError"]
		}],
		stopCancel: [{
			type: Input,
			args: ["clrWizardPagePreventDefaultCancel"]
		}],
		stopNext: [{
			type: Input,
			args: ["clrWizardPagePreventDefaultNext"]
		}]
	}
});
var ClrWizardTitle = class ClrWizardTitle {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardTitle,
			deps: [],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrWizardTitle,
			isStandalone: false,
			selector: "clr-wizard-title",
			inputs: { headingLevel: ["clrHeadingLevel", "headingLevel"] },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardTitle,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-wizard-title",
			standalone: false
		}]
	}],
	propDecorators: { headingLevel: [{
		type: Input,
		args: ["clrHeadingLevel"]
	}] }
});
var ClrWizardStepnavItem = class ClrWizardStepnavItem {
	constructor(navService, pageCollection, commonStrings, elementRef) {
		this.navService = navService;
		this.pageCollection = pageCollection;
		this.commonStrings = commonStrings;
		this.elementRef = elementRef;
		this.skipNextScroll = false;
	}
	get id() {
		this.pageGuard();
		return this.pageCollection.getStepItemIdForPage(this.page);
	}
	get stepAriaCurrent() {
		return this.isCurrent && "step";
	}
	get isDisabled() {
		this.pageGuard();
		return this.page.disabled || this.navService.wizardStopNavigation || this.navService.wizardDisableStepnav;
	}
	get isCurrent() {
		this.pageGuard();
		return this.page.current;
	}
	get isComplete() {
		this.pageGuard();
		return this.page.completed;
	}
	get hasError() {
		this.pageGuard();
		return this.page.hasError && this.isComplete;
	}
	get canNavigate() {
		this.pageGuard();
		return this.pageCollection.previousPageIsCompleted(this.page);
	}
	get stepIconId() {
		return `${this.id}-step-icon`;
	}
	get stepTextId() {
		return `${this.id}-step-text`;
	}
	get stepNumberId() {
		return `${this.id}-step-number`;
	}
	get stepTitleId() {
		return `${this.id}-step-title`;
	}
	get labelledby() {
		const textIds = [
			this.stepTextId,
			this.stepNumberId,
			this.stepTitleId
		];
		return (this.isComplete ? [this.stepIconId, ...textIds] : textIds).join(" ");
	}
	get icon() {
		if (this.isCurrent && this.navService.stepnavLayout !== ClrWizardStepnavLayout.HORIZONTAL) return {
			shape: "dot-circle",
			label: this.commonStrings.keys.wizardStepCurrent || this.commonStrings.keys.timelineStepCurrent
		};
		else if (this.hasError) return {
			shape: "error-standard",
			label: this.commonStrings.keys.wizardStepError || this.commonStrings.keys.timelineStepError
		};
		else if (this.isComplete) return {
			shape: "success-standard",
			label: this.commonStrings.keys.wizardStepSuccess || this.commonStrings.keys.timelineStepSuccess
		};
		else return null;
	}
	ngOnInit() {
		this.subscription = this.ensureCurrentStepIsScrolledIntoView().subscribe();
	}
	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
	click() {
		this.pageGuard();
		if (this.isDisabled || this.isCurrent) return;
		this.skipNextScroll = true;
		this.navService.goTo(this.page);
	}
	scrollIntoView() {
		this.elementRef.nativeElement.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest"
		});
	}
	pageGuard() {
		if (!this.page) throw new Error("Wizard stepnav item is not associated with a wizard page.");
	}
	ensureCurrentStepIsScrolledIntoView() {
		let scrollBehavior = "auto";
		return this.navService.currentPageChange.pipe(startWith(this.navService.currentPage), debounceTime(1), tap((currentPage) => {
			if (!this.skipNextScroll && currentPage === this.page) this.elementRef.nativeElement.scrollIntoView({
				behavior: scrollBehavior,
				block: "center",
				inline: "center"
			});
			scrollBehavior = "smooth";
			this.skipNextScroll = false;
		}));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardStepnavItem,
			deps: [
				{ token: WizardNavigationService },
				{ token: PageCollectionService },
				{ token: i3.ClrCommonStringsService },
				{ token: i0.ElementRef }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrWizardStepnavItem,
			isStandalone: false,
			selector: "[clr-wizard-stepnav-item]",
			inputs: { page: "page" },
			host: {
				listeners: { "focusin": "scrollIntoView()" },
				properties: {
					"id": "id",
					"attr.aria-current": "stepAriaCurrent",
					"attr.aria-controls": "page.id",
					"class.clr-nav-link": "true",
					"class.nav-item": "true",
					"class.active": "isCurrent",
					"class.disabled": "isDisabled",
					"class.no-click": "!canNavigate",
					"class.complete": "isComplete",
					"class.error": "hasError"
				}
			},
			ngImport: i0,
			template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        @if (icon; as icon) {
          <cds-icon
            [id]="stepIconId"
            role="img"
            class="clr-wizard-stepnav-link-icon"
            [shape]="icon.shape"
            [attr.aria-label]="icon.label"
          ></cds-icon>
        }
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i4.NgTemplateOutlet,
				selector: "[ngTemplateOutlet]",
				inputs: [
					"ngTemplateOutletContext",
					"ngTemplateOutlet",
					"ngTemplateOutletInjector"
				]
			}, {
				kind: "component",
				type: i5.ClrIcon,
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
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardStepnavItem,
	decorators: [{
		type: Component,
		args: [{
			selector: "[clr-wizard-stepnav-item]",
			template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        @if (icon; as icon) {
          <cds-icon
            [id]="stepIconId"
            role="img"
            class="clr-wizard-stepnav-link-icon"
            [shape]="icon.shape"
            [attr.aria-label]="icon.label"
          ></cds-icon>
        }
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `,
			host: {
				"[id]": "id",
				"[attr.aria-current]": "stepAriaCurrent",
				"[attr.aria-controls]": "page.id",
				"[class.clr-nav-link]": "true",
				"[class.nav-item]": "true",
				"[class.active]": "isCurrent",
				"[class.disabled]": "isDisabled",
				"[class.no-click]": "!canNavigate",
				"[class.complete]": "isComplete",
				"[class.error]": "hasError",
				"(focusin)": "scrollIntoView()"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: WizardNavigationService },
		{ type: PageCollectionService },
		{ type: i3.ClrCommonStringsService },
		{ type: i0.ElementRef }
	],
	propDecorators: { page: [{
		type: Input,
		args: ["page"]
	}] }
});
var ClrWizardStepnav = class ClrWizardStepnav {
	constructor(pageService, navService, elementRef) {
		this.pageService = pageService;
		this.navService = navService;
		this.elementRef = elementRef;
		this.showScrollLeftButton = false;
		this.showScrollRightButton = false;
		this.firstItemVisible = true;
		this.lastItemVisible = true;
		this.changeDetectorRef = inject(ChangeDetectorRef);
	}
	get stepnavLayout() {
		return this.navService.stepnavLayout;
	}
	ngAfterViewInit() {
		if (this.stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {
			this.setupIntersectionObserver();
			this.stepnavItems.notifyOnChanges();
			this.subscription = this.stepnavItems.changes.pipe(startWith(void 0)).subscribe(() => {
				this.observeEdgeItems();
			});
		}
	}
	ngOnDestroy() {
		this.subscription?.unsubscribe();
		this.intersectionObserver?.disconnect();
	}
	scrollLeft() {
		this.scroll("left");
	}
	scrollRight() {
		this.scroll("right");
	}
	setupIntersectionObserver() {
		const scrollContainer = this.elementRef.nativeElement.querySelector(".clr-wizard-stepnav-list");
		this.intersectionObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const target = entry.target;
				const isFirst = target === this.stepnavItems.first?.elementRef.nativeElement;
				const isLast = target === this.stepnavItems.last?.elementRef.nativeElement;
				if (isFirst) this.firstItemVisible = entry.isIntersecting;
				if (isLast) this.lastItemVisible = entry.isIntersecting;
			}
			this.showScrollLeftButton = !this.firstItemVisible;
			this.showScrollRightButton = !this.lastItemVisible;
			this.changeDetectorRef.markForCheck();
		}, {
			root: scrollContainer,
			threshold: .99
		});
	}
	observeEdgeItems() {
		this.intersectionObserver.disconnect();
		this.firstItemVisible = true;
		this.lastItemVisible = true;
		const first = this.stepnavItems.first;
		const last = this.stepnavItems.last;
		if (first) this.intersectionObserver.observe(first.elementRef.nativeElement);
		if (last && last !== first) this.intersectionObserver.observe(last.elementRef.nativeElement);
	}
	scroll(direction) {
		const scrollContainer = this.elementRef.nativeElement.querySelector(".clr-wizard-stepnav-list");
		const scrollAmount = scrollContainer.clientWidth * .5;
		scrollContainer.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth"
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardStepnav,
			deps: [
				{ token: PageCollectionService },
				{ token: WizardNavigationService },
				{ token: i0.ElementRef }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrWizardStepnav,
			isStandalone: false,
			selector: "clr-wizard-stepnav",
			inputs: { label: "label" },
			host: { classAttribute: "clr-wizard-stepnav" },
			viewQueries: [{
				propertyName: "stepnavItems",
				predicate: ClrWizardStepnavItem,
				descendants: true
			}],
			ngImport: i0,
			template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-left"
        (click)="scrollLeft()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="left"></cds-icon>
      </button>
    }

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton,
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-right"
        (click)="scrollRight()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="right"></cds-icon>
      </button>
    }
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i4.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "component",
					type: i5.ClrIcon,
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
					kind: "component",
					type: ClrWizardStepnavItem,
					selector: "[clr-wizard-stepnav-item]",
					inputs: ["page"]
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
	type: ClrWizardStepnav,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-wizard-stepnav",
			template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-left"
        (click)="scrollLeft()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="left"></cds-icon>
      </button>
    }

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton,
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-right"
        (click)="scrollRight()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="right"></cds-icon>
      </button>
    }
  `,
			host: { class: "clr-wizard-stepnav" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: PageCollectionService },
		{ type: WizardNavigationService },
		{ type: i0.ElementRef }
	],
	propDecorators: {
		label: [{ type: Input }],
		stepnavItems: [{
			type: ViewChildren,
			args: [ClrWizardStepnavItem]
		}]
	}
});
var ClrWizard = class ClrWizard {
	constructor(platformId, commonStrings, navService, pageCollection, buttonService, headerActionService, elementRef, differs) {
		this.platformId = platformId;
		this.commonStrings = commonStrings;
		this.navService = navService;
		this.pageCollection = pageCollection;
		this.buttonService = buttonService;
		this.headerActionService = headerActionService;
		this.elementRef = elementRef;
		this.stepnavAriaLabel = this.commonStrings.keys.wizardStepnavAriaLabel;
		this.stepnavLayout = ClrWizardStepnavLayout.VERTICAL;
		this.size = "xl";
		this.inPage = false;
		this.inPageFillContentArea = false;
		this.hideFooter = false;
		this._footerAlign = null;
		this.closable = true;
		this._stopModalAnimations = false;
		this._openChanged = new EventEmitter(false);
		this.onCancel = new EventEmitter(false);
		this.wizardFinished = new EventEmitter(false);
		this.onReset = new EventEmitter(false);
		this.currentPageChange = new EventEmitter(false);
		this.onMoveNext = new EventEmitter(false);
		this.onMovePrevious = new EventEmitter(false);
		this._open = false;
		this.wizardId = uniqueIdFactory();
		this.ClrWizardFooterAlign = ClrWizardFooterAlign;
		this.ClrWizardStepnavLayout = ClrWizardStepnavLayout;
		this._forceForward = false;
		this._stopNext = false;
		this._stopCancel = false;
		this._stopNavigation = false;
		this._disableStepnav = false;
		this.subscriptions = [];
		this.subscriptions.push(this.listenForNextPageChanges(), this.listenForPreviousPageChanges(), this.listenForCancelChanges(), this.listenForFinishedChanges(), this.listenForPageChanges());
		this.differ = differs.find([]).create(null);
	}
	get forceForward() {
		return this._forceForward;
	}
	set forceForward(value) {
		this._forceForward = !!value;
		this.navService.forceForwardNavigation = value;
	}
	set clrWizardOpen(open) {
		if (open) this.buttonService.buttonsReady = true;
		this._open = open;
	}
	get stopNext() {
		return this._stopNext;
	}
	set stopNext(value) {
		this._stopNext = !!value;
		this.navService.wizardHasAltNext = value;
	}
	get stopCancel() {
		return this._stopCancel;
	}
	set stopCancel(value) {
		this._stopCancel = !!value;
		this.navService.wizardHasAltCancel = value;
	}
	get stopNavigation() {
		return this._stopNavigation;
	}
	set stopNavigation(value) {
		this._stopNavigation = !!value;
		this.navService.wizardStopNavigation = value;
	}
	get disableStepnav() {
		return this._disableStepnav;
	}
	set disableStepnav(value) {
		this._disableStepnav = !!value;
		this.navService.wizardDisableStepnav = value;
	}
	get currentPage() {
		return this.navService.currentPage;
	}
	set currentPage(page) {
		this.navService.goTo(page, true);
	}
	get isLast() {
		return this.navService.currentPageIsLast;
	}
	get isFirst() {
		return this.navService.currentPageIsFirst;
	}
	get isInline() {
		return this.elementRef.nativeElement.classList.contains("clr-wizard--inline");
	}
	get showHeader() {
		return !!this.navService.currentPage?.pageTitle || this.stepnavLayout === ClrWizardStepnavLayout.VERTICAL && this.headerActionService.displayHeaderActionsWrapper;
	}
	get showFooter() {
		return !this.hideFooter && (this.navService.currentPage?.hasButtons || this.wizardButtons?.length > 0);
	}
	get footerAlign() {
		if (this._footerAlign !== null) return this._footerAlign;
		return this.inPage ? ClrWizardFooterAlign.START : ClrWizardFooterAlign.END;
	}
	get stopModalAnimations() {
		return this._stopModalAnimations;
	}
	ngAfterContentInit() {
		this.navService.stepnavLayout = this.stepnavLayout;
		this.pageCollection.pages = this.pages;
		this.headerActionService.wizardHeaderActions = this.headerActions;
		if (this.inPage) this.open();
		this.initializeButtons();
	}
	ngDoCheck() {
		this.updateNavOnPageChanges();
	}
	ngOnDestroy() {
		this.subscriptions.forEach((s) => s.unsubscribe());
	}
	finish(skipChecksAndEmits = true) {
		if (skipChecksAndEmits) this.forceFinish();
		else this.navService.finish();
	}
	forceFinish() {
		if (this.stopNavigation) return;
		this.close();
	}
	open() {
		this._open = true;
		if (!this.currentPage) this.navService.setFirstPageCurrent();
		this.buttonService.buttonsReady = true;
		this._openChanged.emit(true);
	}
	close() {
		if (this.stopNavigation) return;
		this._open = false;
		this._openChanged.emit(false);
	}
	toggle(open) {
		if (open) this.open();
		else this.close();
	}
	previous() {
		this.navService.previous();
	}
	next(skipChecksAndEmits = true) {
		if (skipChecksAndEmits) this.forceNext();
		else this.navService.next();
	}
	forceNext() {
		this.navService.forceNext();
	}
	cancel() {
		this.navService.cancel();
	}
	modalCancel() {
		if (this.closable) this.checkAndCancel();
	}
	checkAndCancel() {
		const currentPage = this.currentPage;
		const currentPageHasOverrides = currentPage.stopCancel || currentPage.preventDefault;
		if (this.stopNavigation) return;
		currentPage.pageOnCancel.emit();
		if (!currentPageHasOverrides) this.onCancel.emit();
		if (!this.stopCancel && !currentPageHasOverrides) this.close();
	}
	goTo(pageId) {
		if (!pageId) return;
		this.navService.goTo(pageId);
	}
	reset() {
		this.pageCollection.reset();
		this.onReset.emit();
	}
	listenForNextPageChanges() {
		return this.navService.movedToNextPage.pipe(filter(() => isPlatformBrowser(this.platformId))).subscribe(() => {
			this.onMoveNext.emit();
			this.pageTitle?.nativeElement.focus();
		});
	}
	listenForPreviousPageChanges() {
		return this.navService.movedToPreviousPage.pipe(filter(() => isPlatformBrowser(this.platformId))).subscribe(() => {
			this.onMovePrevious.emit();
			this.pageTitle?.nativeElement.focus();
		});
	}
	listenForCancelChanges() {
		return this.navService.notifyWizardCancel.subscribe(() => this.checkAndCancel());
	}
	listenForFinishedChanges() {
		return this.navService.wizardFinished.subscribe(() => this.emitWizardFinished());
	}
	listenForPageChanges() {
		return this.navService.currentPageChange.subscribe(() => {
			this.pageTitle?.nativeElement.focus();
			this.currentPageChange.emit();
			this.bodyElementRef?.nativeElement.scrollTo(0, 0);
		});
	}
	updateNavOnPageChanges() {
		const changes = this.differ.diff(this.pages);
		if (changes) {
			changes.forEachAddedItem(() => this.navService.updateNavigation());
			changes.forEachRemovedItem(() => this.navService.updateNavigation());
		}
	}
	initializeButtons() {
		if (this._open) this.buttonService.buttonsReady = true;
	}
	emitWizardFinished() {
		if (!this.stopNext) this.forceFinish();
		this.wizardFinished.emit();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizard,
			deps: [
				{ token: PLATFORM_ID },
				{ token: i3.ClrCommonStringsService },
				{ token: WizardNavigationService },
				{ token: PageCollectionService },
				{ token: ButtonHubService },
				{ token: HeaderActionService },
				{ token: i0.ElementRef },
				{ token: i0.IterableDiffers }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrWizard,
			isStandalone: false,
			selector: "clr-wizard",
			inputs: {
				stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"],
				stepnavLayout: [
					"clrWizardStepnavLayout",
					"stepnavLayout",
					stepnavLayoutAttribute
				],
				size: ["clrWizardSize", "size"],
				inPage: ["clrWizardInPage", "inPage"],
				inPageFillContentArea: ["clrWizardInPageFillContentArea", "inPageFillContentArea"],
				hideFooter: ["clrWizardHideFooter", "hideFooter"],
				_footerAlign: [
					"clrWizardFooterAlign",
					"_footerAlign",
					footerAlignAttribute
				],
				closable: ["clrWizardClosable", "closable"],
				_stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"],
				forceForward: ["clrWizardForceForwardNavigation", "forceForward"],
				clrWizardOpen: "clrWizardOpen",
				stopNext: ["clrWizardPreventDefaultNext", "stopNext"],
				stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"],
				stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"],
				disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"]
			},
			outputs: {
				_openChanged: "clrWizardOpenChange",
				onCancel: "clrWizardOnCancel",
				wizardFinished: "clrWizardOnFinish",
				onReset: "clrWizardOnReset",
				currentPageChange: "clrWizardCurrentPageChange",
				onMoveNext: "clrWizardOnNext",
				onMovePrevious: "clrWizardOnPrevious"
			},
			host: { properties: {
				"class.clr-wizard": "true",
				"class.wizard-md": "size == 'md'",
				"class.wizard-lg": "size == 'lg'",
				"class.wizard-xl": "size == 'xl'",
				"class.wizard-in-page": "inPage",
				"class.wizard-in-page--fill-content-area": "inPage && inPageFillContentArea",
				"class.wizard-horizontal": "stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL"
			} },
			providers: [
				WizardNavigationService,
				PageCollectionService,
				ButtonHubService,
				HeaderActionService
			],
			queries: [
				{
					propertyName: "wizardTitle",
					first: true,
					predicate: ClrWizardTitle,
					descendants: true
				},
				{
					propertyName: "pages",
					predicate: ClrWizardPage
				},
				{
					propertyName: "wizardButtons",
					predicate: ClrWizardButton
				},
				{
					propertyName: "headerActions",
					predicate: ClrWizardHeaderAction
				}
			],
			viewQueries: [{
				propertyName: "pageTitle",
				first: true,
				predicate: ["pageTitle"],
				descendants: true
			}, {
				propertyName: "bodyElementRef",
				first: true,
				predicate: ["body"],
				descendants: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-template #coreWizardContent>\n  <div class=\"clr-wizard-content-wrapper\">\n    @if (stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {\n    <div class=\"clr-wizard-title-wrapper\">\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n    </div>\n    }\n\n    <div class=\"clr-wizard-stepnav-wrapper\" role=\"region\">\n      @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      }\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"clr-wizard-main-content\">\n      @if (showHeader) {\n      <div class=\"clr-wizard-header\">\n        @if (navService.currentPage?.pageTitle) {\n        <div class=\"clr-wizard-page-title-wrapper\" cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"clr-wizard-page-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"clr-wizard-page-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        } @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n        <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n        }\n      </div>\n      }\n\n      <div #body class=\"clr-wizard-body-wrapper\">\n        <div class=\"clr-wizard-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n\n      @if (showFooter) {\n      <div class=\"clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            class=\"clr-wizard-footer-buttons-wrapper\"\n            [ngClass]=\"{'align-start': footerAlign === ClrWizardFooterAlign.START, 'align-end': footerAlign === ClrWizardFooterAlign.END}\"\n          >\n            @if (navService.currentPage?.hasButtons) {\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n            } @else {\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n            }\n          </div>\n        </div>\n      </div>\n      }\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #wizardTitleTemplate>\n  <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n    <ng-content select=\"clr-wizard-title\"></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #wizardActionsTemplate>\n  @if (headerActionService.displayHeaderActionsWrapper) {\n  <div class=\"clr-wizard-header-actions-wrapper\">\n    @if (headerActionService.showWizardHeaderActions) {\n    <ng-content select=\"clr-wizard-header-action\"></ng-content>\n    } @if (headerActionService.currentPageHasHeaderActions) {\n    <ng-template [ngTemplateOutlet]=\"(navService.currentPage?.headerActions ?? null)\"></ng-template>\n    }\n  </div>\n  } @if (closable && !inPage) {\n  <button type=\"button\" class=\"close\" [attr.aria-label]=\"commonStrings.keys.close\" (click)=\"modalCancel()\">\n    <cds-icon shape=\"window-close\"></cds-icon>\n  </button>\n  }\n</ng-template>\n\n@if (inPage) {\n<ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n} @else {\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <ng-template #clrInternalModalContentTemplate>\n    <ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n  </ng-template>\n</clr-modal>\n}\n",
			dependencies: [
				{
					kind: "directive",
					type: i4.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i4.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: i5.ClrIcon,
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
					kind: "component",
					type: i8.ClrModal,
					selector: "clr-modal",
					inputs: [
						"clrModalOpen",
						"clrModalClosable",
						"clrModalCloseButtonAriaLabel",
						"clrModalSize",
						"clrModalStaticBackdrop",
						"clrModalSkipAnimation",
						"clrModalPreventClose",
						"clrModalLabelledById",
						"clrModalOverrideScrollService",
						"clrModalInOverlay"
					],
					outputs: ["clrModalOpenChange", "clrModalAlternateClose"]
				},
				{
					kind: "component",
					type: ClrWizardStepnav,
					selector: "clr-wizard-stepnav",
					inputs: ["label"]
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
	type: ClrWizard,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-wizard",
			providers: [
				WizardNavigationService,
				PageCollectionService,
				ButtonHubService,
				HeaderActionService
			],
			host: {
				"[class.clr-wizard]": "true",
				"[class.wizard-md]": "size == 'md'",
				"[class.wizard-lg]": "size == 'lg'",
				"[class.wizard-xl]": "size == 'xl'",
				"[class.wizard-in-page]": "inPage",
				"[class.wizard-in-page--fill-content-area]": "inPage && inPageFillContentArea",
				"[class.wizard-horizontal]": "stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-template #coreWizardContent>\n  <div class=\"clr-wizard-content-wrapper\">\n    @if (stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {\n    <div class=\"clr-wizard-title-wrapper\">\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n    </div>\n    }\n\n    <div class=\"clr-wizard-stepnav-wrapper\" role=\"region\">\n      @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      }\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"clr-wizard-main-content\">\n      @if (showHeader) {\n      <div class=\"clr-wizard-header\">\n        @if (navService.currentPage?.pageTitle) {\n        <div class=\"clr-wizard-page-title-wrapper\" cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"clr-wizard-page-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"clr-wizard-page-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        } @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n        <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n        }\n      </div>\n      }\n\n      <div #body class=\"clr-wizard-body-wrapper\">\n        <div class=\"clr-wizard-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n\n      @if (showFooter) {\n      <div class=\"clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            class=\"clr-wizard-footer-buttons-wrapper\"\n            [ngClass]=\"{'align-start': footerAlign === ClrWizardFooterAlign.START, 'align-end': footerAlign === ClrWizardFooterAlign.END}\"\n          >\n            @if (navService.currentPage?.hasButtons) {\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n            } @else {\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n            }\n          </div>\n        </div>\n      </div>\n      }\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #wizardTitleTemplate>\n  <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n    <ng-content select=\"clr-wizard-title\"></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #wizardActionsTemplate>\n  @if (headerActionService.displayHeaderActionsWrapper) {\n  <div class=\"clr-wizard-header-actions-wrapper\">\n    @if (headerActionService.showWizardHeaderActions) {\n    <ng-content select=\"clr-wizard-header-action\"></ng-content>\n    } @if (headerActionService.currentPageHasHeaderActions) {\n    <ng-template [ngTemplateOutlet]=\"(navService.currentPage?.headerActions ?? null)\"></ng-template>\n    }\n  </div>\n  } @if (closable && !inPage) {\n  <button type=\"button\" class=\"close\" [attr.aria-label]=\"commonStrings.keys.close\" (click)=\"modalCancel()\">\n    <cds-icon shape=\"window-close\"></cds-icon>\n  </button>\n  }\n</ng-template>\n\n@if (inPage) {\n<ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n} @else {\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <ng-template #clrInternalModalContentTemplate>\n    <ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n  </ng-template>\n</clr-modal>\n}\n"
		}]
	}],
	ctorParameters: () => [
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{ type: i3.ClrCommonStringsService },
		{ type: WizardNavigationService },
		{ type: PageCollectionService },
		{ type: ButtonHubService },
		{ type: HeaderActionService },
		{ type: i0.ElementRef },
		{ type: i0.IterableDiffers }
	],
	propDecorators: {
		stepnavAriaLabel: [{
			type: Input,
			args: ["clrWizardStepnavAriaLabel"]
		}],
		stepnavLayout: [{
			type: Input,
			args: [{
				alias: "clrWizardStepnavLayout",
				transform: stepnavLayoutAttribute
			}]
		}],
		size: [{
			type: Input,
			args: ["clrWizardSize"]
		}],
		inPage: [{
			type: Input,
			args: ["clrWizardInPage"]
		}],
		inPageFillContentArea: [{
			type: Input,
			args: ["clrWizardInPageFillContentArea"]
		}],
		hideFooter: [{
			type: Input,
			args: ["clrWizardHideFooter"]
		}],
		_footerAlign: [{
			type: Input,
			args: [{
				alias: "clrWizardFooterAlign",
				transform: footerAlignAttribute
			}]
		}],
		closable: [{
			type: Input,
			args: ["clrWizardClosable"]
		}],
		_stopModalAnimations: [{
			type: Input,
			args: ["clrWizardPreventModalAnimation"]
		}],
		_openChanged: [{
			type: Output,
			args: ["clrWizardOpenChange"]
		}],
		onCancel: [{
			type: Output,
			args: ["clrWizardOnCancel"]
		}],
		wizardFinished: [{
			type: Output,
			args: ["clrWizardOnFinish"]
		}],
		onReset: [{
			type: Output,
			args: ["clrWizardOnReset"]
		}],
		currentPageChange: [{
			type: Output,
			args: ["clrWizardCurrentPageChange"]
		}],
		onMoveNext: [{
			type: Output,
			args: ["clrWizardOnNext"]
		}],
		onMovePrevious: [{
			type: Output,
			args: ["clrWizardOnPrevious"]
		}],
		pageTitle: [{
			type: ViewChild,
			args: ["pageTitle"]
		}],
		pages: [{
			type: ContentChildren,
			args: [ClrWizardPage]
		}],
		wizardButtons: [{
			type: ContentChildren,
			args: [ClrWizardButton, { descendants: false }]
		}],
		headerActions: [{
			type: ContentChildren,
			args: [ClrWizardHeaderAction]
		}],
		wizardTitle: [{
			type: ContentChild,
			args: [ClrWizardTitle]
		}],
		bodyElementRef: [{
			type: ViewChild,
			args: ["body"]
		}],
		forceForward: [{
			type: Input,
			args: ["clrWizardForceForwardNavigation"]
		}],
		clrWizardOpen: [{
			type: Input,
			args: ["clrWizardOpen"]
		}],
		stopNext: [{
			type: Input,
			args: ["clrWizardPreventDefaultNext"]
		}],
		stopCancel: [{
			type: Input,
			args: ["clrWizardPreventDefaultCancel"]
		}],
		stopNavigation: [{
			type: Input,
			args: ["clrWizardPreventNavigation"]
		}],
		disableStepnav: [{
			type: Input,
			args: ["clrWizardDisableStepnav"]
		}]
	}
});
const CLR_WIZARD_DIRECTIVES = [
	ClrWizard,
	ClrWizardPage,
	ClrWizardStepnav,
	ClrWizardStepnavItem,
	ClrWizardButton,
	ClrWizardHeaderAction,
	ClrWizardTitle,
	ClrWizardPageTitle,
	ClrWizardPageNavTitle,
	ClrWizardPageButtons,
	ClrWizardPageHeaderActions
];
var ClrWizardModule = class ClrWizardModule {
	constructor() {
		ClarityIcons.addIcons(errorStandardIcon, successStandardIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardModule,
			declarations: [
				ClrWizard,
				ClrWizardPage,
				ClrWizardStepnav,
				ClrWizardStepnavItem,
				ClrWizardButton,
				ClrWizardHeaderAction,
				ClrWizardTitle,
				ClrWizardPageTitle,
				ClrWizardPageNavTitle,
				ClrWizardPageButtons,
				ClrWizardPageHeaderActions
			],
			imports: [
				CommonModule,
				ClrIcon,
				ClrModalModule,
				ClrAlertModule
			],
			exports: [
				ClrWizard,
				ClrWizardPage,
				ClrWizardStepnav,
				ClrWizardStepnavItem,
				ClrWizardButton,
				ClrWizardHeaderAction,
				ClrWizardTitle,
				ClrWizardPageTitle,
				ClrWizardPageNavTitle,
				ClrWizardPageButtons,
				ClrWizardPageHeaderActions
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrWizardModule,
			imports: [
				CommonModule,
				ClrIcon,
				ClrModalModule,
				ClrAlertModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrWizardModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				ClrIcon,
				ClrModalModule,
				ClrAlertModule
			],
			declarations: [CLR_WIZARD_DIRECTIVES],
			exports: [CLR_WIZARD_DIRECTIVES]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_WIZARD_DIRECTIVES, CUSTOM_BUTTON_TYPES, ClrWizard, ClrWizardButton, ClrWizardFooterAlign, ClrWizardHeaderAction, ClrWizardModule, ClrWizardPage, ClrWizardPageButtons, ClrWizardPageHeaderActions, ClrWizardPageNavTitle, ClrWizardPageTitle, ClrWizardStepnav, ClrWizardStepnavItem, ClrWizardStepnavLayout, ClrWizardTitle, DEFAULT_BUTTON_TYPES, footerAlignAttribute, stepnavLayoutAttribute };

//# sourceMappingURL=clr-angular-wizard.mjs.map