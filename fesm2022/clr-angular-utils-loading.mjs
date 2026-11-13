import * as i0 from "@angular/core";
import { Directive, Input, NgModule, Optional } from "@angular/core";
import { CommonModule } from "@angular/common";
var LoadingListener = class {};
var ClrLoadingState;
(function(ClrLoadingState) {
	ClrLoadingState[ClrLoadingState["DEFAULT"] = 0] = "DEFAULT";
	ClrLoadingState[ClrLoadingState["LOADING"] = 1] = "LOADING";
	ClrLoadingState[ClrLoadingState["SUCCESS"] = 2] = "SUCCESS";
	ClrLoadingState[ClrLoadingState["ERROR"] = 3] = "ERROR";
})(ClrLoadingState || (ClrLoadingState = {}));
var ClrLoading = class ClrLoading {
	constructor(listener) {
		this.listener = listener;
		this._loadingState = ClrLoadingState.DEFAULT;
	}
	get loadingState() {
		return this._loadingState;
	}
	set loadingState(value) {
		if (value === true) value = ClrLoadingState.LOADING;
		else if (!value) value = ClrLoadingState.DEFAULT;
		if (value === this._loadingState) return;
		this._loadingState = value;
		if (this.listener) this.listener.loadingStateChange(value);
	}
	ngOnDestroy() {
		this.loadingState = ClrLoadingState.DEFAULT;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLoading,
			deps: [{
				token: LoadingListener,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrLoading,
			isStandalone: false,
			selector: "[clrLoading]",
			inputs: { loadingState: ["clrLoading", "loadingState"] },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrLoading,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrLoading]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: LoadingListener,
		decorators: [{ type: Optional }]
	}],
	propDecorators: { loadingState: [{
		type: Input,
		args: ["clrLoading"]
	}] }
});
const CLR_LOADING_DIRECTIVES = [ClrLoading];
var ClrLoadingModule = class ClrLoadingModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLoadingModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLoadingModule,
			declarations: [ClrLoading],
			imports: [CommonModule],
			exports: [ClrLoading]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrLoadingModule,
			imports: [CommonModule]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrLoadingModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [CommonModule],
			declarations: [CLR_LOADING_DIRECTIVES],
			exports: [CLR_LOADING_DIRECTIVES]
		}]
	}]
});
export { CLR_LOADING_DIRECTIVES, ClrLoading, ClrLoadingModule, ClrLoadingState, LoadingListener };

//# sourceMappingURL=clr-angular-utils-loading.mjs.map