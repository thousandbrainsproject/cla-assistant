# CLA Assistant

This GitHub Action checks if a pull request author has signed the CLA and adds a comment to the pull request if they haven't.

> [!NOTE]
> CLA Assistant checks membership of the CLA signatories database to determine CLA signatories.

## Prerequisites

- The repository using this action must have configured GitHub secrets with the names `CLA_ASSISTANT_ACCESS_KEY_ID` and `CLA_ASSISTANT_SECRET_ACCESS_KEY` that correspond to the AWS credentials of the `cla-assistant` user with access to the CLA signatories database.

## Security Considerations

The `CLA_ASSISTANT_ACCESS_KEY_ID` and `CLA_ASSISTANT_SECRET_ACCESS_KEY` secrets are used to authenticate the `cla-assistant` user when checking whether CLA was signed. To access these secrets, the action should be triggered only on the `pull_request_target` event (configured repository secrets are unavailable otherwise). This means the YAML describing a workflow that uses this action should be in the `main` branch of the repository for the action to trigger. Consequently, troubleshooting the workflow on a pull request branch will not work as no changes will take effect until merged into `main`.

> [!NOTE]
> While the secret names configured in the repository have the `CLA_ASSISTANT_` prefix, for ease of integration with the `aws-sdk`, use `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variable names when configuring the action itself. See example below.

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
          AWS_ACCESS_KEY_ID: ${{ secrets.CLA_ASSISTANT_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.CLA_ASSISTANT_SECRET_ACCESS_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          pull-request-author: ${{ github.event.pull_request.user.login }}
          pull-request-number: ${{ github.event.pull_request.number }}
          repo-owner: thousandbrainsproject
          repo-name: tbp.monty
```

## Development

This action is integrated with GitHub Actions, so it needs to include the `dist` directory in the commit.

To update the action, run `npm run build` to generate the `dist` directory, commit the changes, and open a pull request.
