# Publishing Clarity

Public releases are automatically handled through the following GitHub workflows:

`build`: This workflow runs automatically when code a PR is opened or updated. It will:

- verify all lint rules pass
- verify the project builds
- verify all tests pass
- verify any changes to the public api have been accepted
- publish a preview of the demo app

---

`preview`: This workflow must be triggered manually. It will:

- verify all lint rules pass
- verify the project builds
- verify all tests pass
- verify any changes to the public api have been accepted
- generate a preview of the release
- publish a preview of the demo app

---

`release`: This workflow must be triggered manually. It will:

- verify all lint rules pass
- verify the project builds
- verify all tests pass
- verify any changes to the public api have been accepted
- tag the latest commit with the new version number
- publish a GitHub release
- publish @clr/angular and @clr/ui packages to npm
- publish a release notification to [VMware internal Slack channel #clarity](https://vmware-clarity.slack.com/archives/CBZB6LZ39)
- publish the demo app

---

`bot`: This workflow runs automatically whenever a PR is opened or updated. It will:

- comment on a PR whenever a `build` workflow is started or completed
