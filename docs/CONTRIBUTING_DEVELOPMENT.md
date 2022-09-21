# Contribution process for developers

Contributing to Clarity is no different than contributing to any other Github project.

Bug fixes and small features follow a simple scenario, where you fork our repository,
make your changes, submit them against your own fork and then create a Pull Request (PR).

- [Contributing bug fixes and small features](CONTRIBUTING_DEV_BUG_FIXES.md)

For new components, large features or code refactorings, we need to coordinate more on the goals of the task
before you start, so you need to fill in a Proposal Template. Also, as this can take
more time, you will be working against a topic branch.

- [Contributing large component, features or refactorings](CONTRIBUTING_DEV_FEATURES.md)

That's it!

---

The rest of this document can be used as reference to what our prerequisites are, coding guidelines,
getting started guide, running the project, updating the API changes, creating a proper commit message,
backporting to older versions.

## Prerequisites

First, make sure you:

- Read our [Developer Certificate of Origin](https://cla.vmware.com/dco). All
  contributions to this repository must be signed as described on that page.
  Your signature certifies that you wrote the patch or have the right to pass it
  on as an open-source patch.
- Read our [Angular coding guidelines](/CODING_GUIDELINES_ANGULAR.md) and [Web Component coding guidelines](/CODING_GUIDELINES_CORE.md).

### Getting started

Start by [forking](https://help.github.com/articles/fork-a-repo/) the main
Clarity repository, and follow the instructions in the previous link to clone
your fork and set the upstream remote to the main Clarity repository. Because of
the DCO, set your name and e-mail in the Git configuration for signing. Finally,
create a local topic branch from the upstream `topic/{feature-name}` mentioned
above.

For instance, this setup part could look like this:

```shell
## Clone your forked repository
git clone git@github.com:<github username>/ng-clarity.git

## Navigate to the directory
cd clarity

## Set name and e-mail configuration
git config user.name "John Doe"
git config user.email johndoe@example.com

## Setup the upstream remote
git remote add upstream https://github.com/vmware-clarity/ng-clarity.git
```

### Starting the project

Once you have the project checked out with a fork you will need to run some step
steps.

1.  Have [NodeJS](https://nodejs.org) installed
2.  In the root project directory run, `npm install`
3.  Run `npm run build` to build entire project (this may take several minutes)
4.  Startup the demo project: `npm start`
5.  To run tests and other project-specific commands see our project [Build Guide](/docs/BUILD.md)

### Public API Changes

If you are making a change that changes the public API of a Component make sure
to discuss this within a proposal issue with a Clarity team member. A proposal
allows us to plan out potential breaking changes if necessary and review the API
changes. If a public API change is approved you will have to update our API
files which track our public API surface.

To update the API files follow these steps:

1.  Make public API change
2.  Run `npm run build`
3.  Run `npm run public-api:update` this should fail

### Commits

For your commit message, please use the following format:

```
<type>(optional scope): <description>
 < BLANK LINE >

[optional body]
[optional Github closing reference]

 < BLANK LINE >
Signed-off-by: Your Name <your.email@example.com>
```

`type` - could be one of `feat`, `fix`, `chore`.

Set scope of the commit if possible:

- a11y
- accordion
- alert
- badge
- build
- button
- card
- checkbox
- datagrid
- date-picker
- dropdown
- form
- grid
- header
- icons
- i18n
- input
- label
- list
- login
- modal
- password
- progress-bar
- radio
- select
- sidenav
- signpost
- spinner
- stack-view
- stepper
- table
- tabs
- textarea
- timeline
- toggle
- tooltip
- tree-view
- vertical-nav
- wizard

For example, a commit message could look like this:

```
fix(date-picker): adds aria-labels for buttons

- adds proper labels for all datepicker buttons
- adds live region for calendar view that updates month/year values for screen readers
- adds live region to year view that updates the decade range for screen readers
- updates templates for ClrCommonStringsService

Close: #4242

Signed-off-by: Your Name <your.email@example.com>
```

These documents provide guidance creating a well-crafted commit message:

- [Angular commit message format](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#commit-message-format)
- [How to Write a Git Commit Message](http://chris.beams.io/posts/git-commit/)
- [Closing Issues Via Commit Messages](https://help.github.com/articles/closing-issues-via-commit-messages/)
- [Conventional Commits ](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
- [Github: Closing issues using keywords](https://help.github.com/en/articles/closing-issues-using-keywords)
