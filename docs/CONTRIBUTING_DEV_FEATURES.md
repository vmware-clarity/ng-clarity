# Contribution process for developers (components, features, large refactorings)

If you plan on contributing code to Clarity, please follow this step-by-step
process to reduce the risk of significant changes being requested when you
submit your pull request. We'll work with you on every step and try to be as
responsive as possible.

## I. Proposal template

Before you start coding anything, please fill out the following proposal
template in as much detail as you can. The more complete your details, the
better, but not all questions will apply for every change. As you fill this out,
please make sure to follow our coding guidelines for components.

- [Angular Guidelines](/docs/CODING_GUIDELINES.md)

```markdown
## Summary

Describe the change or feature in detail. Try to answer the following questions.

- What is the change?
- What is a use case for this change?
- Why should it go in Clarity?
- Is this a change to an Angular Component or a Web Component?
- Does this change impact existing behaviors? If so, how?
- If this change introduces a new behavior, is this behavior accessible?

## Examples

_If possible, show examples of the change. You may create one yourself, or link to external sites that have the idea. It can also be beneficial to prototype the idea in isolation outside of Clarity with a Plunkr or Stackblitz example._

## API

_Describe the intended API for the feature you want to add. This would include:_

- CSS classes and DOM structure for pure static UI contribution
- If Angular: any inputs/outputs, components, directives, services, or anything that is exported publicly for Angular contributions.
- If Web Component: any properties, events, slots, or attributes.
- Examples of code snippets using this new feature.
- Note very clearly if anything **might** be a breaking change.

_In the case of bug fixes or internal changes, there will most likely be no API changes._

## Implementation Plan

_Describe how you plan to implement the feature, answering questions among the following or anything else you deem relevant._

- What parts of the code are affected?
- Will you introduce new services, components, or directives?
- Can you describe the basic flow of information between classes?
- Does this introduce asynchronous behaviors?
- Will you need to refactor existing Clarity code?
- Will reasonable performance require optimizations?
- Will it need to access native elements (and be incompatible with server-side rendering)?

## Conclusion

_Describe how long you expect it to take to implement, what help you might need, and any other details that might be helpful. Don't worry, this is non-contractual. 😛_
```

Once it's ready, post it either on the original GitHub issue for bug fixes or in
a new issue otherwise. If you are planning on implementing an already designed
component, please mention the issue containing the existing specification in
your proposal. If the original issue hasn't been updated in a while, please ping
@coryrylan or @mathisscott. We will start the discussion as
soon as possible.

We will discuss the proposal with you publicly on the issue, potentially
requesting changes, and hopefully, accept it.

## II. Implementation on a topic branch

### Prerequisites

Please check the [Prerequisites section in the "Contribution process for developers" document](CONTRIBUTING_DEVELOPMENT.md#prerequisites) if
you haven't already done so.
It will help you set up your project, create a fork, learn how to form your commit messages and create Pull Requests (PRs)

The main difference, which is specific for workin on a big feature/component or refactoring large part of the code is that you need to work
against a topic branch:

### Topic branch

When we post on the issue to approve your proposal, the person on the team
who'll be your primary contact will post a link to a topic branch against which
you will submit your pull requests. The topic branch will be branched from the
latest `main` and named `topic/{feature-name}`. To merge any pull request into
this branch, it will need 2 approvals from team members.

After creating youor fork, as specified [here](CONTRIBUTING_DEVELOPMENT.md#getting-started) you will need to checkout your topic branch

```shell
## Check out the upstream a topic branch for your changes
git fetch
git checkout -b topic/feature-name upstream/topic/feature-name
```

### Starting the project

You can check our Prerequisites if you need help on [Starting the project](CONTRIBUTING_DEVELOPMENT.md#starting-the-project)

### Code changes

You make all your changes locally and submit them against your own fork.

#### Commits

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

#### Public API changes

If you make changes to the API, you also need to update our API files, or the CI job on Github will fail.
Details how to do it are available here: [Public API Changes](CONTRIBUTING_DEVELOPMENT.md#public-api-changes)

### Submitting pull requests

As you implement your contribution, make sure all work stays on your local topic
branch. When an isolated part of the feature is complete with unit tests, make
sure to submit your pull request **against the topic branch** on the main
Clarity repository instead of `main`. This will allow us to accept and merge
partial changes that shouldn't make it into a production release of Clarity yet.
We expect every pull request to come with exhaustive unit tests for the
submitted code.

**Do not, at any point, rebase your local topic branch on newer versions of `angular` while your work is still in progress!**
This will create issues both for you, the reviewers, and maybe even other
developers who might submit additional commits to your topic branch if you
requested some help.

To make sure your pull request will pass our automated testing, before submitting
you should:

- Make sure `npm run build:ci` passes for each of them.
  For individual lint failures, you will have to fix them manually.

If everything passes, you can push your changes to your fork of Clarity, and [submit a pull request](https://help.github.com/articles/about-pull-requests/).

- Assign yourself to the Pull-Request
- Assign proper labels for example if you are making documentation update only use `documentation`, `website`
- Assign connected Issue that this PR will resolve

### Taking reviews into account

During the review process of your pull request(s), some changes might be
requested by Clarity team members. If that happens, add extra commits to your
pull request to address these changes. Make sure these new commits are also
signed and follow our commit message format.

Please keep an eye on your Pull-Request and try to address the comments, if any,
as soon as possible.

### Shipping it

Once your contribution is fully implemented, reviewed, and ready, we will rebase
the topic branch on the newest `main` and squash down to fewer commits if
needed (keeping you as the author, obviously).

```bash
$ git rebase -i main

# Rebase commits and resolve conflict, if any.

$ git push origin branch -f
```

Chances are, we will be more familiar with potential conflicts that might happen,
but we can work with you if you want to solve some conflicts yourself. Once
rebased, we will merge the topic branch into `main`, which involves a quick
internal pull request you don't have to worry about, and we will finally delete
the topic branch.

At that point, your contribution will be available in the next official release
of Clarity.
