/**
 * Copyright (C) 2024 Numenta Inc. All rights reserved.
 *
 * The information and source code contained herein is the
 * exclusive property of Numenta Inc. No part of this software
 * may be used, reproduced, stored or distributed in any form,
 * without explicit written authorization from Numenta Inc.
 */
import * as core from "@actions/core";
import { DynamoDBClient, GetItemCommand, GetItemInput } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Octokit } from "octokit";

const CLA_LINK = "https://github.com/thousandbrainsproject/cla/issues/new?template=01_sign_cla.yml&labels=signature+CLA+v1&title=Contributor+License+Agreement+v1+Signature";
const CLA_SIGNATORIES_TABLE_NAME = "DynamoDB-CLASignatoriesTable-12GCQ0F0TB473";


const prAuthor = core.getInput("pull-request-author");

const dynamodb = new DynamoDBClient(
    {
        credentials: fromEnv(),
        region: "us-east-2"
    }
);
const getSignatory: GetItemInput =
{
    TableName: CLA_SIGNATORIES_TABLE_NAME,
    Key: marshall(
        {
            username: prAuthor
        }
    )
};
const getSignatoryCommand = new GetItemCommand(getSignatory);
const { Item: signatory } = await dynamodb.send(getSignatoryCommand);

if (signatory)
{
    console.log(`${prAuthor} has signed the CLA.`);
    process.exit(0);
}

const prNumberStr = core.getInput("pull-request-number");
const prNumber = parseInt(prNumberStr);
const repoOwner = core.getInput("repo-owner");
const repoName = core.getInput("repo-name");

core.setFailed(`${prAuthor} has not signed the CLA.`);

const prOctokit = new Octokit(
    {
        auth: process.env.GITHUB_TOKEN
    }
);

// Check if the pull request has already been commented on
const existingComments = await prOctokit.paginate(
    prOctokit.rest.issues.listComments,
    {
        owner: repoOwner,
        repo: repoName,
        issue_number: prNumber
    }
);
let alreadyCommented = false;
for (const comment of existingComments)
{
    if (comment.body.includes(`Thank you for your contribution @${prAuthor}!`) &&
        comment.body.includes(`It appears that you haven't signed our Contributor License Agreement yet.`) &&
        comment.body.includes(`Please [visit this link and sign](${CLA_LINK}).`)
    )
    {
        alreadyCommented = true;
        break;
    }
}

if (alreadyCommented)
{
    console.log("Already commented with CLA link on the pull request.");
    process.exit(1);
}

const commentBody = `\
Thank you for your contribution @${prAuthor}!

It appears that you haven't signed our Contributor License Agreement yet.

**Please [visit this link and sign](${CLA_LINK}).**
`;

await prOctokit.rest.issues.createComment(
    {
        owner: repoOwner,
        repo: repoName,
        issue_number: prNumber,
        body: commentBody
    }
);
console.log("Created comment with CLA link on the pull request.");
process.exit(1);