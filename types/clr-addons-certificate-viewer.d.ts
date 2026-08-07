import * as i0 from '@angular/core';
import { OnChanges, ChangeDetectorRef, SimpleChanges, TemplateRef, PipeTransform } from '@angular/core';
import { Extension, Certificate as Certificate$1 } from 'pkijs';
import * as i5 from '@clr/addons/translate';
import { InterpolationParams, AppfxTranslateService, DateTimeService, DateTimeFormatOptions } from '@clr/addons/translate';
import * as i6 from '@clr/angular';
import * as i7 from '@angular/common';
import * as i8 from '@angular/router';

/**
 * Know PKI Object Identifiers.
 *
 * This is not a complete set of OIDs but only the ones that are used throughout the certificate viewer so that they can be referred easily.
 */
declare enum KnownOids {
    CommonName = "2.5.4.3",
    Organization = "2.5.4.10",
    OrganizationalUnit = "2.5.4.11",
    KeyUsage = "2.5.29.15",
    ExtendedKeyUsage = "2.5.29.37",
    BasicCertificateConstraints = "2.5.29.19",
    ExtensionSubjectKeyId = "2.5.29.14",
    ExtensionAuthorityKeyId = "2.5.29.35",
    AuthorityInformationAccess = "1.3.6.1.5.5.7.1.1",
    SubjectAltName = "2.5.29.17",
    CertificatePolicies = "2.5.29.32",
    CrlDistributionPoints = "2.5.29.31"
}

/**
 * A translatable value that can be used as part of the certificate field value.
 *
 * This allows for flexible translation on parts of the field value after being parsed.
 */
declare class TranslatableValue {
    readonly key: string;
    readonly args?: InterpolationParams;
    constructor(key: string, args?: InterpolationParams);
    /**
     * Translate the stored translation key and interpolation arguments.
     */
    translate(translateService: AppfxTranslateService): string;
}
/**
 * Allowed value types for building the certificate field value.
 */
type ValueType = undefined | number | string | Date | TranslatableValue;
/**
 * Value wrapper that unifies the nonhomogeneous value types that are part of a single line and handles translation.
 */
