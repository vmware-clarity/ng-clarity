import * as i0 from '@angular/core';
import { OnInit, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import * as i4 from '@clr/addons/tabs';
import { Tabs } from '@clr/addons/tabs';
import * as i5 from '@clr/addons/var';
import { TabLayout, WorkflowConfigurationService, Step, WorkflowModel, CloseHandler, ModelChange, StepValidationState } from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { Observable } from 'rxjs';
import * as i6 from '@clr/angular/forms/checkbox';
import * as i7 from '@clr/angular/modal';
import * as i8 from '@angular/common';
import * as i9 from '@angular/forms';

/**
 * The modal options with which the multi page dialog should be opened.
 */
interface DialogOptions {
    /**
     * Specify the dialog height in pixels. The clarity modal sizes set only the
     * width of the modal dialog, so the height needs to be explicitly set, else
     * the dialog height will vary.
     * The height should be specified with px - for example: height: '800px'.
     * The multi page dialog has a default min height 545px.
     */
    height?: string;
    /**
     * Specify the layout of the tab pages - horizontal or vertical tabs.
     * If it is not specified, the default layout is horizontal.
     * It is recommended to use the horizontal tabs if the number of tabs is less than 3,
     * and vertical tabs if they are more.
     */
    tabLayout?: TabLayout;
    /**
     * Title of the modal dialog.
     */
    title?: string;
    /**
     *  Text string to display as subtitle.
     */
    subTitle?: string | Observable<string>;
    /**
     * Specifies which button ('cancel' or 'save') is highlighted, 'cancel' by default.
     */
    defaultButton?: DefaultButton;
    /**
     * Modal size. Values are 'sm', <none>, 'lg'
     */
    size?: ModalSize;
    /**
     * Title of the submit button.
     */
    okButtonLabel?: string;
}
/**
 * Dialog's Modal Size
 */
type ModalSize = 'full-screen' | 'xl' | 'lg' | 'md' | 'sm' | undefined;
/**
 * Dialog's default button options - submit and close (default)
 */
type DefaultButton = 'submit' | 'close';

/**
 * A multi page dialog implemented as a single modal dialog with clarity tabs where
 * each step(page) is in a separate tab.
 * A custom component can be added in the dialog header (appfx-dialog-header) if it is
 * needed. See the example below:
 *
 * @example
 * <appfx-dialog
 *             [loading]="loading"
 *             [steps]="steps"
 *             [model]="dialogModel"
 *             [title]="options.title"
 *             [subTitle]="subTitle"
 *             [defaultButton]="submit"
 *             [okButtonLabel]="okButtonLabel"
 *             [disableTabsContent]="!toggleStateEnabled"
 *             [closeHandler]="closeHandler">
 *       <appfx-dialog-header>
 *          <appfx-toggle
 *                [label]="label"
 *                [toggleId]="'myToggleControlId'"
 *                [(toggleState)]="toggleStateEnabled">
 *          </appfx-toggle>
 *       </appfx-dialog-header>
 * </appfx-dialog>
 */
declare class DialogComponent implements OnInit, OnDestroy {
    #private;
    private cdr;
    readonly workflowStrings: WorkflowStrings;
    readonly configService: WorkflowConfigurationService;
    private zoomLevelService?;
    /** The title of the dialog. */
    title: string;
    /** Dialog's clarity size ("xl" | "lg" | "md" | "sm" | "full-screen"). */
    size: ModalSize;
    /** Specifies the height of the dialog. */
    height: string;
    /** Set default button - submit or close. The default value is close if it is not specified. */
    defaultButton: DefaultButton;
    /** The cancel button label. */
    cancelButtonLabel: string;
    /** The ok button label. */
    okButtonLabel: string;
    /** The tabs layout. The default value is horizontal if it is not specified. */
    tabLayout: TabLayout;
    /** Disable the content of the tabs. */
    disableTabsContent: boolean;
    /** Display loading indicator. */
    loading: boolean;
    steps: Step[];
    /**
     * You can supply here any structure you like. As long as it has the
     * needed properties to inject to the step models and eject back from
     * the step models.
     *
     * If not specified, the steps will simply stay disconnected from each other,
     * so you would need other means of communication between them.
     */
    model: WorkflowModel;
    /**
     * Object containing callback methods that will be invoked when the Dialog is Submitted or Cancelled.
     * onSubmit is invoked when the user clicks Ok button.
     * onCancel is invoked when the user clicks Cancel button.
     * You can perform the actions you want there (i.e modify something).
     * Dialog will wait for the result and then will close.
     * If there is an error, it will be displayed in the dialog that will remain open.
     */
    closeHandler: CloseHandler;
    /**
     * Show Tab Links (true by default)
     * Set this to false if you want to hide the tab links.
     * You can set this to false if you have only one step.
     */
    showTabLinks: boolean;
    /** Dispatches when any of the workflow state's variables changes. */
    readonly onModelChange: EventEmitter<ModelChange[]>;
    /**
     * Dispatched when the dialog is closed (in all three cases: via the close button
     * (on the top right corner) or the OK/Cancel buttons).
     */
    onClose: EventEmitter<void>;
    /** Emits when opened input is changed. */
    openedChange: EventEmitter<boolean>;
    tabs: Tabs;
    errorIconVisibleList: boolean[];
    closeHandlerValidationState: StepValidationState;
    currentZoomLevel: ZoomLevel;
    ZoomLevel: typeof ZoomLevel;
    tabLinksOpened: boolean;
    private debugPopup;
    private subscriptions;
    private readonly defaultMinHeight;
    constructor(cdr: ChangeDetectorRef, workflowStrings: WorkflowStrings, configService: WorkflowConfigurationService, 
    /**
     * openModalComponent = undefined - Dialog used without ModalService
     * openModalComponent = true  - opened using ModalService.openModalComponent API
     * openModalComponent = false - opened using ModalService.openModal API
     */
    openModalComponent?: boolean, zoomLevelService?: ZoomLevelService);
    /**
     * The sub title of the dialog.
     */
    set subTitle(subTitle: string | Observable<string>);
    /** Controls dialog open/close state. */
    get opened(): boolean;
    set opened(value: boolean);
    get subTitle$(): Observable<string>;
    get isVerticalLayout(): boolean;
    get showAppfxTabLinks(): boolean;
    get showTabLinksInAppfxTabs(): boolean;
    get heightStyle(): any;
    get isLoading(): boolean;
    get isOkButtonDisabled(): boolean;
    get isSignPostOpen(): boolean;
    ngOnInit(): void;
    ngOnDestroy(): void;
    onOkButtonClick(): void;
    onCancelButtonClick(): void;
    onModalOpenChange(opened: boolean): void;
    private submitDialog;
    private subscribeForCloseHandler;
    private closeModal;
    static ɵfac: i0.ɵɵFactoryDeclaration<DialogComponent, [null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DialogComponent, "appfx-dialog", never, { "title": { "alias": "title"; "required": false; }; "size": { "alias": "size"; "required": false; }; "height": { "alias": "height"; "required": false; }; "defaultButton": { "alias": "defaultButton"; "required": false; }; "cancelButtonLabel": { "alias": "cancelButtonLabel"; "required": false; }; "okButtonLabel": { "alias": "okButtonLabel"; "required": false; }; "tabLayout": { "alias": "tabLayout"; "required": false; }; "disableTabsContent": { "alias": "disableTabsContent"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "steps": { "alias": "steps"; "required": false; }; "model": { "alias": "model"; "required": false; }; "closeHandler": { "alias": "closeHandler"; "required": false; }; "showTabLinks": { "alias": "showTabLinks"; "required": false; }; "subTitle": { "alias": "subTitle"; "required": false; }; "opened": { "alias": "opened"; "required": false; }; }, { "onModelChange": "onModelChange"; "onClose": "onClose"; "openedChange": "openedChange"; }, never, ["appfx-dialog-header"], false, never>;
}
declare const notDisplayedError: Object;

declare class DialogHeaderComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<DialogHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DialogHeaderComponent, "appfx-dialog-header", never, {}, {}, never, ["*"], false, never>;
}

/**
 * A toggle with a label control that can be used in the
 * multi page dialog's header section.
 */
declare class ToggleComponent {
    private static instanceCount;
    /** Dispatched when the toggle enabled state is changed. */
    toggleStateChange: EventEmitter<boolean>;
    /** The enabled toggle state - true or false. */
    toggleState: boolean;
    /**
     * The toggle control ID. If it is not specified,
     * an autogenerated ID will be set.
     */
    toggleId: string;
    /** The label/description of the toggle. */
    label: string;
    disabled: boolean;
    constructor();
    /**
     * Triggered when the toggle state has changed.
     * @param state The current state
     */
    onToggleStateChanged(state: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToggleComponent, "appfx-toggle", never, { "toggleState": { "alias": "toggleState"; "required": false; }; "toggleId": { "alias": "toggleId"; "required": false; }; "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "toggleStateChange": "toggleStateChange"; }, never, never, false, never>;
}

declare class AppfxMultiPageDialogModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxMultiPageDialogModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxMultiPageDialogModule, [typeof DialogComponent, typeof DialogHeaderComponent, typeof ToggleComponent], [typeof i4.AppfxTabsModule, typeof i5.AppfxWorkflowCoreModule, typeof i6.ClrCheckboxModule, typeof i7.ClrModalModule, typeof i8.CommonModule, typeof i9.FormsModule, typeof i9.ReactiveFormsModule], [typeof DialogComponent, typeof DialogHeaderComponent, typeof ToggleComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxMultiPageDialogModule>;
}

export { AppfxMultiPageDialogModule, DialogComponent as Dialog, DialogComponent, DialogHeaderComponent as DialogHeader, DialogHeaderComponent, ToggleComponent as Toggle, ToggleComponent, notDisplayedError };
export type { DefaultButton, DialogOptions, ModalSize };
