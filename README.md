# CLA Assistant

This GitHub Action checks if a pull request author has signed the CLA and adds a comment to the pull request if they haven't.

> [!NOTE]
> CLA Assistant checks membership of the https://github.com/orgs/numenta/teams/nupic-contrib team to determine CLA signatories.

## Prerequisites

- The repository using this action must have a configured GitHub secret with the name `TBP_BOT_TOKEN_SECRET` that is a classic token secret for the https://github.com/tbp-bot. The scope for the token must include `repo` (all) and `read:org`.

> [!NOTE]
> https://github.com/tbp-bot must be a member of the Numenta organization to be able to read team membership.

## Security Considerations

The `TBP_BOT_TOKEN_SECRET` secret is used to authenticate the `tbp-bot` user when checking team membership. To access this secret, the action should be triggered only on the `pull_request_target` event (configured repository secrets are unavailable otherwise). This means the YAML describing a workflow that uses this action should be in the `main` branch of the repository for the action to trigger. Consequently, troubleshooting the workflow on a pull request branch will not work as no changes will take effect until merged into `main`.

## Usage

Example workflow:

```yaml
name: CLA

on:
  pull_request_target:
    branches:
      - main

jobs:

  verify_cla:
    name: verify-cla
    runs-on: ubuntu-latest
    steps:
      - name: "Verify CLA"
        uses: thousandbrainsproject/cla-assistant@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          TBP_BOT_TOKEN_SECRET: ${{ secrets.TBP_BOT_TOKEN_SECRET }}
        with:
          pull-request-author: ${{ github.event.pull_request.user.login }}
          pull-request-number: ${{ github.event.pull_request.number }}
          repo-owner: thousandbrainsproject
          repo-name: tbp.monty
```

## Development

This action is integrated with GitHub Actions, so it needs to include the `dist` directory in the commit.

To update the action, run `npm run build` to generate the `dist` directory, commit the changes, and open a pull request.
