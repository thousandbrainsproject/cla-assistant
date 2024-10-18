/**
 * Copyright (C) 2024 Numenta Inc. All rights reserved.
 *
 * The information and source code contained herein is the
 * exclusive property of Numenta Inc. No part of this software
 * may be used, reproduced, stored or distributed in any form,
 * without explicit written authorization from Numenta Inc.
 */
import * as core from "@actions/core";
import { Octokit } from "octokit";

const CLA_LINK = "https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhA-C5ccSQcDGY-PiamH4HnZdj5p2I1oDc8FiBJ_23pReFeauFhfcIkC1XfzxC2qnBQ*";

// TODO: Update after renaming TBP_BOT_PAT to TBP_BOT_TOKEN_SECRET in nupic.monty
const TBP_BOT_TOKEN_SECRET = process.env.TBP_BOT_PAT;

if (!TBP_BOT_TOKEN_SECRET)
{
    core.setFailed("TBP_BOT_TOKEN_SECRET is not set.");
    process.exit(1);
}

const tbpBotOctokit = new Octokit(
    {
        auth: TBP_BOT_TOKEN_SECRET
    }
);

const claSignatories = await tbpBotOctokit.paginate(
    tbpBotOctokit.rest.teams.listMembersInOrg,
    {
        org: "numenta",
        team_slug: "nupic-contrib"
    }
);

const prAuthor = core.getInput("pull-request-author");
const prNumber = parseInt(core.getInput("pull-request-number"));
const repoOwner = core.getInput("repo-owner");
const repoName = core.getInput("repo-name");

const prAuthorCLASignatory = claSignatories.find(signatory => signatory.login == prAuthor);

if (prAuthorCLASignatory)
{
    console.log(`${prAuthor} has signed the CLA.`);
    process.exit(0);
}

core.setFailed(`${prAuthor} has not signed the CLA.`);

const prOctokit = new Octokit(
    {
        auth: process.env.GITHUB_TOKEN
    }
);

await prOctokit.rest.issues.createComment(
    {
        owner: repoOwner,
        repo: repoName,
        issue_number: prNumber,
        body: `Thank you for your contribution @${prAuthor}!\n\nIt appears that you haven't signed our Contributor License Agreement yet.\n\n**Please [visit this link and sign](${CLA_LINK}).**`
    }
);
console.log("Comment with CLA link posted on the pull request.");
process.exit(1);