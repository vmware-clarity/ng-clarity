import * as i0 from '@angular/core';
import { OnInit, AfterViewInit, EventEmitter, ElementRef } from '@angular/core';
import { ClrTimelineStepState } from '@clr/angular';

interface WcagLevel {
    label: string;
    score: string;
    type: string;
}
interface ContrastResult {
    minContrast: {
        wcag: WcagLevel;
        score: number;
    };
    backgrounds: {
        name: string;
        score: number;
        wcag: WcagLevel;
    }[];
}
/**
 * Per-theme lookup keyed by token group / background name. Defaults to grouped
 * color variants (`Color[]`, used by `colorStruct`); pass `Color` for single-value
 * structures like `backgrounds`.
 */
type CdsThemeStructure<T = Color[]> = {
    light: Record<string, T>;
    dark: Record<string, T>;
};
/** HSL color: hue wraps to 0–360, saturation/lightness clamp to 0–100. */
declare class HslColor {
    readonly h: number;
    readonly s: number;
    readonly l: number;
    constructor(h: number, s: number, l: number);
}
/** RGB color: red/green/blue clamp to 0–255 and round to whole channel values. */
declare class RgbColor {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    constructor(r: number, g: number, b: number);
}
/** OKLCH color: lightness clamps to 0–1, chroma clamps to ≥0, hue wraps to 0–360. */
declare class OklchColor {
    readonly l: number;
    readonly c: number;
    readonly h: number;
    constructor(l: number, c: number, h: number);
}
interface ThemeColors {
    primary?: Color;
    info?: Color;
    success?: Color;
    warning?: Color;
    danger?: Color;
}
interface ThemePreset {
    name: string;
    light: ThemeColors;
    dark: ThemeColors;
}
interface ThemeColor {
    key: string;
    base: Color;
    variants: Color[];
    contrast: ContrastResult;
}
interface DataRow {
    name: string;
    role: string;
    status: string;
}

/**
 * A single theme token: its CSS custom property name, the original Clarity-provided
 * HSL value, and the current (possibly user-edited) color. Colors are stored in HSL;
 * RGB and HEX are derived on demand.
 */
declare class Color {
    name: string;
    originalColor: string;
    private _color?;
    /**
     * @param name CSS custom property name, e.g. `--cds-alias-status-info`
     * @param originalColor Clarity-provided HSL, e.g. `hsl(198deg 100% 59%)`
     */
    constructor(name: string, originalColor: string);
    /** HSL components. Falls back to parsing `originalColor` when not explicitly set. */
    get color(): HslColor;
    set color(value: HslColor);
    /** RGB components — HSL is converted to RGB only for relative luminance checks. */
    get rgb(): RgbColor;
    /** HEX string — used by native color inputs. */
    get hex(): string;
    /** HSL string — used by native color inputs. */
    get hsl(): string;
    /**
     * OKLCH components — unlike HSL's `L`, OKLCH's `L` tracks perceived lightness
     * uniformly across all hues, which is why it's used for palette/contrast math.
     */
    get oklch(): OklchColor;
    /** OKLCH string, CSS Color 4 syntax. */
    get oklchString(): string;
    /** Human-readable variant label derived from the token name suffix, e.g. `Tint dark`. */
    get label(): string;
    get isOriginalColor(): boolean;
    static isHex(hex: string): boolean;
    static shiftL({ h, s, l }: HslColor, delta: number): HslColor;
    static hexToHsl(hex: string): HslColor;
    /**
     * Converts HSL to OKLCH via linear sRGB and OKLab (CSS Color 4 / Björn Ottosson
     * formulas). Goes through OKLCH — not raw HSL — whenever perceptual uniformity
     * matters, since HSL's `L` looks lighter or darker depending on hue.
     */
    hslToOklch(hsl: HslColor): OklchColor;
    reset(): void;
    private hslToHex;
    /** Converts HSL to RGB — use only for relative luminance calculations. */
    private hslToRgb;
    /** Converts linear sRGB (0–1 channels) to OKLab. */
    private linearSrgbToOklab;
    /** Parses a CSS HSL string such as `hsl(198deg 100% 59%)`. */
    private parseHsl;
}

declare class ThemeBuilderComponent implements OnInit, AfterViewInit {
    /** Emits the generated CSS override text whenever a color, preset, reset, or override toggle changes. */
    generatedCSS: EventEmitter<string>;
    previewWrapper: ElementRef<HTMLElement>;
    previewDarkWrapper: ElementRef<HTMLElement>;
    activePreset: ThemePreset | null;
    activeTheme: 'light' | 'dark';
    warningTextOverrideEnabled: boolean;
    colorStruct: CdsThemeStructure;
    backgrounds: CdsThemeStructure<Color>;
    themeColors: ThemeColor[];
    breadcrumbs: {
        label: string;
        href: string;
    }[];
    wizardOpen: boolean;
    rows: DataRow[];
    description: string;
    stepperForm: {
        account: {
            fullName: string;
        };
        confirm: {
            agree: boolean;
        };
    };
    readonly timelineStates: typeof ClrTimelineStepState;
    private _presets;
    constructor();
    /**
     * Presets available in the preset selector. Defaults to Clarity's built-in preset list.
     * The Clarity Default preset is always prepended, so it's guaranteed to remain available
     * as a fallback even when a custom list is provided.
     */
    get presets(): ThemePreset[];
    set presets(value: ThemePreset[]);
    get isDarkTheme(): boolean;
    get generatedCss(): string;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    toggleActiveTheme(): void;
    setCurrentColor(colorVariant: Color, hex: string, colorGroup?: Color[]): void;
    applyPreset(preset: ThemePreset): void;
    resetAllThemeColors(theme: string): void;
    resetColor($event: Event, color: Color, colorGroup?: Color[]): void;
    onWarningTextOverrideChange(): void;
    applyPreviewStyles(): void;
    private getContrast;
    private refreshThemeColors;
    private resetActivePreset;
    private colorBuilder;
    private buildColorStructure;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeBuilderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeBuilderComponent, "clr-theme-builder", never, { "presets": { "alias": "presets"; "required": false; }; }, { "generatedCSS": "generatedCSS"; }, never, ["*"], true, never>;
}

declare const PRESETS: ThemePreset[];

export { Color, PRESETS, ThemeBuilderComponent };
export type { ThemeColor, ThemeColors, ThemePreset };
