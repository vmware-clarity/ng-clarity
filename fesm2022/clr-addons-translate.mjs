import * as i0 from "@angular/core";
import { Inject, Injectable, InjectionToken, NgModule, Pipe } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonModule } from "@angular/common";
const appfxTranslationsToken = new InjectionToken("appfx-translations", {
	providedIn: "root",
	factory: () => Object.fromEntries(Object.values(AppfxLocale).map((lang) => [lang, {}]))
});
const appfxMissingTranslationToken = new InjectionToken("appfx-missing-translation", {
	providedIn: "root",
	factory: () => defaultMissingTranslationHandler
});
function defaultMissingTranslationHandler(translations, locale, key) {
	return translations?.[AppfxLocale.En]?.[key] ?? key;
}
var AppfxLocale;
(function(AppfxLocale) {
	AppfxLocale["En"] = "en";
	AppfxLocale["Es"] = "es";
	AppfxLocale["Fr"] = "fr";
	AppfxLocale["Ja"] = "ja";
})(AppfxLocale || (AppfxLocale = {}));
const placeholderRegex = /{{\s*?([^{}\s]*?)\s*?}}/g;
var AppfxTranslateService = class AppfxTranslateService {
	static {
		this.localeSubject = new BehaviorSubject(AppfxLocale.En);
	}
	constructor(translations, emptyTranslationKeyCallback) {
		this.translations = translations;
		this.emptyTranslationKeyCallback = emptyTranslationKeyCallback;
		this.localeChanged$ = AppfxTranslateService.localeSubject.asObservable();
	}
	get locale() {
		return AppfxTranslateService.localeSubject.value;
	}
	set locale(locale) {
		AppfxTranslateService.localeSubject.next(locale);
	}
	translate(key, args) {
		const interpolationString = this.translations?.[this.locale]?.[key] ?? this.emptyTranslationKeyCallback(this.translations, this.locale, key, args);
		if (!interpolationString || typeof args !== "object" || !Object.keys(args).length) return interpolationString;
		return interpolationString.replace(placeholderRegex, (match, interpolationKey) => {
			return String(args?.[interpolationKey] ?? "");
		});
	}
	localeAsBcp47() {
		return this.locale.replace("_", "-");
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTranslateService,
			deps: [{ token: appfxTranslationsToken }, { token: appfxMissingTranslationToken }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTranslateService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxTranslateService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [appfxTranslationsToken]
		}]
	}, {
		type: void 0,
		decorators: [{
			type: Inject,
			args: [appfxMissingTranslationToken]
		}]
	}]
});
var DateTimeKind;
(function(DateTimeKind) {
	DateTimeKind[DateTimeKind["Date"] = 0] = "Date";
	DateTimeKind[DateTimeKind["Time"] = 1] = "Time";
	DateTimeKind[DateTimeKind["DateTime"] = 2] = "DateTime";
	DateTimeKind[DateTimeKind["LongDateTime"] = 3] = "LongDateTime";
})(DateTimeKind || (DateTimeKind = {}));
var HourFormat;
(function(HourFormat) {
	HourFormat["Hour12"] = "h12";
	HourFormat["Hour24"] = "h24";
})(HourFormat || (HourFormat = {}));
const dateOptions = {
	year: "numeric",
	month: "2-digit",
	day: "2-digit"
};
const timeOptions = {
	hour: "numeric",
	minute: "numeric",
	second: "numeric"
};
var DateTimeService = class DateTimeService {
	constructor(appfxTranslateService) {
		this.appfxTranslateService = appfxTranslateService;
		this.optionsMap = {
			[DateTimeKind.Date]: dateOptions,
			[DateTimeKind.Time]: timeOptions,
			[DateTimeKind.DateTime]: {
				...dateOptions,
				...timeOptions
			},
			[DateTimeKind.LongDateTime]: {
				year: "numeric",
				month: "long",
				day: "2-digit",
				weekday: "long",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				timeZoneName: "longOffset"
			}
		};
		this.defaultFormatOptions = {
			dateTimeKind: DateTimeKind.LongDateTime,
			hourFormat: HourFormat.Hour24
		};
	}
	format(date, options) {
		return date?.toLocaleString(this.appfxTranslateService.localeAsBcp47(), this.transformOptions(options)) ?? "";
	}
	transformOptions(options) {
		const opts = {
			...this.defaultFormatOptions,
			...options
		};
		return {
			...this.optionsMap[opts.dateTimeKind],
			hourCycle: opts.hourFormat || HourFormat.Hour24
		};
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateTimeService,
			deps: [{ token: AppfxTranslateService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateTimeService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateTimeService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: AppfxTranslateService }]
});
var DateTimePipe = class DateTimePipe {
	constructor(dateTimeService) {
		this.dateTimeService = dateTimeService;
	}
	transform(value, options) {
		return this.dateTimeService.format(value, options);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateTimePipe,
			deps: [{ token: DateTimeService }],
			target: i0.ɵɵFactoryTarget.Pipe
		});
	}
	static {
		this.ɵpipe = i0.ɵɵngDeclarePipe({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateTimePipe,
			isStandalone: false,
			name: "dateTime",
			pure: false
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateTimePipe,
	decorators: [{
		type: Pipe,
		args: [{
			name: "dateTime",
			pure: false,
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: DateTimeService }]
});
var TranslatePipe = class TranslatePipe {
	constructor(appfxTranslateService) {
		this.appfxTranslateService = appfxTranslateService;
	}
	transform(key, args) {
		return this.appfxTranslateService.translate(key, args);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TranslatePipe,
			deps: [{ token: AppfxTranslateService }],
			target: i0.ɵɵFactoryTarget.Pipe
		});
	}
	static {
		this.ɵpipe = i0.ɵɵngDeclarePipe({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TranslatePipe,
			isStandalone: false,
			name: "translate",
			pure: false
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TranslatePipe,
	decorators: [{
		type: Pipe,
		args: [{
			name: "translate",
			pure: false,
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: AppfxTranslateService }]
});
var AppfxTranslateModule = class AppfxTranslateModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTranslateModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTranslateModule,
			declarations: [DateTimePipe, TranslatePipe],
			imports: [CommonModule],
			exports: [DateTimePipe, TranslatePipe]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxTranslateModule,
			providers: [AppfxTranslateService, DateTimeService],
			imports: [CommonModule]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxTranslateModule,
	decorators: [{
		type: NgModule,
		args: [{
			declarations: [DateTimePipe, TranslatePipe],
			imports: [CommonModule],
			exports: [DateTimePipe, TranslatePipe],
			providers: [AppfxTranslateService, DateTimeService]
		}]
	}]
});
export { AppfxLocale, AppfxLocale as Locale, AppfxTranslateModule, AppfxTranslateModule as TranslateModule, AppfxTranslateService, AppfxTranslateService as TranslateService, DateTimeKind, DateTimePipe, DateTimeService, HourFormat, TranslatePipe, appfxMissingTranslationToken, appfxTranslationsToken, defaultMissingTranslationHandler };

//# sourceMappingURL=clr-addons-translate.mjs.map