declare class Value {
    readonly value: ValueType;
    constructor(value: ValueType);
    /**
     * Translate the wrapped value.
     */
    translate(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string;
    /**
     * Create a new Translatable Value from translation key and interpolation arguments.
     *
     * This is a helper constructor to simplify common usage.
     */
    static fromTranslatableKey(key: string, args?: InterpolationParams): Value;
}
/**
 * A line in the certificate field value area.
 *
 * Every line is made up of Values which can wrap either raw values or Translatable structures.
 */
declare class Line {
    readonly values: Value[];
    constructor(values: Value[]);
    /**
     * Translate and merge the separate values that make up the line.
     */
    translate(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string;
    /**
     * Create a new Line from a key-value pair with a given separator.
     *
     * This is a helper constructor to simplify common usage.
     */
    static fromPair(key: Value, value: Value, separator: string): Line;
    /**
     * Create a new Line from an unformatted hex string.
     *
     * Formats the hex string before creating the Line.
     *
     * This is a helper constructor to simplify common usage.
     *
     * @param hex The unformatted hex string that contains an even number of [a-fA-F0-9] characters.
     */
    static fromHex(hex: string): Line;
    /**
     * Create a new Line from a translatable key and interpolation arguments.
     *
     * This is a helper constructor to simplify common usage.
     * It's meant to be used if the line contains a single Translatable Value.
     */
    static fromTranslatableKey(value: string, args?: InterpolationParams): Line;
}

/**
 * A parsed certificate field to be displayed in the certificate fields tree and the value area.
 */
declare class CertificateField {
    readonly name: TranslatableValue | string;
    readonly children: CertificateField[];
    readonly lines?: Line[];
    constructor(name: TranslatableValue | string, children?: CertificateField[], lines?: Line[]);
    /**
     * Translates the filed name.
     */
    translateName(translateService: AppfxTranslateService): string;
    /**
     * Translates the filed value.
     */
    translateValue(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string;
    /**
     * Create a new CertificateField that has an untranslated valued for its name and children.
     *
     * A certificate field with children is not expected to have a value.
     *
     * This is a helper constructor to simplify common usage.
     */
    static untranslatedNameWithChildren(name: string, children: CertificateField[]): CertificateField;
    /**
     * Create a new CertificateField that has a translatable key for its name and children.
     *
     * A certificate field with children is not expected to have a value.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withChildren(translatableKey: string, children: CertificateField[]): CertificateField;
    /**
     * Create a new CertificateField that has a translatable key for its name and a single value.
     *
     * A certificate field with a value is not expected to have children.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withValue(translatableKey: string, value: ValueType): CertificateField;
    /**
     * Create a new CertificateField that has a translatable key for its name and a multi-lined value.
     *
     * A certificate field with a value is not expected to have children.
     *
     * This is a helper constructor to simplify common usage.
     */
    static withLines(translatableKey: string, lines: Line[]): CertificateField;
    /**
     * Create a new CertificateField from pkijs's Certificate Extension structure.
     *
     * This helper constructor simplifies certificate extension parsing by covering the common extensions.
     */
    static fromExtension(extension: Extension): CertificateField;
    private static extensionKeyUsage;
    private static extensionExtendedKeyUsage;
    private static extensionBasicCertificateConstraints;
    private static extensionKeyId;
    private static extensionAuthorityInfoAccess;
    private static extensionCertificatePolicies;
    private static extensionClrDistributionPoints;
    private static fromExtensionWithLines;
    private static parseGeneralNames;
    private static translatableGeneralName;
}

/**
 * Contains the Relative Distinguished Names of the subject and issuer in a given certificate.
 *
 * This structure is to be used in the general section of the certificate viewer and thus doesn't need to contain all of the RDNs.
 * Instead we're only interested in the `common name`, `organization` and `organization unit` values.
 */
declare class RelativeDistinguishedNamesModel {
    readonly commonName: string;
    readonly organization: string;
    readonly organizationalUnit: string;
    constructor(commonName: string, organization: string, organizationalUnit: string);
    /**
     * Create the RDNs model from an OID to value map.
     */
    static fromMap(map: Map<string, string>): RelativeDistinguishedNamesModel;
}
/**
 * Contains the certificate fingerprints.
 */
interface Fingerprints {
    sha1: string;
    sha256: string;
}
/**
 * The certificate model used by the certificate viewer.
 *
 * Contains all the information necessary for presenting the certificate to the user. This includes:
 * - The SHA1 and SHA256 fingerprints.
 * - The subject and issuer RDNs.
 * - The common certificate fields which are parsed and localized while the rest are presented as OIDs with hex values.
 * - The raw pkijs model.
 */
declare class Certificate {
    readonly certificate: Certificate$1;
    readonly fingerprints: Fingerprints;
    /**
     * The root of the parsed certificate fields tree.
     *
     * Meant to be rendered with a tree component.
     */
    readonly rootField: CertificateField;
    /**
     * The certificate issuer RDNs.
     */
    readonly issuer: RelativeDistinguishedNamesModel;
    /**
     * The certificate subject RDNs.
     */
    readonly subject: RelativeDistinguishedNamesModel;
    /**
     * @param certificate The pkijs Certificate model.
     * @param fingerprints The SHA-1 and SHA-256 fingerprints of the certificate.
     */
    private constructor();
    /**
     * Create a new CertificateModel form a PEM encoded certificate.
     *
     * The asn1js and pkijs libraries are used in combination to parse the PEM encoded certificate.
     */
    static fromPemEncodedCertificate(certificatePem: string): Promise<Certificate>;
    /**
     * Computes the SHA1 and SHA256 fingerprints
     */
    private static computeFingerprints;
    private static issuerRdns;
    private static subjectRdns;
    private buildFieldsTree;
    private fieldVersion;
    private fieldValidity;
    private fieldSerialNumber;
    private fieldIssuer;
    private fieldSubject;
    private fieldSignatureAlgorithm;
    private fieldSignatureValue;
    private fieldFingerprints;
    private fieldSubjectPublicKeyInfo;
    private subfieldSubjectPublicKeyValue;
    private extensions;
}

/**
 * Contains a certificate chain and provides convenient methods for accessing the common certificates of interest.
 *
 * This is linear model which is meant to be displayed in a tree structure and thus contains methods for interacting with Clarity's tree.
 */
declare class CertificateChain {
    readonly chain: Certificate[];
    /**
     * Used to resolve the next certificate in the chain beginning with the root certificate.
     */
    private readonly nextCertificateMap;
    /**
     * @param chain The parsed certificate chain.
     */
    private constructor();
    /**
     * Create a new CertificateChainModel from a PEM encoded certificate chain.
     *
     * @param pemEncodedCertificates The certificate chain where each certificate is a PEM encoded string.
     *                               It begins with the leaf certificate as the first element and ends with the root certificate.
     */
    static fromPemEncodedCertificatesChain(pemEncodedCertificates: string[]): Promise<CertificateChain>;
    /**
     * Retrieve the root certificate in the chain.
     */
    get rootCertificate(): Certificate | undefined;
    /**
     * Retrieve the leaf certificate in the chain.
     */
    get leafCertificate(): Certificate | undefined;
    /**
     * Resolve the next certificate in the chain beginning with the root certificate.
     *
     * This method is used by the certificate details tree which begins with the root certificate in the chain.
     *
     * Confusion may arise here since the RFC-5246 certificate chain array begins with the leaf certificate and ends with the root certificate
     * but the tree renders it in reverse order which is more intuitive to the user.
     */
    nextCertificateInChain(certificate?: Certificate): Certificate | undefined;
}

/**
 * HTML supported heading levels. If you provide any other number the headings will be rendered using
 * role="heading" and aria-level="{{ level }}".
 */
type TopHeadingLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Displays detailed information about a X.509 certificate chain.
 *
 * The component renders information for a PEM encoded certificate chain in two separate sections.
 * 1. The former is the general tab which contains common information for the leaf certificate
 *    like validity, subject, issuer and fingerprints.
 * 2. The latter is the details tab contains the whole certificate chain with each individual
 *    certificate's fields and their corresponding values. The most common fields are presented
 *    in a localized human readable format. The rest of the fields are presented as PKI object
 *    identifiers (OIDs) and their values are rendered as a formatted hex string.
 *
 * @example <caption>A certificate chain</caption>
 * ```html
 * <appfx-certificate-viewer [pemEncodedCertificatesChain]="pemEncodedCertificatesChain">
 * </appfx-certificate-viewer>
 * ```
 */
declare class CertificateViewerComponent implements OnChanges {
    private cdr;
    readonly KnownOids: typeof KnownOids;
    /**
     * Accepts a certificate chain where each certificate is PEM encoded.
     * The first element is the leaf certificate and the last element is the root certificate.
     * This order is described in the TLS 1.2 RFC section 7.4.2.
     */
    pemEncodedCertificatesChain: string[];
    /**
     * The top heading level for this component.
     * All nested headings are incremented automatically. Use to satisfy WCAG heading hierarchy.
     */
    topHeadingLevel: TopHeadingLevel;
    certificateChain?: CertificateChain;
    parseError?: string;
    loading: boolean;
    private certificateChainPromise?;
    constructor(cdr: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    private parseCertificateChain;
    static ɵfac: i0.ɵɵFactoryDeclaration<CertificateViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CertificateViewerComponent, "appfx-certificate-viewer", never, { "pemEncodedCertificatesChain": { "alias": "pemEncodedCertificatesChain"; "required": false; }; "topHeadingLevel": { "alias": "topHeadingLevel"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * The details section of the certificate viewer.
 *
 * This section allows for exploring the provided certificate chain. It's comprised of a certificate chain tree,
 * a selected certificate fields tree and a selected field value.
 *
 * - The certificate chain tree is a linear tree that represents the certificate chain hierarchy.
 *   Selecting a node in this tree populates the fields tree with their respective values.
 * - The fields tree is an explorer for all of the selected certificate fields. The most commonly used fields are
 *   localized and their values are converted to a human-readable format.
 * - The field value is a monospace area that contains the value of the selected field from the fields tree.
 */
declare class CertificateViewerDetailsComponent implements OnChanges {
    certificateChain?: CertificateChain;
    topHeadingLevel: TopHeadingLevel;
    headingTemplate: TemplateRef<unknown>;
    selectedCertificate?: Certificate;
    selectedCertificateField?: CertificateField;
    ngOnChanges(changes: SimpleChanges): void;
    selectCertificate(certificate?: Certificate): void;
    selectCertificateField(certificateField?: CertificateField): void;
    isSelected(certificate?: Certificate): boolean;
    isSelectedField(certificateField?: CertificateField): boolean;
    getNextCertificate: (certificate?: Certificate) => Certificate[];
    getFieldsChildren: (certificateField?: CertificateField) => CertificateField[];
    static ɵfac: i0.ɵɵFactoryDeclaration<CertificateViewerDetailsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CertificateViewerDetailsComponent, "appfx-certificate-viewer-details", never, { "certificateChain": { "alias": "certificateChain"; "required": false; }; "topHeadingLevel": { "alias": "topHeadingLevel"; "required": false; }; "headingTemplate": { "alias": "headingTemplate"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * The general section of the certificate viewer.
 *
 * This section contains the leaf certificate's:
 * 1. Subject (Issuer To) and Issuer (Issuer By) common RDNs:
 *   - Common Name
 *   - Organization
 *   - Organization Unit
 * 2. Validity period
 * 3. Fingerprints (SHA-1 and SHA-256)
 */
declare class CertificateViewerGeneralComponent {
    readonly KnownOids: typeof KnownOids;
    readonly dateTimeFormat: DateTimeFormatOptions;
    certificate?: Certificate;
    topHeadingLevel: TopHeadingLevel;
    headingTemplate: TemplateRef<unknown>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CertificateViewerGeneralComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CertificateViewerGeneralComponent, "appfx-certificate-viewer-general", never, { "certificate": { "alias": "certificate"; "required": false; }; "topHeadingLevel": { "alias": "topHeadingLevel"; "required": false; }; "headingTemplate": { "alias": "headingTemplate"; "required": false; }; }, {}, never, never, false, never>;
}

declare class CertificateViewerTranslateFieldPipe implements PipeTransform {
    private readonly appfxTranslateService;
    private readonly dateTimeService;
    constructor(appfxTranslateService: AppfxTranslateService, dateTimeService: DateTimeService);
    transform(field: CertificateField | undefined, prop: 'name' | 'value'): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CertificateViewerTranslateFieldPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<CertificateViewerTranslateFieldPipe, "translateField", false>;
}

declare class AppfxCertificateViewerModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxCertificateViewerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxCertificateViewerModule, [typeof CertificateViewerComponent, typeof CertificateViewerDetailsComponent, typeof CertificateViewerGeneralComponent, typeof CertificateViewerTranslateFieldPipe], [typeof i5.AppfxTranslateModule, typeof i6.ClrAlertModule, typeof i6.ClrSpinnerModule, typeof i6.ClrTabsModule, typeof i6.ClrTreeViewModule, typeof i7.CommonModule, typeof i8.RouterModule], [typeof CertificateViewerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxCertificateViewerModule>;
}

export { AppfxCertificateViewerModule, CertificateViewerComponent, AppfxCertificateViewerModule as CertificateViewerModule };
