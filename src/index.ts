/**
 * Copyright (C) 2024 Numenta Inc. All rights reserved.
 *
 * The information and source code contained herein is the
 * exclusive property of Numenta Inc. No part of this software
 * may be used, reproduced, stored or distributed in any form,
 * without explicit written authorization from Numenta Inc.
 */
import core from "@actions/core";

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