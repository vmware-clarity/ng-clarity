import * as i0 from "@angular/core";
import { Directive, EventEmitter, Inject, Injectable, InjectionToken, Input, NgModule, Optional, Output, signal } from "@angular/core";
import { Subject } from "rxjs";
import { ClrLoadingState } from "@clr/angular/utils/loading";
import { CommonModule } from "@angular/common";
let activeCounter = 0;
const IF_ACTIVE_ID = new InjectionToken("IF_ACTIVE_ID");
function tokenFactory() {
	return ++activeCounter;
}
const IF_ACTIVE_ID_PROVIDER = {
	provide: IF_ACTIVE_ID,
	useFactory: tokenFactory
};
var IfActiveService = class IfActiveService {
	constructor() {
		this._currentChange = new Subject();
		this._current = signal(void 0, ...ngDevMode ? [{ debugName: "_current" }] : /* istanbul ignore next */ []);
	}
	get currentChange() {
		return this._currentChange.asObservable();
	}
	get current() {
		return this._current();
	}
	set current(value) {
		if (this._current() !== value) {
			this._current.set(value);
			this._currentChange.next(value);
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IfActiveService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IfActiveService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: IfActiveService,
	decorators: [{ type: Injectable }]
});
var ClrIfActive = class ClrIfActive {
	constructor(ifActiveService, id, template, container) {
		this.ifActiveService = ifActiveService;
		this.id = id;
		this.template = template;
		this.container = container;
		this.activeChange = new EventEmitter(false);
		this.wasActive = false;
		this.checkAndUpdateView(ifActiveService.current);
		this.subscription = ifActiveService.currentChange.subscribe((newCurrentId) => {
			this.checkAndUpdateView(newCurrentId);
		});
	}
	get active() {
		return this.ifActiveService.current === this.id;
	}
	set active(value) {
		if (value) this.ifActiveService.current = this.id;
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	updateView(value) {
		if (value) this.container.createEmbeddedView(this.template);
		else this.container.clear();
	}
	checkAndUpdateView(currentId) {
		const isNowActive = currentId === this.id;
		if (isNowActive !== this.wasActive) {
			this.updateView(isNowActive);
			this.activeChange.emit(isNowActive);
			this.wasActive = isNowActive;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrIfActive,
			deps: [
				{ token: IfActiveService },
				{ token: IF_ACTIVE_ID },
				{ token: i0.TemplateRef },
				{ token: i0.ViewContainerRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrIfActive,
			isStandalone: true,
			selector: "[clrIfActive]",
			inputs: { active: ["clrIfActive", "active"] },
			outputs: { activeChange: "clrIfActiveChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrIfActive,
	decorators: [{
		type: Directive,
		args: [{ selector: "[clrIfActive]" }]
	}],
	ctorParameters: () => [
		{ type: IfActiveService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [IF_ACTIVE_ID]
			}]
		},
		{ type: i0.TemplateRef },
		{ type: i0.ViewContainerRef }
	],
	propDecorators: {
		activeChange: [{
			type: Output,
			args: ["clrIfActiveChange"]
		}],
		active: [{
			type: Input,
			args: ["clrIfActive"]
		}]
	}
});
var IfExpandService = class IfExpandService {
	constructor() {
		this._expandChange = new Subject();
		this._expandableSignal = signal(0, ...ngDevMode ? [{ debugName: "_expandableSignal" }] : /* istanbul ignore next */ []);
		this._hasExpandTemplateSignal = signal(false, ...ngDevMode ? [{ debugName: "_hasExpandTemplateSignal" }] : /* istanbul ignore next */ []);
		this._loadingSignal = signal(false, ...ngDevMode ? [{ debugName: "_loadingSignal" }] : /* istanbul ignore next */ []);
		this._expandedSignal = signal(false, ...ngDevMode ? [{ debugName: "_expandedSignal" }] : /* istanbul ignore next */ []);
	}
	get expandable() {
		return this._expandableSignal();
	}
	set expandable(value) {
		this._expandableSignal.set(value);
	}
	get hasExpandTemplate() {
		return this._hasExpandTemplateSignal();
	}
	set hasExpandTemplate(value) {
		this._hasExpandTemplateSignal.set(value);
	}
	get loading() {
		return this._loading;
	}
	set loading(value) {
		value = !!value;
		if (value !== this._loading) this._loading = value;
	}
	get expanded() {
		return this._expanded;
	}
	set expanded(value) {
		value = !!value;
		if (value !== this._expanded) {
			this._expanded = value;
			this._expandChange.next(value);
		}
	}
	get expandChange() {
		return this._expandChange.asObservable();
	}
	get _loading() {
		return this._loadingSignal();
	}
	set _loading(value) {
		this._loadingSignal.set(value);
	}
	get _expanded() {
		return this._expandedSignal();
	}
	set _expanded(value) {
		this._expandedSignal.set(value);
	}
	toggle() {
		this.expanded = !this._expanded;
	}
	loadingStateChange(state) {
		switch (state) {
			case ClrLoadingState.LOADING:
				this.loading = true;
				break;
			default: this.loading = false;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IfExpandService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: IfExpandService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: IfExpandService,
	decorators: [{ type: Injectable }]
});
var ClrIfExpanded = class ClrIfExpanded {
	constructor(template, container, el, renderer, expand) {
		this.template = template;
		this.container = container;
		this.el = el;
		this.renderer = renderer;
		this.expand = expand;
		this.expandedChange = new EventEmitter(true);
		this._expanded = false;
		this._subscriptions = [];
		this._subscriptions.push(expand.expandChange.subscribe(() => {
			this.updateView();
			this.expandedChange.emit(expand.expanded);
		}));
		expand.hasExpandTemplate = !!template;
	}
	get expanded() {
		return this._expanded;
	}
	set expanded(value) {
		if (typeof value === "boolean") {
			this.expand.expanded = value;
			this._expanded = value;
		}
	}
	ngOnInit() {
		this.expand.expandable++;
		this.updateView();
	}
	ngOnDestroy() {
		this.expand.expandable--;
		this._subscriptions.forEach((sub) => sub.unsubscribe());
	}
	updateView() {
		if (this.expand.expanded && this.container.length !== 0) return;
		if (this.template) {
			if (this.expand.expanded) this.container.createEmbeddedView(this.template);
			else this.container.clear();
		} else try {
			if (this.expand.expanded) this.renderer.setStyle(this.el.nativeElement, "display", null);
			else this.renderer.setStyle(this.el.nativeElement, "display", "none");
		} catch (e) {}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrIfExpanded,
			deps: [
				{
					token: i0.TemplateRef,
					optional: true
				},
				{ token: i0.ViewContainerRef },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: IfExpandService }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrIfExpanded,
			isStandalone: true,
			selector: "[clrIfExpanded]",
			inputs: { expanded: ["clrIfExpanded", "expanded"] },
			outputs: { expandedChange: "clrIfExpandedChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrIfExpanded,
	decorators: [{
		type: Directive,
		args: [{ selector: "[clrIfExpanded]" }]
	}],
	ctorParameters: () => [
		{
			type: i0.TemplateRef,
			decorators: [{ type: Optional }]
		},
		{ type: i0.ViewContainerRef },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: IfExpandService }
	],
	propDecorators: {
		expandedChange: [{
			type: Output,
			args: ["clrIfExpandedChange"]
		}],
		expanded: [{
			type: Input,
			args: ["clrIfExpanded"]
		}]
	}
});
const CONDITIONAL_DIRECTIVES = [ClrIfActive, ClrIfExpanded];
var ClrConditionalModule = class ClrConditionalModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrConditionalModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrConditionalModule,
			imports: [
				CommonModule,
				ClrIfActive,
				ClrIfExpanded
			],
			exports: [ClrIfActive, ClrIfExpanded]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrConditionalModule,
			imports: [CommonModule]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrConditionalModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [CommonModule, CONDITIONAL_DIRECTIVES],
			exports: [CONDITIONAL_DIRECTIVES]
		}]
	}]
});
export { CONDITIONAL_DIRECTIVES, ClrConditionalModule, ClrIfActive, ClrIfExpanded, IF_ACTIVE_ID, IF_ACTIVE_ID_PROVIDER, IfActiveService, IfExpandService, tokenFactory };

//# sourceMappingURL=clr-angular-utils-conditional.mjs.map