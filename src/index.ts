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

const octokit = new Octokit(
    {
        auth: process.env.TBP_BOT_PAT
    }
);

const contributors = await octokit.rest.teams.listMembersInOrg(
    {
        org: "numenta",
        team_slug: "nupic-contrib"
    }
)

console.log(contributors);

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
