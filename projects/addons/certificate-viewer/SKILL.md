---
name: appfx-certificate-viewer
description: Display parsed X.509 certificate chains (general info and detailed field tree per certificate) with the AppFX certificate viewer (`<appfx-certificate-viewer>` from `@clr/addons/certificate-viewer`) from PEM strings. Use when showing SSL/TLS certificates, PEM certificate chains, or adding an `appfx-certificate-viewer`.
metadata:
  docs: /documentation/certificate-viewer
---

# AppFX certificate viewer (`appfx-certificate-viewer`)

## When to use

Use whenever the UI shows the contents of an X.509 certificate or chain (thumbprints, issuer, subject, validity, extensions). It parses PEM in the browser and renders tabs, a tree of fields, a spinner while parsing, and an error alert for invalid input. There is no plain Clarity equivalent.

## Setup

```ts
import { AppfxCertificateViewerModule } from '@clr/addons/certificate-viewer';

@Component({
  imports: [AppfxCertificateViewerModule],
  // ...
})
```

The component is NgModule-declared (not standalone). `CertificateViewerModule` is a deprecated alias; import `AppfxCertificateViewerModule`.

## Usage

```ts
// leaf first, then intermediates, then root
pemChain: string[] = [
  '-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----',
  '-----BEGIN CERTIFICATE-----\nMIIF...\n-----END CERTIFICATE-----',
];
```

```html
<appfx-certificate-viewer [pemEncodedCertificatesChain]="pemChain" [topHeadingLevel]="3"></appfx-certificate-viewer>
```

Inside a modal:

```html
<clr-modal [(clrModalOpen)]="open" clrModalSize="lg">
  <h3 class="modal-title">Certificate</h3>
  <div class="modal-body">
    <appfx-certificate-viewer [pemEncodedCertificatesChain]="pemChain" [topHeadingLevel]="4"></appfx-certificate-viewer>
  </div>
</clr-modal>
```

## Rules

- `pemEncodedCertificatesChain` is a `string[]`, one full PEM block (with BEGIN/END lines) per entry. Assign a new array to re-parse; parsing runs on input change.
- Set `topHeadingLevel` (1–5, default 5) so headings fit the page outline — one level below the surrounding heading.
- Field labels are translated through AppFX translate; sync the locale via `AppfxTranslateService` (see the appfx-translate skill).

## References

- API: `projects/addons/certificate-viewer/certificate-viewer.api.md`
- Demos: `projects/website/src/app/documentation/demos/certificate-viewer/`, `.storybook/stories/addons/`
