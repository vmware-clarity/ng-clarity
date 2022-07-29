# Contribution process for developers (bug fixes and small features)

Contribution of a bug fix, or a small, singular feature, gets started by creating an issue in this repository. Once it is confirmed it is a valid request, it can be open for contribution. The process is the same as for any other Github based project.

## Prerequisites

Please check the [Prerequisites section in the "Contribution process for developers" document](CONTRIBUTING_DEVELOPMENT.md#prerequisites)
if you haven't done already. It contains information about code styling requirements, DCO code signing requirements, setting up and running
the project.

## Forking the repository

You need to fork our repository from the Github website UI and then work against your fork. This is needed for creating Pull Requests (PRs) later
and also helps for easily updating your PR, squashing the changes before commit, etc.

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

You can find more details in [Prerequisites](CONTRIBUTING_DEVELOPMENT.md#prerequisites)

## Code changes

You make all your changes locally and submit them against your own fork.

### Commits

Your commit messages should follow a specific format. This is an example of a valid commit message:

```
fix(date-picker): adds aria-labels for buttons

- adds proper labels for all datepicker buttons
- adds live region for calendar view that updates month/year values for screen readers
- adds live region to year view that updates the decade range for screen readers
- updates templates for ClrCommonStringsService

Close: #4242

Signed-off-by: Your Name <your.email@example.com>
```

Deeper details about the format can be found here: [Commits](CONTRIBUTING_DEVELOPMENT.md#commits)

### Public API changes

If you make changes to the API, you also need to update our API files, or the CI job on Github will fail.
Details how to do it are available here: [Public API Changes](CONTRIBUTING_DEVELOPMENT.md#public-api-changes)

## Pull requests

After your commits are ready you have to push them against your fork in Github.
Then you need to create a pull request from the Github web page of your fork, by clicking the `Open pull request` button in the `Contribute` menu.
[Github article on submitting a pull request](https://help.github.com/articles/about-pull-requests/)

A pull request will be created in https://github.com/vmware-clarity/ng-clarity/pulls which you should follow for reviews, questions,
requests for code changes and finally your code will be merged and the PR closed by the Clarity team.

Your change will be delivered with the next Clarity release.

## Backporting to an older version

In some cases, you will have to backport the changes into the older version.
Everything is the same here, only the target branch will be the older version
that is affected. If you are an external contributor, we will handle the
backport for you.
