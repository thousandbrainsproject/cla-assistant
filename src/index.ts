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

console.log("2024-10-18 10:12");

if (!process.env.TBP_BOT_TOKEN_SECRET)
{
    console.error("TBP_BOT_TOKEN_SECRET is not set.");
}

const octokit = new Octokit(
    {
        auth: process.env.TBP_BOT_TOKEN_SECRET
    }
);

const claSignatories = await octokit.paginate(
    octokit.rest.teams.listMembersInOrg,
    {
        org: "numenta",
        team_slug: "nupic-contrib"
    }
);

const pullRequestAuthor = core.getInput("pull-request-author") || core.getInput("who-to-greet");

const prAuthorCLASignatory = claSignatories.find(signatory => signatory.login == pullRequestAuthor);

if (!prAuthorCLASignatory)
{
    core.setFailed(`${pullRequestAuthor} has not signed the CLA.`);
}
else
{
    console.log(`${pullRequestAuthor} has signed the CLA.`);
}

try
{
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}`);

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
}
catch (error)
{
    core.setFailed(error.message);
}
